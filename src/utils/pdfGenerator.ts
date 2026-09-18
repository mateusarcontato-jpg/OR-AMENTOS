import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BudgetQuote } from '../types';
import { formatCurrency, formatDateBR } from './formatters';

export function generateQuotePDF(quote: BudgetQuote): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- Header Banner (Gradient Red to Dark) ---
  doc.setFillColor(180, 20, 20); // Deep Crimson Red
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setFillColor(20, 20, 24); // Dark Black-Charcoal Accent
  doc.rect(0, 23, pageWidth, 5, 'F');

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('REQUISIÇÃO & ORÇAMENTO DE T.I', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(quote.companyName || 'DEPARTAMENTO DE TECNOLOGIA DA INFORMAÇÃO', 14, 18);

  // Quote Number and Date on the right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(quote.quoteNumber, pageWidth - 14, 12, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Data: ${formatDateBR(quote.date)}`, pageWidth - 14, 18, { align: 'right' });

  let currentY = 35;

  // --- Meta Info Grid Box ---
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(220, 224, 230);
  doc.roundedRect(14, currentY, pageWidth - 28, 30, 2, 2, 'FD');

  // Row 1
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('TÍTULO DA SOLICITAÇÃO:', 18, currentY + 7);
  doc.text('SOLICITANTE (T.I):', 115, currentY + 7);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(25, 25, 25);
  doc.text(quote.title || 'Orçamento de T.I', 18, currentY + 12);
  doc.text(quote.requesterName || 'Equipe T.I', 115, currentY + 12);

  // Row 2
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('DEPARTAMENTO / SETOR:', 18, currentY + 19);
  doc.text('GESTOR / CHEFE (APROVADOR):', 115, currentY + 19);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(25, 25, 25);
  doc.text(quote.department || 'T.I / Suporte', 18, currentY + 24);
  doc.text(quote.approverBoss || 'Diretoria / Gestão', 115, currentY + 24);

  // Additional row if ticket or urgency
  currentY += 34;

  // Justification section
  if (quote.justification) {
    doc.setFillColor(254, 242, 242); // very subtle red tint
    doc.setDrawColor(254, 202, 202);
    const splitJustification = doc.splitTextToSize(quote.justification, pageWidth - 36);
    const boxHeight = Math.max(16, splitJustification.length * 4.5 + 10);

    doc.roundedRect(14, currentY, pageWidth - 28, boxHeight, 2, 2, 'FD');

    // Red left accent line
    doc.setFillColor(220, 38, 38);
    doc.rect(14, currentY, 2, boxHeight, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text('JUSTIFICATIVA TÉCNICA & OBJETIVO:', 19, currentY + 6);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(splitJustification, 19, currentY + 11);

    currentY += boxHeight + 4;
  }

  // --- Items Table ---
  const tableData = quote.items.map((item, index) => {
    const subtotal = item.quantityToBuy * item.unitPrice;
    const stockStatus = item.hasInStock
      ? `Sim (${item.stockQuantity} un em loja)`
      : 'Não (0 un)';
    
    // Shorten link for display but keep valid text
    let linkDisplay = 'Sem link';
    if (item.purchaseUrl && item.purchaseUrl.trim()) {
      try {
        const urlObj = new URL(item.purchaseUrl.startsWith('http') ? item.purchaseUrl : `https://${item.purchaseUrl}`);
        linkDisplay = urlObj.hostname.replace('www.', '');
      } catch {
        linkDisplay = 'Acessar Loja';
      }
    }

    return [
      (index + 1).toString(),
      item.name || 'Item sem nome',
      item.category || 'Geral',
      stockStatus,
      `${item.quantityToBuy} un`,
      formatCurrency(item.unitPrice),
      formatCurrency(subtotal),
      linkDisplay,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Item / Descrição', 'Categoria', 'Na Loja/Estoque?', 'Qtd Comprar', 'Vl. Unitário', 'Subtotal', 'Link de Compra']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [185, 28, 28], // Crimson red header
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 30, 30],
      lineColor: [220, 220, 225],
      lineWidth: 0.1,
      valign: 'middle',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 'auto', fontStyle: 'bold' },
      2: { cellWidth: 24, fontSize: 7.5 },
      3: { cellWidth: 26, fontSize: 7.5, halign: 'center' },
      4: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
      5: { cellWidth: 22, halign: 'right' },
      6: { cellWidth: 24, halign: 'right', fontStyle: 'bold' },
      7: { cellWidth: 25, halign: 'center', textColor: [37, 99, 235] },
    },
    didDrawCell: (data) => {
      // Add clickable hyperlink on the last column (Link de Compra)
      if (data.section === 'body' && data.column.index === 7) {
        const item = quote.items[data.row.index];
        if (item && item.purchaseUrl && item.purchaseUrl.trim()) {
          const fullUrl = item.purchaseUrl.startsWith('http') 
            ? item.purchaseUrl 
            : `https://${item.purchaseUrl}`;
          doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, {
            url: fullUrl,
          });
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // Position after table
  // @ts-expect-error lastAutoTable is injected by jspdf-autotable
  const finalY = (doc.lastAutoTable?.finalY || currentY + 40) + 6;

  // Check if we need a new page for totals & signature
  let totalsY = finalY;
  if (totalsY > pageHeight - 65) {
    doc.addPage();
    totalsY = 20;
  }

  // Calculate totals
  const totalItemsCount = quote.items.reduce((acc, i) => acc + i.quantityToBuy, 0);
  const totalStockCount = quote.items.reduce((acc, i) => acc + (i.hasInStock ? i.stockQuantity : 0), 0);
  const totalCost = quote.items.reduce((acc, i) => acc + (i.quantityToBuy * i.unitPrice), 0);

  // Totals Box (Right Aligned or Two Columns)
  // Left: Summary stats
  doc.setFillColor(245, 245, 248);
  doc.setDrawColor(215, 215, 225);
  doc.roundedRect(14, totalsY, 80, 26, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('RESUMO DE ITENS & ESTOQUE:', 18, totalsY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text(`Total de itens cadastrados: ${quote.items.length}`, 18, totalsY + 12);
  doc.text(`Itens disponíveis na loja/estoque: ${totalStockCount} un`, 18, totalsY + 17);
  doc.text(`Itens necessários para compra: ${totalItemsCount} un`, 18, totalsY + 22);

  // Right: Total Investment with Red Accent
  const rightBoxX = pageWidth - 94;
  doc.setFillColor(26, 26, 30); // Black/Charcoal background
  doc.setDrawColor(185, 28, 28);
  doc.roundedRect(rightBoxX, totalsY, 80, 26, 2, 2, 'FD');

  doc.setFillColor(220, 38, 38);
  doc.rect(rightBoxX, totalsY, 3, 26, 'F'); // Red left bar

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.text('VALOR TOTAL DA COMPRA:', rightBoxX + 8, totalsY + 8);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(totalCost), rightBoxX + 8, totalsY + 18);

  // --- Signature / Approver Block ---
  const signY = totalsY + 38;
  if (signY > pageHeight - 35) {
    doc.addPage();
  }

  const signLineY = Math.min(signY + 16, pageHeight - 20);

  // Requester Signature Line
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.line(20, signLineY, 85, signLineY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text(quote.requesterName || 'Responsável T.I', 52, signLineY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Solicitante / Técnico T.I', 52, signLineY + 9, { align: 'center' });

  // Approver Boss Signature Line
  const bossLineX1 = pageWidth - 85;
  const bossLineX2 = pageWidth - 20;
  const bossCenterX = (bossLineX1 + bossLineX2) / 2;

  doc.line(bossLineX1, signLineY, bossLineX2, signLineY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text(quote.approverBoss || 'Gestor / Chefe Imediato', bossCenterX, signLineY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Aprovação da Compra [  ] Sim  [  ] Não', bossCenterX, signLineY + 9, { align: 'center' });

  // Footer text
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text(
    `Gerado automaticamente pelo Sistema de Orçamentos T.I em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );

  // Trigger download
  const cleanTitle = (quote.quoteNumber || 'Orcamento-TI').replace(/[^a-zA-Z0-9-_]/g, '_');
  doc.save(`${cleanTitle}.pdf`);
}
