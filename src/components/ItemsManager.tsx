import React from 'react';
import { 
  Package, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Copy, 
  Layers, 
  Store, 
  Check, 
  X,
  ArrowUpRight
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
  'Periféricos (Teclado/Mouse)',
  'Monitores & Vídeo',
  'Redes & Roteamento',
  'Cabos & Adaptadores',
  'Ferramentas & Insumos',
  'Softwares & Licenças',
  'Outros',
];

const POPULAR_STORES = [
  'KaBuM!',
  'Amazon',
  'Pichau',
  'Terabyte',
  'Mercado Livre',
  'Kalunga',
  'Dell',
  'Fornecedor Local',
];

export const ItemsManager: React.FC<ItemsManagerProps> = ({ items, onChangeItems }) => {
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
      supplier: '',
      notes: '',
    };
    onChangeItems([...items, newItem]);
  };

  // Duplicate existing item
  const handleDuplicateItem = (itemToCopy: BudgetItem) => {
    const newItem: BudgetItem = {
      ...itemToCopy,
      id: `item-${Date.now()}`,
      name: itemToCopy.name ? `${itemToCopy.name} (Cópia)` : '',
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

        // If user changed stockQuantity, quantityNeeded or hasInStock
        if ('stockQuantity' in updates || 'quantityNeeded' in updates || 'hasInStock' in updates) {
          if (updated.hasInStock) {
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
      
      {/* Clean KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        <div className="bg-[#111217] border border-zinc-800/80 rounded-xl p-3">
          <p className="text-[11px] text-zinc-400 font-medium">Itens na Lista</p>
          <p className="text-lg font-bold text-white font-mono mt-0.5">{items.length}</p>
        </div>

        <div className="bg-[#111217] border border-zinc-800/80 rounded-xl p-3">
          <p className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
            <Store className="w-3 h-3 text-emerald-400" />
            Em Loja / Estoque
          </p>
          <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
            {totalInStockCount} <span className="text-xs font-normal text-zinc-400">un</span>
          </p>
        </div>

        <div className="bg-[#111217] border border-zinc-800/80 rounded-xl p-3">
          <p className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
            <Package className="w-3 h-3 text-red-400" />
            Qtd a Comprar
          </p>
          <p className="text-lg font-bold text-red-400 font-mono mt-0.5">
            {totalToBuyCount} <span className="text-xs font-normal text-zinc-400">un</span>
          </p>
        </div>

        <div className="bg-[#151219] border border-red-950/90 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-zinc-300">Total do Orçamento</p>
            {potentialSavings > 0 && (
              <span className="text-[10px] text-emerald-400 font-medium">
                Economia: {formatCurrency(potentialSavings)}
              </span>
            )}
          </div>
          <p className="text-lg font-extrabold text-white font-mono mt-0.5">
            {formatCurrency(totalInvestment)}
          </p>
        </div>

      </div>

      {/* Main Items Section */}
      <div className="bg-[#111217] border border-zinc-800/80 rounded-xl p-5">
        
        {/* Header of Items */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-zinc-800/60">
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-500" />
              Equipamentos, Links & Estoque
            </h2>
            <p className="text-[11px] text-zinc-400">
              Cole o link da plataforma de compra e informe se o item já existe na loja
            </p>
          </div>

          <button
            id="btn-add-item"
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Item</span>
          </button>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-zinc-800 rounded-lg bg-[#14151c]/40">
            <Package className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-xs font-semibold text-zinc-300 mb-1">Nenhum item adicionado</h3>
            <p className="text-[11px] text-zinc-500 mb-3">
              Clique no botão para adicionar um equipamento ou peça de T.I.
            </p>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Adicionar Item
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const subtotal = (item.quantityToBuy || 0) * (item.unitPrice || 0);

              return (
                <div
                  key={item.id}
                  className="bg-[#151720] border border-zinc-800/80 rounded-lg p-3.5 hover:border-zinc-700 transition"
                >
                  {/* Row 1: Index, Item Name, Category, Store & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2.5 border-b border-zinc-800/50">
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                      <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-300 shrink-0">
                        {index + 1}
                      </span>

                      {/* Name input */}
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                        placeholder="Nome do Equipamento (Ex: SSD NVMe 1TB Kingston NV2)"
                        className="w-full bg-transparent border-0 font-medium text-xs text-white placeholder-zinc-500 outline-none focus:ring-0 px-1 py-0.5"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                      {/* Category */}
                      <select
                        value={item.category}
                        onChange={(e) => handleUpdateItem(item.id, { category: e.target.value })}
                        className="bg-[#1b1e2a] border border-zinc-800 text-[11px] text-zinc-300 rounded px-2 py-1 outline-none focus:border-zinc-600 cursor-pointer"
                      >
                        {COMMON_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>

                      {/* Store / Supplier */}
                      <input
                        type="text"
                        list={`stores-${item.id}`}
                        value={item.supplier}
                        onChange={(e) => handleUpdateItem(item.id, { supplier: e.target.value })}
                        placeholder="Loja/Fornecedor"
                        className="w-28 bg-[#1b1e2a] border border-zinc-800 text-[11px] text-zinc-300 rounded px-2 py-1 outline-none focus:border-zinc-600"
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
                          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition cursor-pointer"
                          title="Duplicar item"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition cursor-pointer"
                          title="Excluir item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Row 2: Purchase Link & Store Stock Toggle */}
                  <div className="mt-2.5 grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                    
                    {/* Link URL */}
                    <div className="md:col-span-8 flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="url"
                          value={item.purchaseUrl}
                          onChange={(e) => handleUpdateItem(item.id, { purchaseUrl: e.target.value })}
                          placeholder="Link da plataforma de compra (Ex: https://www.kabum.com.br/...)"
                          className="w-full bg-[#12141c] border border-zinc-800 focus:border-red-500 rounded px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none font-mono"
                        />
                      </div>

                      {item.purchaseUrl && (
                        <a
                          href={item.purchaseUrl.startsWith('http') ? item.purchaseUrl : `https://${item.purchaseUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium transition shrink-0"
                          title="Testar link de compra em nova aba"
                        >
                          <span>Testar</span>
                          <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                        </a>
                      )}
                    </div>

                    {/* Stock Control */}
                    <div className="md:col-span-4 flex items-center justify-between sm:justify-end gap-2 bg-[#12141c] border border-zinc-800 rounded px-2.5 py-1">
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <Store className="w-3 h-3 text-zinc-400" />
                        Tem na loja?
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateItem(item.id, { hasInStock: !item.hasInStock })}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                            item.hasInStock
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {item.hasInStock ? 'Sim' : 'Não'}
                        </button>

                        {/* Se tem na loja, digita a quantidade */}
                        {item.hasInStock && (
                          <div className="flex items-center gap-1 bg-zinc-900 border border-emerald-500/30 rounded px-1.5 py-0.5">
                            <span className="text-[10px] text-emerald-400">Qtd:</span>
                            <input
                              type="number"
                              min="0"
                              value={item.stockQuantity}
                              onChange={(e) => handleUpdateItem(item.id, { stockQuantity: parseInt(e.target.value) || 0 })}
                              className="w-10 bg-transparent text-xs font-mono font-bold text-emerald-300 text-center outline-none"
                              title="Quantidade existente em estoque"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Row 3: Quantities and Financials */}
                  <div className="mt-2.5 pt-2 border-t border-zinc-800/40 grid grid-cols-2 sm:grid-cols-5 gap-2 items-center text-xs">
                    
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Total Necessário</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantityNeeded}
                        onChange={(e) => handleUpdateItem(item.id, { quantityNeeded: parseInt(e.target.value) || 1 })}
                        className="w-full bg-[#12141c] border border-zinc-800 rounded px-2 py-1 font-mono text-center text-zinc-200 outline-none focus:border-zinc-600"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-red-400 font-medium block">Qtd a Comprar</span>
                      <input
                        type="number"
                        min="0"
                        value={item.quantityToBuy}
                        onChange={(e) => handleUpdateItem(item.id, { quantityToBuy: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#1b1317] border border-red-900/60 rounded px-2 py-1 font-mono font-bold text-center text-red-300 outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 block">Preço Unitário (R$)</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#12141c] border border-zinc-800 rounded px-2 py-1 font-mono text-right text-zinc-200 outline-none focus:border-zinc-600"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 block">Subtotal</span>
                      <div className="bg-[#12141c] border border-zinc-800 rounded px-2 py-1 font-mono font-bold text-zinc-100 text-right">
                        {formatCurrency(subtotal)}
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-zinc-500 block">Observação</span>
                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={(e) => handleUpdateItem(item.id, { notes: e.target.value })}
                        placeholder="Opcional"
                        className="w-full bg-[#12141c] border border-zinc-800 rounded px-2 py-1 text-zinc-300 placeholder-zinc-600 outline-none focus:border-zinc-600"
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
