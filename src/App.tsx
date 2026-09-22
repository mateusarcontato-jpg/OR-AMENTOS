import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Eye, 
  Download, 
  Layers, 
  Store, 
  CheckCircle2, 
  ExternalLink
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

export default function App() {
  const [quotes, setQuotes] = useState<BudgetQuote[]>([INITIAL_QUOTE]);
  const [activeQuoteId, setActiveQuoteId] = useState<string>(INITIAL_QUOTE.id);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Salvo no Firebase!');

  // Active quote object
  const currentQuote = quotes.find((q) => q.id === activeQuoteId) || quotes[0] || INITIAL_QUOTE;

  // Setup Firebase Auth and Realtime Subscription
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initFirebase() {
      try {
        await ensureAuth();

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
            console.warn('Fallback notice from Firestore listener:', err);
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
    triggerSaveToast('Novo orçamento criado!');
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
    triggerSaveToast('Orçamento duplicado!');
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
    setTimeout(() => setShowSaveToast(false), 2200);
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
    <div className="min-h-screen bg-[#0a0b0f] text-zinc-100 flex flex-col selection:bg-red-600 selection:text-white pb-20 sm:pb-16">
      
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
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-5 space-y-4">
        
        {/* Clean Segmented Tab Control */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
          
          <div className="flex items-center gap-1 bg-[#12141c] p-1 rounded-lg border border-zinc-800 w-full sm:w-auto">
            <button
              id="tab-editor"
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-zinc-800 text-white shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>Formulário & Itens</span>
            </button>

            <button
              id="tab-preview"
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-zinc-800 text-white shadow-xs font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span>Folha A4 / Visualização</span>
            </button>
          </div>

          {/* Quick info chip */}
          <div className="flex items-center gap-3 text-xs text-zinc-400 w-full sm:w-auto justify-between sm:justify-end">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Store className="w-3.5 h-3.5" />
              <span>{totalInStock} un em estoque</span>
            </span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="font-mono text-zinc-200 font-bold bg-[#141620] px-2.5 py-1 rounded border border-zinc-800">
              Total: {formatCurrency(totalAmount)}
            </span>
          </div>

        </div>

        {/* Tab 1: Form & Items Manager */}
        {activeTab === 'editor' && (
          <div className="space-y-4 animate-fade-in">
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
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-[#0c0d12]/95 backdrop-blur-md border-t border-zinc-800 py-2 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 sm:gap-6 text-xs">
            <div>
              <p className="text-[10px] text-zinc-400 uppercase font-semibold">Total Solicitado</p>
              <p className="text-base font-bold font-mono text-white tracking-tight">
                {formatCurrency(totalAmount)}
              </p>
            </div>

            <div className="hidden sm:block h-6 w-[1px] bg-zinc-800" />

            <div className="hidden sm:flex items-center gap-3 text-zinc-400">
              <span className="text-red-400 font-medium">{totalItemsToBuy} a comprar</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">{totalInStock} em estoque</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'editor' ? (
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                <span>Ver Folha</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span>Editar Dados</span>
              </button>
            )}

            <button
              id="btn-quick-generate-pdf"
              type="button"
              onClick={handleGeneratePDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-sm transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
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
          triggerSaveToast('Modelo carregado com sucesso!');
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

      {/* Floating Clean Save Toast */}
      {showSaveToast && (
        <div className="fixed top-16 right-5 z-50 flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-3.5 py-2 rounded-lg shadow-xl text-xs font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
