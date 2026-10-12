import React from 'react';
import { 
  User, 
  Briefcase, 
  Building2, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  Tag, 
  HelpCircle,
  Hash,
  Save
} from 'lucide-react';
import { BudgetQuote, UrgencyLevel } from '../types';

interface QuoteFormProps {
  quote: BudgetQuote;
  onChange: (updated: Partial<BudgetQuote>) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ quote, onChange, onSave, isSaving }) => {
  return (
    <div className="bg-[#111217] border border-zinc-800/80 rounded-xl p-4 sm:p-5">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-red-500" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Dados do Orçamento
          </h2>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            #{quote.quoteNumber}
          </span>
        </div>

        {onSave && (
          <button
            id="btn-form-save-quote"
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition cursor-pointer"
            title="Salvar este orçamento no Firebase"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Title */}
        <div className="sm:col-span-2 lg:col-span-2">
          <label htmlFor="quote-title" className="block text-[11px] font-medium text-zinc-400 mb-1">
            Título / Objetivo <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-title"
            type="text"
            value={quote.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Ex: Upgrade de SSDs para o Financeiro"
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

        {/* Requester */}
        <div>
          <label htmlFor="quote-requester" className="block text-[11px] font-medium text-zinc-400 mb-1">
            Solicitante (T.I) <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-requester"
            type="text"
            value={quote.requesterName}
            onChange={(e) => onChange({ requesterName: e.target.value })}
            placeholder="Ex: Mateus - T.I"
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

        {/* Approver / Boss */}
        <div>
          <label htmlFor="quote-boss" className="block text-[11px] font-medium text-zinc-400 mb-1">
            Gestor / Aprovador <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-boss"
            type="text"
            value={quote.approverBoss}
            onChange={(e) => onChange({ approverBoss: e.target.value })}
            placeholder="Ex: Carlos Silva"
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

        {/* Department */}
        <div>
          <label htmlFor="quote-dept" className="block text-[11px] font-medium text-zinc-400 mb-1">
            Departamento / Setor
          </label>
          <input
            id="quote-dept"
            type="text"
            value={quote.department}
            onChange={(e) => onChange({ department: e.target.value })}
            placeholder="Ex: T.I / Suporte"
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

        {/* Company / Unidade */}
        <div>
          <label htmlFor="quote-company" className="block text-[11px] font-medium text-zinc-400 mb-1">
            Empresa / Filial
          </label>
          <input
            id="quote-company"
            type="text"
            value={quote.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="Ex: Matriz Central"
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

        {/* Ticket / Chamado */}
        <div>
          <label htmlFor="quote-ticket" className="block text-[11px] font-medium text-zinc-400 mb-1">
            N° Chamado (Opcional)
          </label>
          <input
            id="quote-ticket"
            type="text"
            value={quote.ticketNumber || ''}
            onChange={(e) => onChange({ ticketNumber: e.target.value })}
            placeholder="Ex: GLPI #4829"
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

        {/* Urgency & Date */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="quote-urgency" className="block text-[11px] font-medium text-zinc-400 mb-1">
              Urgência
            </label>
            <select
              id="quote-urgency"
              value={quote.urgency}
              onChange={(e) => onChange({ urgency: e.target.value as UrgencyLevel })}
              className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 rounded-lg px-2 py-1.5 text-xs text-white outline-none transition cursor-pointer"
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>

          <div>
            <label htmlFor="quote-date" className="block text-[11px] font-medium text-zinc-400 mb-1">
              Data
            </label>
            <input
              id="quote-date"
              type="date"
              value={quote.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 rounded-lg px-2 py-1.5 text-xs text-white outline-none transition"
            />
          </div>
        </div>

      </div>

      {/* Justification section */}
      <div className="mt-3 pt-3 border-t border-zinc-800/60">
        <label htmlFor="quote-justification" className="block text-[11px] font-medium text-zinc-400 mb-1">
          Justificativa Técnica (Destaque no PDF)
        </label>
        <textarea
          id="quote-justification"
          rows={2}
          value={quote.justification}
          onChange={(e) => onChange({ justification: e.target.value })}
          placeholder="Explique resumidamente o motivo técnico da compra..."
          className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none transition resize-y"
        />
      </div>

    </div>
  );
};
