import React from 'react';
import { Sparkles, X, ArrowRight, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#140b0e] border border-red-900/60 w-full max-w-xl rounded-2xl p-6 shadow-2xl shadow-red-950/40 relative">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-950/50 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/40 flex items-center justify-center text-red-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Modelos Prontos de Cotação de T.I</h3>
            <p className="text-xs text-slate-400">
              Carregue uma lista pronta de itens com preços, links e estoque pré-configurados
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto pr-1">
          {QUOTE_PRESETS.map((preset, index) => (
            <div
              key={index}
              onClick={() => handleApplyPreset(preset)}
              className="group bg-[#1a0f12] hover:bg-[#241216] border border-red-950/80 hover:border-red-800/60 rounded-xl p-4 transition-all duration-200 cursor-pointer flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition">
                  {preset.label}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {preset.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-900/40">
                    {preset.items.length} itens incluídos
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Links e estoque configurados
                  </span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg bg-[#2b1216] group-hover:bg-red-600 text-red-400 group-hover:text-white flex items-center justify-center transition shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-red-950/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#1f1114] hover:bg-[#2a171b] rounded-lg transition cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
