import React from 'react';
import { 
  User, 
  Briefcase, 
  Building2, 
  Calendar, 
  FileCheck, 
  AlertTriangle, 
  Tag, 
  HelpCircle,
  Hash
} from 'lucide-react';
import { BudgetQuote, UrgencyLevel } from '../types';

interface QuoteFormProps {
  quote: BudgetQuote;
  onChange: (updated: Partial<BudgetQuote>) => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ quote, onChange }) => {
  return (
    <div className="bg-[#110c0e] border border-red-950/70 rounded-2xl p-5 shadow-xl shadow-black/40">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-red-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800/40 flex items-center justify-center text-red-500">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Dados da Requisição & Aprovação
            </h2>
            <p className="text-xs text-slate-400">
              Informações para o chefe identificar o solicitante e o motivo da compra
            </p>
          </div>
        </div>

        {/* Number pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1a0f12] border border-red-900/40 text-xs font-mono text-red-400 font-semibold">
          <Hash className="w-3 h-3" />
          <span>{quote.quoteNumber}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Title */}
        <div className="sm:col-span-2 lg:col-span-2">
          <label htmlFor="quote-title" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-red-500" />
            Título / Objetivo do Orçamento <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-title"
            type="text"
            value={quote.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Ex: Upgrade de SSDs e Memórias para a Equipe Financeira"
            className="w-full bg-[#181113] border border-red-950/90 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="quote-date" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            Data da Solicitação
          </label>
          <input
            id="quote-date"
            type="date"
            value={quote.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="w-full bg-[#181113] border border-red-950/90 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>

        {/* Requester (T.I professional) */}
        <div>
          <label htmlFor="quote-requester" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-red-500" />
            Solicitante (Você / T.I) <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-requester"
            type="text"
            value={quote.requesterName}
            onChange={(e) => onChange({ requesterName: e.target.value })}
            placeholder="Ex: Mateus - Analista de Suporte T.I"
            className="w-full bg-[#181113] border border-red-950/90 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>

        {/* Approver / Boss */}
        <div>
          <label htmlFor="quote-boss" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-red-500" />
            Gestor / Chefe (Aprovador) <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-boss"
            type="text"
            value={quote.approverBoss}
            onChange={(e) => onChange({ approverBoss: e.target.value })}
            placeholder="Ex: Carlos Silva (Gerente de T.I)"
            className="w-full bg-[#181113] border border-red-950/90 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>

        {/* Department */}
        <div>
          <label htmlFor="quote-dept" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-red-500" />
            Departamento / Setor Atendido
          </label>
          <input
            id="quote-dept"
            type="text"
            value={quote.department}
            onChange={(e) => onChange({ department: e.target.value })}
            placeholder="Ex: Tecnologia da Informação / Suporte"
            className="w-full bg-[#181113] border border-red-950/90 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>

        {/* Ticket / Chamado */}
        <div>
          <label htmlFor="quote-ticket" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-red-500" />
            N° Chamado / Ticket (Opcional)
          </label>
          <input
            id="quote-ticket"
            type="text"
            value={quote.ticketNumber || ''}
            onChange={(e) => onChange({ ticketNumber: e.target.value })}
            placeholder="Ex: GLPI #4829 ou Jira INFRA-302"
            className="w-full bg-[#181113] border border-red-950/90 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>

        {/* Urgency */}
        <div>
          <label htmlFor="quote-urgency" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            Nível de Urgência
          </label>
          <select
            id="quote-urgency"
            value={quote.urgency}
            onChange={(e) => onChange({ urgency: e.target.value as UrgencyLevel })}
            className="w-full bg-[#181113] border border-red-950/90 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition cursor-pointer"
          >
            <option value="baixa">Baixa (Planejamento regular)</option>
            <option value="media">Média (Aprovação nos próximos dias)</option>
            <option value="alta">Alta (Impacta operação)</option>
            <option value="critica">Crítica (Parada de setor/servidor)</option>
          </select>
        </div>

        {/* Company / Unidade */}
        <div>
          <label htmlFor="quote-company" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-red-500" />
            Empresa / Filial
          </label>
          <input
            id="quote-company"
            type="text"
            value={quote.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="Ex: Matriz Central / Unidade SP"
            className="w-full bg-[#181113] border border-red-950/90 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
          />
        </div>

      </div>

      {/* Justification section */}
      <div className="mt-4 pt-4 border-t border-red-950/60">
        <label htmlFor="quote-justification" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-red-500" />
            Justificativa Técnica para o Chefe (Por que precisamos comprar?)
          </span>
          <span className="text-[11px] text-slate-500">
            Aparece com destaque no PDF oficial
          </span>
        </label>
        <textarea
          id="quote-justification"
          rows={2}
          value={quote.justification}
          onChange={(e) => onChange({ justification: e.target.value })}
          placeholder="Explique o impacto: ex. lentidão operacional, equipamento queimado, expansão de baias ou economia a longo prazo..."
          className="w-full bg-[#181113] border border-red-950/90 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition resize-y"
        />
      </div>

    </div>
  );
};
