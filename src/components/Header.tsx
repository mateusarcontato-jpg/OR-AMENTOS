import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  PlusCircle, 
  FolderClock, 
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import { BudgetQuote } from '../types';

interface HeaderProps {
  quote: BudgetQuote;
  savedQuotesCount?: number;
  isSaving?: boolean;
  onSaveQuote: () => void;
  onNewQuote: () => void;
  onOpenHistory: () => void;
  onGeneratePDF: () => void;
  onPrint: () => void;
  onOpenPresets: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedQuotesCount = 0,
  isSaving = false,
  onSaveQuote,
  onNewQuote,
  onOpenHistory,
  onGeneratePDF,
  onPrint,
  onOpenPresets,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0c0d12]/95 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
                  <span>T.I</span>
                  <span className="text-red-500 font-extrabold">ORÇAMENTOS</span>
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Firebase
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          
          {/* Botão de Salvar Orçamento no Firebase */}
          <button
            id="btn-header-save-quote"
            type="button"
            onClick={onSaveQuote}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-xs transition cursor-pointer disabled:opacity-60"
            title="Salvar orçamento atual agora no Firebase"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Orçamento</span>
              </>
            )}
          </button>

          <button
            id="btn-presets"
            type="button"
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
            title="Carregar modelos prontos de orçamentos de T.I"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Modelos</span>
          </button>

          <button
            id="btn-new-quote"
            type="button"
            onClick={onNewQuote}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
            title="Criar um novo orçamento em branco"
          >
            <PlusCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>Novo</span>
          </button>

          <button
            id="btn-print-doc"
            type="button"
            onClick={onPrint}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition cursor-pointer"
            title="Imprimir folha A4"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span>Imprimir</span>
          </button>

          <button
            id="btn-download-pdf"
            type="button"
            onClick={onGeneratePDF}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-xs transition cursor-pointer"
            title="Gerar e baixar PDF profissional imediatamente"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Gerar PDF</span>
          </button>
        </div>

      </div>
    </header>
  );
};
