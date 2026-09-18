import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  PlusCircle, 
  FolderClock, 
  Sparkles,
  ShieldCheck,
  CloudCheck,
  Cloud
} from 'lucide-react';
import { BudgetQuote } from '../types';

interface HeaderProps {
  quote: BudgetQuote;
  isCloudSynced?: boolean;
  onNewQuote: () => void;
  onOpenHistory: () => void;
  onGeneratePDF: () => void;
  onPrint: () => void;
  onOpenPresets: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isCloudSynced = true,
  onNewQuote,
  onOpenHistory,
  onGeneratePDF,
  onPrint,
  onOpenPresets,
}) => {
  return (
    <header className="relative z-20 border-b border-red-950/60 bg-gradient-to-r from-black via-[#140608] to-[#200508] shadow-2xl shadow-red-950/20">
      {/* Top subtle highlight line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-950 p-[1px] shadow-lg shadow-red-600/30">
            <div className="w-full h-full bg-[#0d090a] rounded-[11px] flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[9px] font-bold text-white shadow">
              <ShieldCheck className="w-2.5 h-2.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>T.I</span>
                <span className="text-red-500">ORÇAMENTOS</span>
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-red-950/80 border border-red-800/40 text-red-400 font-semibold">
                v2.0 PRO
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 font-semibold" title="Conectado e sincronizado no banco de dados Firebase Firestore">
                <Cloud className="w-2.5 h-2.5 text-emerald-400" />
                Firebase Nuvem
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Cotações de T.I, verificação de estoque e gerador de PDF
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            id="btn-presets"
            type="button"
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#181113] hover:bg-[#251518] border border-red-900/40 text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="Carregar modelos prontos de orçamentos de T.I"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Modelos Prontos</span>
          </button>

          <button
            id="btn-history"
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#181113] hover:bg-[#251518] border border-red-900/40 text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="Abrir histórico de orçamentos salvos"
          >
            <FolderClock className="w-3.5 h-3.5 text-slate-400" />
            <span>Meus Orçamentos</span>
          </button>

          <button
            id="btn-new-quote"
            type="button"
            onClick={onNewQuote}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#201013] hover:bg-[#2e151a] border border-red-800/50 text-red-200 hover:text-white transition-colors cursor-pointer"
            title="Criar um novo orçamento em branco"
          >
            <PlusCircle className="w-3.5 h-3.5 text-red-400" />
            <span>Novo</span>
          </button>

          <button
            id="btn-print-doc"
            type="button"
            onClick={onPrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#1c1315] hover:bg-[#2a1a1e] border border-red-900/40 text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="Imprimir visualização formatada para impressora ou PDF nativo"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span>Imprimir</span>
          </button>

          <button
            id="btn-download-pdf"
            type="button"
            onClick={onGeneratePDF}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-700/30 transition-all transform active:scale-95 cursor-pointer"
            title="Gerar e baixar PDF profissional imediatamente"
          >
            <Download className="w-4 h-4" />
            <span>Gerar PDF Oficial</span>
          </button>
        </div>

      </div>
    </header>
  );
};
