import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  Firestore 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { BudgetQuote } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Auth instance
export const auth = getAuth(app);

// Firestore instance (Targeting the specific database ID from config)
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Sign in anonymously on start to ensure user has a valid session
let currentUser: User | null = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

export async function ensureAuth(): Promise<User | null> {
  if (auth.currentUser) return auth.currentUser;
  try {
    const userCred = await signInAnonymously(auth);
    currentUser = userCred.user;
    return currentUser;
  } catch (error) {
    console.warn('Anonymous auth failed or disabled, continuing with unauthenticated firestore:', error);
    return null;
  }
}

// Collections
const QUOTES_COLLECTION = 'quotes';

// Save or update quote in Firestore
export async function saveQuoteToFirestore(quote: BudgetQuote): Promise<void> {
  try {
    const quoteRef = doc(db, QUOTES_COLLECTION, quote.id);
    const payload = {
      ...quote,
      updatedAt: Date.now(),
    };
    await setDoc(quoteRef, payload, { merge: true });
  } catch (err) {
    console.error('Error saving quote to Firestore:', err);
    throw err;
  }
}

// Delete quote from Firestore
export async function deleteQuoteFromFirestore(quoteId: string): Promise<void> {
  try {
    const quoteRef = doc(db, QUOTES_COLLECTION, quoteId);
    await deleteDoc(quoteRef);
  } catch (err) {
    console.error('Error deleting quote from Firestore:', err);
    throw err;
  }
}

// Subscribe to real-time quotes in Firestore
export function subscribeToQuotes(
  onQuotesReceived: (quotes: BudgetQuote[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(collection(db, QUOTES_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: BudgetQuote[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as BudgetQuote);
        });
        onQuotesReceived(list);
      },
      (err) => {
        console.error('Firestore subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (e) {
    console.error('Failed to setup Firestore listener', e);
    return () => {};
  }
}
