import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Eye, 
  Download, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Store, 
  ExternalLink,
  Save,
  ArrowRight,
  CloudCheck
} from 'lucide-react';
import { BudgetQuote } from './types';
import { INITIAL_QUOTE } from './data/initialData';
import { Header } from './components/Header';
import { QuoteForm } from './components/QuoteForm';
import { ItemsManager } from './components/ItemsManager';
import { DocumentPreview } from './components/DocumentPreview';
import { PresetsModal } from './components/PresetsModal';
import { HistoryModal } from './components/HistoryModal';
import { generateQuotePDF } from './utils/pdfGenerator';
import { generateQuoteId, getTodayDateString, formatCurrency } from './utils/formatters';
import { 
  ensureAuth, 
  saveQuoteToFirestore, 
  deleteQuoteFromFirestore, 
  subscribeToQuotes 
} from './lib/firebase';

const STORAGE_KEY = 'ti_budget_quotes_v4';
const ACTIVE_ID_KEY = 'ti_active_quote_id_v4';

export default function App() {
  const [quotes, setQuotes] = useState<BudgetQuote[]>([INITIAL_QUOTE]);
  const [activeQuoteId, setActiveQuoteId] = useState<string>(INITIAL_QUOTE.id);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Salvo no Firebase!');
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  // Active quote object
  const currentQuote = quotes.find((q) => q.id === activeQuoteId) || quotes[0] || INITIAL_QUOTE;

  // Setup Firebase Auth and Realtime Subscription
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initFirebase() {
      try {
        await ensureAuth();
        setIsFirebaseReady(true);

        unsubscribe = subscribeToQuotes(
          (cloudQuotes) => {
            if (cloudQuotes && cloudQuotes.length > 0) {
              setQuotes(cloudQuotes);
              // If active quote is not in cloud list, set to first
              setActiveQuoteId((prev) => {
                const exists = cloudQuotes.some((q) => q.id === prev);
                return exists ? prev : cloudQuotes[0].id;
              });
            } else {
              // Cloud has no quotes yet -> Keep virgin initial quote
              setQuotes([INITIAL_QUOTE]);
              setActiveQuoteId(INITIAL_QUOTE.id);
            }
          },
          (err) => {
            console.warn('Fallback to local storage due to Firestore listener notice:', err);
          }
        );
      } catch (err) {
        console.error('Firebase initialization error:', err);
      }
    }

    initFirebase();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Debounced auto-save to Firestore whenever currentQuote changes
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveToCloud = (quoteToSave: BudgetQuote) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveQuoteToFirestore(quoteToSave);
      } catch (e) {
        console.warn('Could not save to Firestore, stored locally', e);
      }
    }, 800);
  };

  // Update current quote
  const handleUpdateCurrentQuote = (updates: Partial<BudgetQuote>) => {
    const updated = { ...currentQuote, ...updates };
    setQuotes((prev) =>
      prev.map((q) => (q.id === currentQuote.id ? updated : q))
    );
    saveToCloud(updated);
  };

  // Create new blank quote
  const handleNewQuote = async () => {
    const newQuote: BudgetQuote = {
      id: `quote-${Date.now()}`,
      quoteNumber: generateQuoteId(),
      title: '',
      requesterName: currentQuote.requesterName || '',
      department: currentQuote.department || 'T.I / Suporte',
      approverBoss: currentQuote.approverBoss || '',
      date: getTodayDateString(),
      urgency: 'media',
      status: 'rascunho',
      companyName: currentQuote.companyName || '',
      ticketNumber: '',
      justification: '',
      observations: '',
      createdAt: Date.now(),
      items: [
        {
          id: `item-${Date.now()}-1`,
          name: '',
          category: 'Hardware & Peças',
          hasInStock: false,
          stockQuantity: 0,
          quantityNeeded: 1,
          quantityToBuy: 1,
          unitPrice: 0,
          purchaseUrl: '',
          supplier: '',
          notes: '',
        },
      ],
    };

    setQuotes((prev) => [newQuote, ...prev]);
    setActiveQuoteId(newQuote.id);
    setActiveTab('editor');
    triggerSaveToast('Novo orçamento em branco criado e salvo na nuvem!');
    try {
      await saveQuoteToFirestore(newQuote);
    } catch (e) {
      console.warn('Firestore initial save error', e);
    }
  };

  // Duplicate quote
  const handleDuplicateQuote = async (quoteToCopy: BudgetQuote) => {
    const duplicated: BudgetQuote = {
      ...quoteToCopy,
      id: `quote-${Date.now()}`,
      quoteNumber: generateQuoteId(),
      title: quoteToCopy.title ? `${quoteToCopy.title} (Cópia)` : 'Orçamento T.I (Cópia)',
      date: getTodayDateString(),
      createdAt: Date.now(),
      items: quoteToCopy.items.map((it) => ({
        ...it,
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      })),
    };

    setQuotes((prev) => [duplicated, ...prev]);
    setActiveQuoteId(duplicated.id);
    triggerSaveToast('Orçamento duplicado com sucesso no Firebase!');
    try {
      await saveQuoteToFirestore(duplicated);
    } catch (e) {
      console.warn('Firestore duplicate save error', e);
    }
  };

  // Delete quote
  const handleDeleteQuote = async (id: string) => {
    if (quotes.length <= 1) return;
    const filtered = quotes.filter((q) => q.id !== id);
    setQuotes(filtered);
    if (activeQuoteId === id) {
      setActiveQuoteId(filtered[0].id);
    }
    triggerSaveToast('Orçamento removido!');
    try {
      await deleteQuoteFromFirestore(id);
    } catch (e) {
      console.warn('Firestore delete error', e);
    }
  };

  // Toast notification
  const triggerSaveToast = (msg: string = 'Salvo no Firebase!') => {
    setToastMessage(msg);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  // PDF Generation
  const handleGeneratePDF = () => {
    generateQuotePDF(currentQuote);
    triggerSaveToast('PDF gerado com sucesso!');
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Totals for quick bottom bar
  const totalItemsToBuy = currentQuote.items.reduce((sum, item) => sum + (item.quantityToBuy || 0), 0);
  const totalInStock = currentQuote.items.reduce((sum, item) => sum + (item.hasInStock ? (item.stockQuantity || 0) : 0), 0);
  const totalAmount = currentQuote.items.reduce((sum, item) => sum + ((item.quantityToBuy || 0) * (item.unitPrice || 0)), 0);

  return (
    <div className="min-h-screen bg-[#0a0708] text-slate-100 flex flex-col selection:bg-red-600 selection:text-white pb-20 sm:pb-16">
      
      {/* Top Header */}
      <Header
        quote={currentQuote}
        onNewQuote={handleNewQuote}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onGeneratePDF={handleGeneratePDF}
        onPrint={handlePrint}
        onOpenPresets={() => setIsPresetsOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs between Editor and Live PDF Preview */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-red-950/70 pb-3">
          
          <div className="flex items-center gap-1.5 bg-[#140b0e] p-1 rounded-xl border border-red-900/40 w-full sm:w-auto">
            <button
              id="tab-editor"
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md shadow-red-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-red-950/30'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Preenchimento & Itens</span>
            </button>

            <button
              id="tab-preview"
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md shadow-red-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-red-950/30'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visualizar Folha A4 / PDF</span>
            </button>
          </div>

          {/* Quick info chip */}
          <div className="flex items-center gap-3 text-xs text-slate-400 w-full sm:w-auto justify-between sm:justify-end">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Store className="w-3.5 h-3.5" />
              <span>{totalInStock} un em estoque</span>
            </span>
            <span className="hidden sm:inline text-red-950">•</span>
            <span className="font-mono text-white font-bold bg-[#180e12] px-2.5 py-1 rounded-lg border border-red-950">
              Total: {formatCurrency(totalAmount)}
            </span>
          </div>

        </div>

        {/* Tab 1: Form & Items Manager */}
        {activeTab === 'editor' && (
          <div className="space-y-6 animate-fade-in">
            {/* Meta details Form */}
            <QuoteForm
              quote={currentQuote}
              onChange={handleUpdateCurrentQuote}
            />

            {/* Items with Links & Stock Manager */}
            <ItemsManager
              items={currentQuote.items}
              onChangeItems={(items) => handleUpdateCurrentQuote({ items })}
            />
          </div>
        )}

        {/* Tab 2: Document A4 Preview */}
        {activeTab === 'preview' && (
          <div className="animate-fade-in">
            <DocumentPreview
              quote={currentQuote}
              onDownloadPDF={handleGeneratePDF}
              onPrint={handlePrint}
            />
          </div>
        )}

      </main>

      {/* Floating Bottom Quick Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-[#12080a]/95 backdrop-blur-md border-t border-red-900/50 py-2.5 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 sm:gap-6 text-xs">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Investimento Solicitado</p>
              <p className="text-base sm:text-lg font-black font-mono text-white tracking-tight">
                {formatCurrency(totalAmount)}
              </p>
            </div>

            <div className="hidden sm:block h-7 w-[1px] bg-red-950/80" />

            <div className="hidden sm:flex items-center gap-3 text-slate-300">
              <span className="text-red-400 font-semibold">{totalItemsToBuy} itens a comprar</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{totalInStock} disponíveis na loja</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'editor' ? (
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg bg-[#241115] hover:bg-[#32171c] text-slate-200 hover:text-white border border-red-900/40 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-red-400" />
                <span>Ver Folha</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg bg-[#241115] hover:bg-[#32171c] text-slate-200 hover:text-white border border-red-900/40 transition cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-red-400" />
                <span>Voltar ao Formulário</span>
              </button>
            )}

            <button
              id="btn-quick-generate-pdf"
              type="button"
              onClick={handleGeneratePDF}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-700/40 transition transform active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Gerar PDF</span>
            </button>
          </div>

        </div>
      </footer>

      {/* Presets Modal */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={(newQuote) => {
          setQuotes((prev) => [newQuote, ...prev]);
          setActiveQuoteId(newQuote.id);
          triggerSaveToast('Modelo técnico carregado com sucesso!');
        }}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedQuotes={quotes}
        activeQuoteId={activeQuoteId}
        onSelectQuote={(q) => setActiveQuoteId(q.id)}
        onDeleteQuote={handleDeleteQuote}
        onDuplicateQuote={handleDuplicateQuote}
        onNewQuote={handleNewQuote}
      />

      {/* Floating Save Toast */}
      {showSaveToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-[#20090d] border border-red-600/80 text-white px-4 py-2.5 rounded-xl shadow-2xl shadow-red-950/60 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
