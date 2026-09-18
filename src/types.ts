export type UrgencyLevel = 'baixa' | 'media' | 'alta' | 'critica';
export type QuoteStatus = 'rascunho' | 'aguardando_aprovacao' | 'aprovado' | 'rejeitado';

export interface BudgetItem {
  id: string;
  name: string;
  category: string;
  hasInStock: boolean;
  stockQuantity: number;
  quantityNeeded: number;
  quantityToBuy: number;
  unitPrice: number;
  purchaseUrl: string;
  supplier: string;
  notes?: string;
}

export interface BudgetQuote {
  id: string;
  quoteNumber: string;
  title: string;
  requesterName: string;
  department: string;
  approverBoss: string;
  date: string;
  urgency: UrgencyLevel;
  status: QuoteStatus;
  companyName: string;
  ticketNumber?: string;
  justification: string;
  observations?: string;
  items: BudgetItem[];
  createdAt: number;
}
