import React from 'react';
import { FolderClock, X, Trash2, Plus, Copy, FileText } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111217] border border-zinc-800 w-full max-w-2xl rounded-xl p-5 shadow-2xl relative">
        
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-800 pr-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <FolderClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Meus Orçamentos</h3>
              <p className="text-[11px] text-zinc-400">
                Sincronizados na nuvem Firebase e acessíveis de qualquer dispositivo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onNewQuote();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Criar Novo</span>
          </button>
        </div>

        {/* Quotes List */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {savedQuotes.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs">
              Nenhum orçamento encontrado.
            </div>
          ) : (
            savedQuotes.map((q) => {
              const isActive = q.id === activeQuoteId;
              const totalAmount = q.items.reduce(
                (sum, it) => sum + (it.quantityToBuy || 0) * (it.unitPrice || 0),
                0
              );
              const itemsCount = q.items.reduce((sum, it) => sum + (it.quantityToBuy || 0), 0);

              return (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-lg border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-[#181a24] border-red-500/60 shadow-sm'
                      : 'bg-[#151720] border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div 
                    onClick={() => {
                      onSelectQuote(q);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                        {q.quoteNumber}
                      </span>
                      <h4 className="text-xs font-bold text-white hover:text-red-400 transition">
                        {q.title || 'Orçamento sem título'}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] font-semibold text-red-400 bg-red-950/80 border border-red-800/40 px-1.5 py-0.2 rounded">
                          Ativo
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                      <span>Data: {formatDateBR(q.date)}</span>
                      <span>•</span>
                      <span>{q.requesterName || 'T.I'}</span>
                      <span>•</span>
                      <span className="text-white font-mono font-bold">
                        {formatCurrency(totalAmount)}
                      </span>
                      <span>({itemsCount} itens)</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
                    <button
                      type="button"
                      onClick={() => onDuplicateQuote(q)}
                      className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                      title="Duplicar este orçamento"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {savedQuotes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteQuote(q.id)}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition cursor-pointer"
                        title="Excluir este orçamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onSelectQuote(q);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition cursor-pointer"
                    >
                      Abrir
                    </button>
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
