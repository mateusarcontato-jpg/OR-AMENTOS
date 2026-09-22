import React, { useState } from 'react';
import { 
  FolderClock, 
  Search, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Copy, 
  Eye, 
  Download, 
  Edit3, 
  Store, 
  Package, 
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BudgetQuote } from '../types';
import { formatCurrency, formatDateBR } from '../utils/formatters';

interface SavedQuotesViewProps {
  quotes: BudgetQuote[];
  activeQuoteId: string;
  onSelectQuote: (quote: BudgetQuote) => void;
  onOpenEditorForQuote: (quote: BudgetQuote) => void;
  onOpenPreviewForQuote: (quote: BudgetQuote) => void;
  onDeleteQuote: (id: string) => void;
  onDuplicateQuote: (quote: BudgetQuote) => void;
  onNewQuote: () => void;
  onOpenPresets: () => void;
  onGeneratePDF: (quote: BudgetQuote) => void;
}

export const SavedQuotesView: React.FC<SavedQuotesViewProps> = ({
  quotes,
  activeQuoteId,
  onSelectQuote,
  onOpenEditorForQuote,
  onOpenPreviewForQuote,
  onDeleteQuote,
  onDuplicateQuote,
  onNewQuote,
  onOpenPresets,
  onGeneratePDF,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter quotes based on search query
  const filteredQuotes = quotes.filter((q) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      (q.title && q.title.toLowerCase().includes(term)) ||
      (q.quoteNumber && q.quoteNumber.toLowerCase().includes(term)) ||
      (q.requesterName && q.requesterName.toLowerCase().includes(term)) ||
      (q.approverBoss && q.approverBoss.toLowerCase().includes(term)) ||
      (q.department && q.department.toLowerCase().includes(term)) ||
      (q.ticketNumber && q.ticketNumber.toLowerCase().includes(term)) ||
      (q.companyName && q.companyName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Top Controls & Search Bar */}
      <div className="bg-[#111217] border border-zinc-800/80 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <FolderClock className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Orçamentos Salvos na Nuvem
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {quotes.length} {quotes.length === 1 ? 'orçamento' : 'orçamentos'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Todos os orçamentos são sincronizados e armazenados no banco de dados Firebase
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPresets}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>Modelos Prontos</span>
            </button>

            <button
              type="button"
              onClick={onNewQuote}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-sm transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Orçamento</span>
            </button>
          </div>

        </div>

        {/* Search input */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar orçamento por título, solicitante, número, chamado (GLPI) ou setor..."
            className="w-full bg-[#161822] border border-zinc-800 focus:border-red-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-zinc-200 bg-zinc-800 px-1.5 py-0.5 rounded"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Quotes List / Cards */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-[#111217] border border-dashed border-zinc-800 rounded-xl p-10 text-center">
          <FolderClock className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
          <h3 className="text-xs font-semibold text-zinc-300 mb-1">
            {searchTerm ? 'Nenhum orçamento encontrado para esta busca' : 'Nenhum orçamento salvo'}
          </h3>
          <p className="text-[11px] text-zinc-500 mb-4 max-w-sm mx-auto">
            {searchTerm 
              ? 'Tente buscar com outros termos ou limpe o campo de pesquisa.'
              : 'Crie seu primeiro orçamento de equipamentos de T.I para salvá-lo aqui.'}
          </p>
          <button
            type="button"
            onClick={onNewQuote}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Criar Orçamento</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuotes.map((q) => {
            const isActive = q.id === activeQuoteId;
            const totalToBuy = q.items.reduce((sum, it) => sum + (it.quantityToBuy || 0), 0);
            const totalInStock = q.items.reduce((sum, it) => sum + (it.hasInStock ? (it.stockQuantity || 0) : 0), 0);
            const totalAmount = q.items.reduce(
              (sum, it) => sum + (it.quantityToBuy || 0) * (it.unitPrice || 0),
              0
            );

            // Urgency color helper
            const urgencyBadge = {
              baixa: 'bg-blue-950/60 text-blue-400 border-blue-800/40',
              media: 'bg-zinc-800 text-zinc-300 border-zinc-700',
              alta: 'bg-amber-950/60 text-amber-400 border-amber-800/40',
              critica: 'bg-red-950/80 text-red-400 border-red-800/40',
            }[q.urgency || 'media'];

            return (
              <div
                key={q.id}
                className={`bg-[#111217] border rounded-xl p-4 transition ${
                  isActive 
                    ? 'border-red-500/70 ring-1 ring-red-500/20 shadow-md shadow-red-950/20' 
                    : 'border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  
                  {/* Left info column */}
                  <div className="flex-1 min-w-0">
                    
                    {/* Header line: Quote ID, Urgency, Active badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-mono text-[11px] font-bold text-zinc-200 bg-zinc-800/90 px-2 py-0.5 rounded border border-zinc-700/60">
                        {q.quoteNumber}
                      </span>

                      {isActive && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          Em Edição Agora
                        </span>
                      )}

                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${urgencyBadge}`}>
                        Urgência {q.urgency || 'Média'}
                      </span>

                      {q.ticketNumber && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {q.ticketNumber}
                        </span>
                      )}

                      <span className="text-[11px] text-zinc-500 flex items-center gap-1 ml-auto sm:ml-0">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        {formatDateBR(q.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-white leading-snug mb-1">
                      {q.title || <span className="text-zinc-500 italic">Sem título definido</span>}
                    </h3>

                    {/* Meta info: requester, department, boss */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                      <span>
                        Solicitante: <strong className="text-zinc-200 font-medium">{q.requesterName || 'T.I'}</strong>
                      </span>
                      {q.approverBoss && (
                        <>
                          <span className="text-zinc-600">•</span>
                          <span>
                            Chefe: <strong className="text-zinc-200 font-medium">{q.approverBoss}</strong>
                          </span>
                        </>
                      )}
                      {q.department && (
                        <>
                          <span className="text-zinc-600">•</span>
                          <span>Setor: <strong className="text-zinc-300 font-medium">{q.department}</strong></span>
                        </>
                      )}
                    </div>

                    {/* Stock and items preview */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px]">
                      <span className="flex items-center gap-1 text-zinc-400">
                        <Package className="w-3 h-3 text-zinc-500" />
                        <span>{q.items.length} itens listados</span>
                        <span className="text-red-400 font-medium">({totalToBuy} a comprar)</span>
                      </span>

                      {totalInStock > 0 && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Store className="w-3 h-3 text-emerald-400" />
                          <span>{totalInStock} disponíveis na loja/estoque</span>
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Right column: Total Value & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-zinc-800 shrink-0">
                    
                    {/* Financial total */}
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                        Total Solicitado
                      </span>
                      <span className="text-lg font-bold font-mono text-white tracking-tight">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenEditorForQuote(q)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition cursor-pointer"
                        title="Abrir este orçamento para editar"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-zinc-300" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenPreviewForQuote(q)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
                        title="Visualizar a folha A4 oficial"
                      >
                        <Eye className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="hidden sm:inline">Folha A4</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onGeneratePDF(q)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
                        title="Baixar PDF deste orçamento"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicateQuote(q)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                        title="Duplicar este orçamento"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {quotes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteQuote(q.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition cursor-pointer"
                          title="Excluir este orçamento do Firebase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
