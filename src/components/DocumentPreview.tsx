import React from 'react';
import { 
  Printer, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  FileText,
  Building,
  UserCheck
} from 'lucide-react';
import { BudgetQuote } from '../types';
import { formatCurrency, formatDateBR } from '../utils/formatters';

interface DocumentPreviewProps {
  quote: BudgetQuote;
  onDownloadPDF: () => void;
  onPrint: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  quote,
  onDownloadPDF,
  onPrint,
}) => {
  const totalItemsCount = quote.items.reduce((acc, i) => acc + (i.quantityToBuy || 0), 0);
  const totalStockCount = quote.items.reduce((acc, i) => acc + (i.hasInStock ? (i.stockQuantity || 0) : 0), 0);
  const totalCost = quote.items.reduce((acc, i) => acc + ((i.quantityToBuy || 0) * (i.unitPrice || 0)), 0);
  const savings = quote.items.reduce((acc, i) => acc + ((i.hasInStock ? i.stockQuantity : 0) * (i.unitPrice || 0)), 0);

  return (
    <div className="space-y-4">
      
      {/* Clean Top Toolbar */}
      <div className="bg-[#111217] border border-zinc-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Visualização da Folha A4</h3>
            <p className="text-[11px] text-zinc-400">
              Formato formatado para envio e despacho com o chefe
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span>Imprimir</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-sm transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="bg-[#13151d] p-3 sm:p-6 rounded-xl border border-zinc-800 flex justify-center">
        
        {/* The Clean White A4 Paper */}
        <div 
          id="printable-quote"
          className="w-full max-w-[820px] bg-white text-zinc-900 rounded-lg shadow-xl p-6 sm:p-8 font-sans transition-all text-xs print:shadow-none print:m-0 print:p-6 print:w-full print:max-w-none"
        >
          {/* Paper Header Banner */}
          <div className="bg-zinc-950 text-white p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-l-4 border-red-600">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider uppercase bg-zinc-800 px-2 py-0.5 rounded text-zinc-300 font-semibold">
                  DOCUMENTO OFICIAL DE T.I
                </span>
                {quote.ticketNumber && (
                  <span className="text-[10px] font-mono bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">
                    {quote.ticketNumber}
                  </span>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-bold uppercase tracking-tight mt-1">
                REQUISIÇÃO & COTAÇÃO DE COMPRA DE T.I
              </h1>
              <p className="text-[11px] text-zinc-400 font-medium">
                {quote.companyName || 'Departamento de Tecnologia da Informação'}
              </p>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
              <p className="text-xs font-mono font-bold text-zinc-200 bg-zinc-900 px-2.5 py-1 rounded inline-block">
                N°: {quote.quoteNumber}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                Data: {formatDateBR(quote.date)}
              </p>
            </div>
          </div>

          {/* Title & Technical Reason */}
          <div className="mt-4 p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              Objetivo da Solicitação:
            </span>
            <h2 className="text-sm font-bold text-zinc-950 mt-0.5">
              {quote.title || 'Orçamento de Equipamentos e Insumos de T.I'}
            </h2>

            {quote.justification && (
              <div className="mt-2 pt-2 border-t border-zinc-200 text-[11px] text-zinc-700 leading-relaxed">
                <span className="font-semibold text-zinc-900">Justificativa Técnica: </span>
                {quote.justification}
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div className="border border-zinc-200 rounded p-2 bg-white">
              <span className="text-[10px] text-zinc-500 block">Solicitante (T.I)</span>
              <span className="font-semibold text-zinc-800 text-[11px]">
                {quote.requesterName || 'Equipe de Suporte'}
              </span>
            </div>

            <div className="border border-zinc-200 rounded p-2 bg-white">
              <span className="text-[10px] text-zinc-500 block">Gestor / Aprovador</span>
              <span className="font-semibold text-zinc-800 text-[11px]">
                {quote.approverBoss || 'Diretoria / Gerência'}
              </span>
            </div>

            <div className="border border-zinc-200 rounded p-2 bg-white">
              <span className="text-[10px] text-zinc-500 block">Departamento</span>
              <span className="font-semibold text-zinc-800 text-[11px]">
                {quote.department || 'T.I'}
              </span>
            </div>

            <div className="border border-zinc-200 rounded p-2 bg-white">
              <span className="text-[10px] text-zinc-500 block">Urgência</span>
              <span className="font-semibold text-zinc-800 text-[11px] uppercase">
                {quote.urgency}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-900">
                Detalhamento dos Itens, Cotações & Links
              </span>
              <span className="text-[10px] text-zinc-500">
                {quote.items.length} itens listados
              </span>
            </div>

            <div className="border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 text-zinc-700 text-[10px] uppercase font-bold border-b border-zinc-200">
                    <th className="py-2 px-2.5 w-8 text-center">#</th>
                    <th className="py-2 px-3">Equipamento / Especificação</th>
                    <th className="py-2 px-2.5 text-center">Tem em Loja?</th>
                    <th className="py-2 px-2 text-center">Necessário</th>
                    <th className="py-2 px-2 text-center">Comprar</th>
                    <th className="py-2 px-2.5 text-right">Preço Unit.</th>
                    <th className="py-2 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-[11px]">
                  {quote.items.map((item, idx) => {
                    const subtotal = (item.quantityToBuy || 0) * (item.unitPrice || 0);

                    return (
                      <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}>
                        <td className="py-2.5 px-2 text-center font-mono font-semibold text-zinc-500">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-zinc-900 leading-snug">
                            {item.name || 'Item sem nome'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[10px] text-zinc-500">
                            <span>{item.category}</span>
                            {item.supplier && <span>• Loja: <strong className="text-zinc-700">{item.supplier}</strong></span>}
                            {item.notes && <span>• <em>{item.notes}</em></span>}
                          </div>

                          {/* Clickable link */}
                          {item.purchaseUrl && (
                            <div className="mt-1">
                              <a
                                href={item.purchaseUrl.startsWith('http') ? item.purchaseUrl : `https://${item.purchaseUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-red-600 hover:text-red-700 font-mono underline"
                              >
                                <span>Acessar link do produto na plataforma</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          )}
                        </td>

                        {/* Em estoque */}
                        <td className="py-2.5 px-2.5 text-center">
                          {item.hasInStock ? (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                              Sim ({item.stockQuantity} un)
                            </span>
                          ) : (
                            <span className="text-zinc-400 text-[10px]">Não</span>
                          )}
                        </td>

                        {/* Needed */}
                        <td className="py-2.5 px-2 text-center font-mono text-zinc-600">
                          {item.quantityNeeded || 1}
                        </td>

                        {/* To Buy */}
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-red-600">
                          {item.quantityToBuy || 0}
                        </td>

                        {/* Unit Price */}
                        <td className="py-2.5 px-2.5 text-right font-mono text-zinc-700 whitespace-nowrap">
                          {formatCurrency(item.unitPrice || 0)}
                        </td>

                        {/* Subtotal */}
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-950 whitespace-nowrap">
                          {formatCurrency(subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
            
            {/* Inventory Balance */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500">
                  Verificação Prévia de Estoque
                </span>
                <p className="text-[11px] text-zinc-600 mt-1">
                  Foram localizadas <strong className="text-emerald-700 font-mono">{totalStockCount} peças</strong> no estoque interno da empresa, reduzindo a compra imediata.
                </p>
              </div>
              {savings > 0 && (
                <div className="mt-2 pt-2 border-t border-zinc-200 text-[11px] text-emerald-700 font-semibold">
                  Economia gerada: {formatCurrency(savings)}
                </div>
              )}
            </div>

            {/* Total to Invest Box */}
            <div className="bg-zinc-950 text-white rounded-lg p-3.5 flex flex-col justify-between border-l-4 border-red-600">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                Valor Total do Orçamento Solicitado
              </span>
              <div className="my-1">
                <span className="text-2xl font-bold font-mono tracking-tight text-white">
                  {formatCurrency(totalCost)}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">
                Calculado com base nas cotações e links informados.
              </span>
            </div>

          </div>

          {/* Signatures & Boss Approval Block */}
          <div className="mt-8 pt-4 border-t border-zinc-200">
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-4 text-center sm:text-left">
              Despacho & Parecer da Gestão
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
              
              {/* Requester Signature */}
              <div className="text-center">
                <div className="border-b border-zinc-400 w-3/4 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-zinc-900">{quote.requesterName || 'Responsável T.I'}</p>
                <p className="text-[10px] text-zinc-500">Solicitante / Técnico de T.I</p>
              </div>

              {/* Boss Approval */}
              <div className="text-center">
                <div className="flex justify-center gap-4 mb-2 text-xs font-bold text-zinc-800">
                  <span className="inline-flex items-center gap-1">[ &nbsp; ] APROVADO</span>
                  <span className="inline-flex items-center gap-1">[ &nbsp; ] REPROVADO</span>
                </div>
                <div className="border-b border-zinc-400 w-3/4 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-zinc-900">{quote.approverBoss || 'Gestor / Chefe Imediato'}</p>
                <p className="text-[10px] text-zinc-500">Assinatura do Aprovador &nbsp; | &nbsp; Data: ____/____/2026</p>
              </div>

            </div>
          </div>

          {/* Subtle document footer */}
          <div className="mt-8 pt-3 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center text-[9px] text-zinc-400">
            <span>Sistema Gerador de Orçamentos T.I • Link direto para compras</span>
            <span>Documento emitido para controle e auditoria interna</span>
          </div>

        </div>

      </div>

    </div>
  );
};
