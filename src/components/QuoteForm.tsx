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
    <div className="bg-[#111217] border border-zinc-800/80 rounded-xl p-5">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Identificação & Aprovação
            </h2>
            <p className="text-[11px] text-zinc-400">
              Dados da solicitação para o parecer do chefe
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
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

          {/* Number pill */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
            <Hash className="w-3 h-3 text-red-500" />
            <span>{quote.quoteNumber}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        
        {/* Title */}
        <div className="sm:col-span-2 lg:col-span-2">
          <label htmlFor="quote-title" className="block text-[11px] font-medium text-zinc-300 mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-zinc-400" />
            Título / Objetivo do Orçamento <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-title"
            type="text"
            value={quote.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Ex: Upgrade de SSDs para a Equipe Financeira"
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="quote-date" className="block text-[11px] font-medium text-zinc-300 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-zinc-400" />
            Data da Solicitação
          </label>
          <input
            id="quote-date"
            type="date"
            value={quote.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

        {/* Requester (T.I professional) */}
        <div>
          <label htmlFor="quote-requester" className="block text-[11px] font-medium text-zinc-300 mb-1 flex items-center gap-1">
            <User className="w-3 h-3 text-zinc-400" />
            Solicitante (Você / T.I) <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-requester"
            type="text"
            value={quote.requesterName}
            onChange={(e) => onChange({ requesterName: e.target.value })}
            placeholder="Ex: Mateus - T.I"
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

        {/* Approver / Boss */}
        <div>
          <label htmlFor="quote-boss" className="block text-[11px] font-medium text-zinc-300 mb-1 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-zinc-400" />
            Gestor / Chefe (Aprovador) <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-boss"
            type="text"
            value={quote.approverBoss}
            onChange={(e) => onChange({ approverBoss: e.target.value })}
            placeholder="Ex: Carlos Silva (Gerente)"
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

        {/* Department */}
        <div>
          <label htmlFor="quote-dept" className="block text-[11px] font-medium text-zinc-300 mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-zinc-400" />
            Departamento / Setor Atendido
          </label>
          <input
            id="quote-dept"
            type="text"
            value={quote.department}
            onChange={(e) => onChange({ department: e.target.value })}
            placeholder="Ex: Tecnologia da Informação / Suporte"
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

        {/* Ticket / Chamado */}
        <div>
          <label htmlFor="quote-ticket" className="block text-[11px] font-medium text-zinc-300 mb-1 flex items-center gap-1">
            <Hash className="w-3 h-3 text-zinc-400" />
            N° Chamado / Ticket (Opcional)
          </label>
          <input
            id="quote-ticket"
            type="text"
            value={quote.ticketNumber || ''}
            onChange={(e) => onChange({ ticketNumber: e.target.value })}
            placeholder="Ex: GLPI #4829"
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

        {/* Urgency */}
        <div>
          <label htmlFor="quote-urgency" className="block text-[11px] font-medium text-zinc-300 mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-zinc-400" />
            Nível de Urgência
          </label>
          <select
            id="quote-urgency"
            value={quote.urgency}
            onChange={(e) => onChange({ urgency: e.target.value as UrgencyLevel })}
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 rounded-lg px-3 py-2 text-xs text-white outline-none transition cursor-pointer"
          >
            <option value="baixa">Baixa (Planejamento)</option>
            <option value="media">Média (Aprovação regular)</option>
            <option value="alta">Alta (Impacto operacional)</option>
            <option value="critica">Crítica (Parada de setor)</option>
          </select>
        </div>

        {/* Company / Unidade */}
        <div>
          <label htmlFor="quote-company" className="block text-[11px] font-medium text-zinc-300 mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-zinc-400" />
            Empresa / Filial
          </label>
          <input
            id="quote-company"
            type="text"
            value={quote.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="Ex: Matriz Central"
            className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition"
          />
        </div>

      </div>

      {/* Justification section */}
      <div className="mt-4 pt-3.5 border-t border-zinc-800/60">
        <label htmlFor="quote-justification" className="block text-[11px] font-medium text-zinc-300 mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-red-500" />
            Justificativa Técnica (Por que precisamos comprar?)
          </span>
          <span className="text-[10px] text-zinc-500">
            Destaque no PDF oficial
          </span>
        </label>
        <textarea
          id="quote-justification"
          rows={2}
          value={quote.justification}
          onChange={(e) => onChange({ justification: e.target.value })}
          placeholder="Explique resumidamente o motivo técnico (ex: lentidão, queima de componente, novos postos de trabalho)..."
          className="w-full bg-[#161820] border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition resize-y"
        />
      </div>

    </div>
  );
};
