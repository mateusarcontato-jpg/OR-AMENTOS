import React from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { QUOTE_PRESETS } from '../data/initialData';
import { BudgetQuote } from '../types';
import { generateQuoteId, getTodayDateString } from '../utils/formatters';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (newQuote: BudgetQuote) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof QUOTE_PRESETS[0]) => {
    const newQuote: BudgetQuote = {
      id: `preset-${Date.now()}`,
      quoteNumber: generateQuoteId(),
      title: preset.title,
      requesterName: 'Equipe de Suporte T.I',
      department: 'Tecnologia da Informação',
      approverBoss: 'Gestor / Chefe de T.I',
      date: getTodayDateString(),
      urgency: 'alta',
      status: 'rascunho',
      companyName: 'Matriz / Depto. T.I',
      ticketNumber: 'GLPI #1042',
      justification: preset.justification,
      observations: 'Orçamento gerado a partir de modelo técnico pré-configurado.',
      createdAt: Date.now(),
      items: preset.items.map((it) => ({
        ...it,
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      })),
    };

    onSelectPreset(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111217] border border-zinc-800 w-full max-w-xl rounded-xl p-5 shadow-2xl relative">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Modelos Prontos de Orçamento</h3>
            <p className="text-[11px] text-zinc-400">
              Escolha um cenário comum de T.I para carregar itens e justificativas automaticamente
            </p>
          </div>
        </div>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {QUOTE_PRESETS.map((preset) => (
            <div
              key={preset.label}
              onClick={() => handleApplyPreset(preset)}
              className="bg-[#161822] hover:bg-[#1c1f2c] border border-zinc-800/80 hover:border-zinc-700 rounded-lg p-3.5 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition">
                  {preset.title}
                </h4>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-400 transition group-hover:translate-x-0.5" />
              </div>

              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-2">
                {preset.justification}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-500">
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                  {preset.items.length} itens inclusos
                </span>
                {preset.items.slice(0, 3).map((it) => (
                  <span key={it.id} className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
                    {it.name.split(' ')[0]} {it.name.split(' ')[1] || ''}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
