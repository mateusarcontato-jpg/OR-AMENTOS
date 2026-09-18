import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Copy, 
  Layers, 
  Store, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { BudgetItem } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ItemsManagerProps {
  items: BudgetItem[];
  onChangeItems: (items: BudgetItem[]) => void;
}

const COMMON_CATEGORIES = [
  'Hardware & Peças',
  'Armazenamento / SSD',
  'Memória RAM',
  'Periféricos (Teclado/Mouse/Headset)',
  'Monitores & Vídeo',
  'Redes & Roteamento',
  'Cabos & Adaptadores',
  'Ferramentas & Insumos',
  'Softwares & Licenças',
  'Servidores & Racks',
  'Outros',
];

const POPULAR_STORES = [
  'KaBuM!',
  'Amazon',
  'Pichau',
  'Terabyte',
  'Mercado Livre',
  'Kalunga',
  'Dell Oficial',
  'Lenovo',
  'Fornecedor Local',
];

export const ItemsManager: React.FC<ItemsManagerProps> = ({ items, onChangeItems }) => {
  const [activeItemModal, setActiveItemModal] = useState<string | null>(null);

  // Add new blank item
  const handleAddItem = () => {
    const newItem: BudgetItem = {
      id: `item-${Date.now()}`,
      name: '',
      category: 'Hardware & Peças',
      hasInStock: false,
      stockQuantity: 0,
      quantityNeeded: 1,
      quantityToBuy: 1,
      unitPrice: 0,
      purchaseUrl: '',
      supplier: 'KaBuM!',
      notes: '',
    };
    onChangeItems([...items, newItem]);
  };

  // Duplicate existing item
  const handleDuplicateItem = (itemToCopy: BudgetItem) => {
    const newItem: BudgetItem = {
      ...itemToCopy,
      id: `item-${Date.now()}`,
      name: `${itemToCopy.name} (Cópia)`,
    };
    onChangeItems([...items, newItem]);
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    onChangeItems(items.filter((item) => item.id !== id));
  };

  // Update specific item property
  const handleUpdateItem = (id: string, updates: Partial<BudgetItem>) => {
    onChangeItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...updates };

        // If user changed stockQuantity or quantityNeeded, auto-adjust quantityToBuy if hasInStock is true
        if ('stockQuantity' in updates || 'quantityNeeded' in updates || 'hasInStock' in updates) {
          if (updated.hasInStock) {
            // If we need 5 and have 2 in stock, we need to buy 3 (or minimum 0)
            const needed = updated.quantityNeeded || 1;
            const inStock = updated.stockQuantity || 0;
            updated.quantityToBuy = Math.max(0, needed - inStock);
          } else {
            updated.stockQuantity = 0;
            updated.quantityToBuy = updated.quantityNeeded || 1;
          }
        }

        return updated;
      })
    );
  };

  // Metrics
  const totalToBuyCount = items.reduce((sum, item) => sum + (item.quantityToBuy || 0), 0);
  const totalInStockCount = items.reduce((sum, item) => sum + (item.hasInStock ? (item.stockQuantity || 0) : 0), 0);
  const totalInvestment = items.reduce((sum, item) => sum + ((item.quantityToBuy || 0) * (item.unitPrice || 0)), 0);
  const potentialSavings = items.reduce((sum, item) => sum + ((item.hasInStock ? item.stockQuantity : 0) * (item.unitPrice || 0)), 0);

  return (
    <div className="space-y-4">
      
      {/* KPI / Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="bg-[#140b0e] border border-red-950/80 rounded-xl p-3.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/5 rounded-full blur-xl" />
          <p className="text-[11px] font-medium text-slate-400">Total de Itens</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-extrabold text-white font-mono">{items.length}</span>
            <span className="text-xs text-slate-500">modelos</span>
          </div>
        </div>

        <div className="bg-[#140b0e] border border-red-950/80 rounded-xl p-3.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-600/10 rounded-full blur-xl" />
          <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Store className="w-3 h-3 text-emerald-400" />
            Tem na Loja / Estoque
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-extrabold text-emerald-400 font-mono">{totalInStockCount}</span>
            <span className="text-xs text-emerald-500/80 font-medium">unidades prontas</span>
          </div>
        </div>

        <div className="bg-[#140b0e] border border-red-950/80 rounded-xl p-3.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/10 rounded-full blur-xl" />
          <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Package className="w-3 h-3 text-red-400" />
            Qtd a Comprar
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-extrabold text-red-400 font-mono">{totalToBuyCount}</span>
            <span className="text-xs text-slate-500">unidades novas</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#24080d] to-[#14080a] border border-red-800/50 rounded-xl p-3.5 relative overflow-hidden shadow-lg shadow-red-950/30">
          <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-red-600/15 rounded-full blur-xl" />
          <p className="text-[11px] font-bold text-red-300">Total do Orçamento</p>
          <div className="mt-1">
            <span className="text-lg sm:text-xl font-extrabold text-white font-mono tracking-tight">
              {formatCurrency(totalInvestment)}
            </span>
          </div>
          {potentialSavings > 0 && (
            <p className="text-[10px] text-emerald-400 mt-0.5">
              Economia: {formatCurrency(potentialSavings)} em estoque
            </p>
          )}
        </div>

      </div>

      {/* Main Items Card */}
      <div className="bg-[#110c0e] border border-red-950/70 rounded-2xl p-5 shadow-xl shadow-black/40">
        
        {/* Header of Items */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-red-950/60">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              Itens do Orçamento & Links de Compra
            </h2>
            <p className="text-xs text-slate-400">
              Insira o link da loja e especifique se o item já existe no estoque interno
            </p>
          </div>

          <button
            id="btn-add-item"
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-md shadow-red-800/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Item</span>
          </button>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-red-950/90 rounded-xl bg-[#140b0d]">
            <Package className="w-12 h-12 text-red-500/40 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Nenhum item adicionado ao orçamento</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Clique no botão abaixo para adicionar peças de hardware, cabos, periféricos ou insumos de T.I.
            </p>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Adicionar Primeiro Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => {
              const subtotal = (item.quantityToBuy || 0) * (item.unitPrice || 0);

              return (
                <div
                  key={item.id}
                  className="bg-[#150d10] hover:bg-[#180e12] border border-red-950/80 hover:border-red-900/60 rounded-xl p-4 transition-all duration-200"
                >
                  {/* Top Bar of item: Index, Name, Category, and Actions */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-red-950/40">
                    
                    <div className="flex items-center gap-2.5 w-full lg:w-auto">
                      <span className="w-6 h-6 rounded-lg bg-[#241014] border border-red-900/50 flex items-center justify-center text-xs font-mono font-bold text-red-400 shrink-0">
                        {index + 1}
                      </span>

                      {/* Name input */}
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                        placeholder="Nome do Equipamento (Ex: SSD NVMe 1TB Kingston NV2)"
                        className="w-full lg:w-96 bg-[#1a0f12] border border-red-950/80 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg px-3 py-1.5 text-xs font-semibold text-white placeholder-slate-500 outline-none transition"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
                      {/* Category select */}
                      <select
                        value={item.category}
                        onChange={(e) => handleUpdateItem(item.id, { category: e.target.value })}
                        className="bg-[#1a0f12] border border-red-950/80 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-red-600 cursor-pointer"
                      >
                        {COMMON_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>

                      {/* Store / Supplier select */}
                      <input
                        type="text"
                        list={`stores-${item.id}`}
                        value={item.supplier}
                        onChange={(e) => handleUpdateItem(item.id, { supplier: e.target.value })}
                        placeholder="Loja / Fornecedor"
                        className="w-32 bg-[#1a0f12] border border-red-950/80 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-red-600"
                      />
                      <datalist id={`stores-${item.id}`}>
                        {POPULAR_STORES.map((st) => (
                          <option key={st} value={st} />
                        ))}
                      </datalist>

                      {/* Duplicate & Remove */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicateItem(item)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                          title="Duplicar este item"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/50 rounded-lg transition cursor-pointer"
                          title="Excluir item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Middle Row: Purchase Link with Direct Test Button */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    
                    {/* Link URL */}
                    <div className="md:col-span-8">
                      <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 text-red-500" />
                          Link para o Chefe Acessar a Plataforma de Compra:
                        </span>
                        {item.purchaseUrl && (
                          <a
                            href={item.purchaseUrl.startsWith('http') ? item.purchaseUrl : `https://${item.purchaseUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline text-[10px]"
                          >
                            <span>Testar Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="url"
                          value={item.purchaseUrl}
                          onChange={(e) => handleUpdateItem(item.id, { purchaseUrl: e.target.value })}
                          placeholder="Cole o link do produto aqui (Ex: https://www.kabum.com.br/produto/...)"
                          className="w-full bg-[#1a0f12] border border-red-950/80 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 outline-none transition font-mono pr-20"
                        />
                        {item.purchaseUrl && (
                          <span className="absolute right-2 px-1.5 py-0.5 rounded bg-red-950/80 text-[10px] text-red-400 border border-red-800/40">
                            URL ativa
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stock Verification Toggle: "Já tem na loja?" */}
                    <div className="md:col-span-4 bg-[#1a0f12] border border-red-950/70 rounded-lg p-2 flex flex-col justify-center">
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Store className="w-3 h-3 text-amber-400" />
                          Já tem na loja/estoque?
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${item.hasInStock ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-slate-900 text-slate-400'}`}>
                          {item.hasInStock ? 'SIM (Tem)' : 'NÃO (0)'}
                        </span>
                      </label>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateItem(item.id, { hasInStock: !item.hasInStock })}
                          className={`flex-1 py-1 px-2 text-[11px] font-bold rounded transition cursor-pointer flex items-center justify-center gap-1.5 ${
                            item.hasInStock
                              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/50'
                              : 'bg-[#221316] text-slate-400 hover:text-white border border-red-950'
                          }`}
                        >
                          {item.hasInStock ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Disponível</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-slate-500" />
                              <span>Não tem</span>
                            </>
                          )}
                        </button>

                        {/* Se tem na loja, eu digito a quantidade! */}
                        {item.hasInStock && (
                          <div className="flex items-center gap-1.5 bg-[#251014] border border-emerald-800/40 rounded px-2 py-0.5">
                            <span className="text-[10px] text-emerald-400 font-medium whitespace-nowrap">
                              Qtd Loja:
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={item.stockQuantity}
                              onChange={(e) => handleUpdateItem(item.id, { stockQuantity: parseInt(e.target.value) || 0 })}
                              className="w-12 bg-[#170a0d] border border-emerald-800/40 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-emerald-300 text-center outline-none focus:border-emerald-500"
                              title="Digite a quantidade disponível em loja ou almoxarifado"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Bottom Row: Quantities and Financials */}
                  <div className="mt-3 pt-3 border-t border-red-950/40 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 items-end">
                    
                    {/* Total Quantity Needed */}
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">
                        Total Necessário:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantityNeeded}
                        onChange={(e) => handleUpdateItem(item.id, { quantityNeeded: parseInt(e.target.value) || 1 })}
                        className="w-full bg-[#1a0f12] border border-red-950/80 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-white text-center outline-none focus:border-red-600"
                      />
                    </div>

                    {/* Quantity To Buy (auto-calculated or manual) */}
                    <div>
                      <label className="block text-[10px] text-red-400 font-semibold mb-1 flex items-center justify-between">
                        <span>Qtd a Comprar:</span>
                        {item.hasInStock && item.stockQuantity > 0 && (
                          <span className="text-[9px] text-emerald-400">(-{item.stockQuantity} loja)</span>
                        )}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.quantityToBuy}
                        onChange={(e) => handleUpdateItem(item.id, { quantityToBuy: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#200d11] border border-red-800/60 rounded-lg px-2.5 py-1.5 text-xs font-mono font-extrabold text-red-300 text-center outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Unit Price */}
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">
                        Preço Unitário (R$):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#1a0f12] border border-red-950/80 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white text-right outline-none focus:border-red-600"
                      />
                    </div>

                    {/* Subtotal */}
                    <div className="bg-[#1d0d10] border border-red-900/50 rounded-lg p-1.5 px-3 flex flex-col justify-center">
                      <span className="text-[10px] text-slate-400">Subtotal a Pagar:</span>
                      <span className="text-xs font-mono font-bold text-white">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>

                    {/* Quick item notes / spec */}
                    <div className="col-span-2 sm:col-span-4 lg:col-span-1">
                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={(e) => handleUpdateItem(item.id, { notes: e.target.value })}
                        placeholder="Obs / Garantia (opcional)"
                        className="w-full bg-[#1a0f12] border border-red-950/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-red-600"
                      />
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
