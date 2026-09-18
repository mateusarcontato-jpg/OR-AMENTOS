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
      
      {/* Top Banner Toolbar */}
      <div className="bg-[#140b0e] border border-red-950/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800/40 flex items-center justify-center text-red-500">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Visualização em Papel A4 / PDF</h3>
            <p className="text-xs text-slate-400">
              Este é o formato exato que seu chefe receberá para aprovação e compra
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#221316] hover:bg-[#2e171c] border border-red-900/40 text-slate-200 hover:text-white transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Imprimir Folha</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPDF}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-700/30 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Arquivo PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="bg-slate-900/80 p-2 sm:p-6 rounded-2xl overflow-x-auto border border-red-950/50 flex justify-center">
        
        {/* The White A4 Paper */}
        <div 
          id="printable-quote"
          className="w-full max-w-[820px] bg-white text-slate-900 rounded-lg shadow-2xl p-6 sm:p-8 font-sans transition-all text-xs print:shadow-none print:m-0 print:p-6 print:w-full print:max-w-none"
        >
          {/* Paper Header Banner */}
          <div className="bg-gradient-to-r from-red-700 via-red-800 to-zinc-950 text-white p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40 text-red-200">
                  DOCUMENTO OFICIAL DE T.I
                </span>
                {quote.ticketNumber && (
                  <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded text-zinc-300">
                    {quote.ticketNumber}
                  </span>
                )}
              </div>
              <h1 className="text-base sm:text-lg font-black uppercase tracking-tight mt-1">
                REQUISIÇÃO & COTAÇÃO DE COMPRA DE T.I
              </h1>
              <p className="text-[11px] text-red-100/90 font-medium">
                {quote.companyName || 'Departamento de Tecnologia da Informação'}
              </p>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-red-500/30">
              <p className="text-xs font-mono font-bold text-white bg-black/30 px-2.5 py-1 rounded inline-block">
                {quote.quoteNumber}
              </p>
              <p className="text-[11px] text-zinc-300 mt-1">
                Data: <strong className="text-white">{formatDateBR(quote.date)}</strong>
              </p>
            </div>
          </div>

          {/* Meta Info Grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Solicitante (T.I)</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{quote.requesterName || 'Equipe T.I'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Gestor / Chefe</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{quote.approverBoss || 'A Definir'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Departamento</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{quote.department || 'T.I'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Urgência</p>
              <span className={`inline-block text-[10px] uppercase font-extrabold px-2 py-0.5 rounded mt-0.5 ${
                quote.urgency === 'critica'
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : quote.urgency === 'alta'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {quote.urgency.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Title & Justification */}
          <div className="mt-3 p-3 bg-red-50/70 border-l-4 border-red-600 rounded-r-lg border-y border-r border-red-100">
            <h2 className="text-xs font-black text-red-950 uppercase tracking-wide">
              {quote.title || 'Orçamento de T.I'}
            </h2>
            {quote.justification && (
              <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                <strong>Justificativa Técnica:</strong> {quote.justification}
              </p>
            )}
            {quote.observations && (
              <p className="text-[10px] text-slate-600 mt-1 italic">
                <strong>Observações:</strong> {quote.observations}
              </p>
            )}
          </div>

          {/* Table of Items */}
          <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-white text-[10px] uppercase tracking-wider">
                  <th className="py-2 px-2.5 text-center w-8">#</th>
                  <th className="py-2 px-3">Item / Especificação</th>
                  <th className="py-2 px-2">Categoria</th>
                  <th className="py-2 px-2 text-center">Tem na Loja?</th>
                  <th className="py-2 px-2 text-center font-bold text-amber-300">Qtd Comprar</th>
                  <th className="py-2 px-2.5 text-right">Vl. Unitário</th>
                  <th className="py-2 px-2.5 text-right">Subtotal</th>
                  <th className="py-2 px-2 text-center">Link Compra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {quote.items.map((item, index) => {
                  const subtotal = (item.quantityToBuy || 0) * (item.unitPrice || 0);

                  return (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="py-2 px-2.5 text-center font-mono font-bold text-slate-500">
                        {index + 1}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-slate-900 block">{item.name || 'Item'}</span>
                        {item.notes && (
                          <span className="text-[9px] text-slate-500 italic block">{item.notes}</span>
                        )}
                        {item.supplier && (
                          <span className="text-[9px] text-red-700 font-medium block">
                            Fornecedor sugerido: {item.supplier}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-slate-600 text-[10px]">
                        {item.category}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {item.hasInStock ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Sim ({item.stockQuantity} un)
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Não (0)</span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-slate-900">
                        {item.quantityToBuy} un
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-700">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(subtotal)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {item.purchaseUrl ? (
                          <a
                            href={item.purchaseUrl.startsWith('http') ? item.purchaseUrl : `https://${item.purchaseUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[10px] transition border border-blue-200"
                            title={item.purchaseUrl}
                          >
                            <span>Acessar</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[10px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Totals and Stock Savings */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
            
            {/* Stock Savings note */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">Controle Físico & Almoxarifado</p>
                <div className="mt-1 space-y-1 text-[11px] text-slate-700">
                  <p>• Total de itens em estoque reaproveitados: <strong>{totalStockCount} unidades</strong></p>
                  <p>• Total de novos itens a comprar: <strong>{totalItemsCount} unidades</strong></p>
                </div>
              </div>
              {savings > 0 && (
                <p className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-200">
                  Economia estimada de {formatCurrency(savings)} utilizando peças da loja interna.
                </p>
              )}
            </div>

            {/* Total to Invest Box */}
            <div className="bg-zinc-900 text-white rounded-lg p-3.5 flex flex-col justify-between border-l-4 border-red-600">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                Valor Total do Orçamento Solicitado
              </span>
              <div className="my-1">
                <span className="text-2xl font-black font-mono tracking-tight text-white">
                  {formatCurrency(totalCost)}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">
                Calculado com base nas cotações e links das plataformas fornecidas.
              </span>
            </div>

          </div>

          {/* Signatures & Boss Approval Block */}
          <div className="mt-8 pt-4 border-t border-slate-200">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-4 text-center sm:text-left">
              Despacho & Parecer da Gestão
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
              
              {/* Requester Signature */}
              <div className="text-center">
                <div className="border-b border-slate-400 w-3/4 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-900">{quote.requesterName || 'Responsável T.I'}</p>
                <p className="text-[10px] text-slate-500">Solicitante / Técnico de T.I</p>
              </div>

              {/* Boss Approval */}
              <div className="text-center">
                <div className="flex justify-center gap-4 mb-2 text-xs font-bold text-slate-800">
                  <span className="inline-flex items-center gap-1">[ &nbsp; ] APROVADO</span>
                  <span className="inline-flex items-center gap-1">[ &nbsp; ] REPROVADO</span>
                </div>
                <div className="border-b border-slate-400 w-3/4 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-900">{quote.approverBoss || 'Gestor / Chefe Imediato'}</p>
                <p className="text-[10px] text-slate-500">Assinatura do Aprovador &nbsp; | &nbsp; Data: ____/____/2026</p>
              </div>

            </div>
          </div>

          {/* Subtle document footer */}
          <div className="mt-8 pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[9px] text-slate-400">
            <span>Sistema Gerador de Orçamentos T.I • Link direto para compras</span>
            <span>Documento emitido para controle e auditoria interna</span>
          </div>

        </div>

      </div>

    </div>
  );
};
