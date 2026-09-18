import React from 'react';
import { FolderClock, X, Trash2, ArrowUpRight, Plus, Copy, FileText } from 'lucide-react';
import { BudgetQuote } from '../types';
import { formatCurrency, formatDateBR } from '../utils/formatters';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedQuotes: BudgetQuote[];
  activeQuoteId: string;
  onSelectQuote: (quote: BudgetQuote) => void;
  onDeleteQuote: (id: string) => void;
  onDuplicateQuote: (quote: BudgetQuote) => void;
  onNewQuote: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedQuotes,
  activeQuoteId,
  onSelectQuote,
  onDeleteQuote,
  onDuplicateQuote,
  onNewQuote,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#140b0e] border border-red-900/60 w-full max-w-2xl rounded-2xl p-6 shadow-2xl shadow-red-950/40 relative">
        
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-950/50 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between pb-4 mb-4 border-b border-red-950/60 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/40 flex items-center justify-center text-red-500">
              <FolderClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Meus Orçamentos de T.I</h3>
              <p className="text-xs text-slate-400">
                Histórico guardado localmente de cotações geradas para sua chefia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onNewQuote();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo</span>
          </button>
        </div>

        {/* Quotes List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {savedQuotes.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Nenhum orçamento salvo no momento.
            </div>
          ) : (
            savedQuotes.map((q) => {
              const total = q.items.reduce((sum, item) => sum + (item.quantityToBuy * item.unitPrice), 0);
              const isActive = q.id === activeQuoteId;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-[#220f13] border-red-600/80 shadow-md shadow-red-950/40'
                      : 'bg-[#180e11] hover:bg-[#1e1115] border-red-950/80'
                  }`}
                >
                  <div className="flex-1 cursor-pointer" onClick={() => { onSelectQuote(q); onClose(); }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-900/40">
                        {q.quoteNumber}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDateBR(q.date)}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                          Em edição
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1.5 hover:text-red-300 transition">
                      {q.title || 'Orçamento sem título'}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span>Chefe: <strong className="text-slate-200">{q.approverBoss || 'Não definido'}</strong></span>
                      <span>•</span>
                      <span>Itens: <strong className="text-slate-200">{q.items.length}</strong></span>
                      <span>•</span>
                      <span className="text-red-400 font-mono font-bold">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => { onSelectQuote(q); onClose(); }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#2b1216] hover:bg-red-600 text-red-300 hover:text-white transition cursor-pointer flex items-center gap-1"
                      title="Abrir este orçamento"
                    >
                      <span>Abrir</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicateQuote(q)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-red-950/50 rounded-lg transition cursor-pointer"
                      title="Duplicar como novo orçamento"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {savedQuotes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteQuote(q.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/50 rounded-lg transition cursor-pointer"
                        title="Excluir orçamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
