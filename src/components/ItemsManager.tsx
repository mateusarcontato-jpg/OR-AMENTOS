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

        if ('hasInStock' in updates && !updated.hasInStock) {
          updated.stockQuantity = 0;
        }

        return updated;
      })
    );
  };

  // Metrics
  const totalToBuyCount = items.reduce((sum, item) => sum + (item.quantityToBuy || 0), 0);
  const totalInStockCount = items.reduce((sum, item) => sum + (item.hasInStock ? (item.stockQuantity || 0) : 0), 0);
  const totalInvestment = items.reduce((sum, item) => sum + ((item.quantityToBuy || 0) * (item.unitPrice || 0)), 0);

  return (
    <div className="space-y-4">
      
      {/* Main Items Section */}
      <div className="bg-[#111217] border border-zinc-800/80 rounded-xl p-4 sm:p-5">
        
        {/* Header of Items + Quick Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-zinc-800/60">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-red-500" />
              Itens do Orçamento ({items.length})
            </h2>
            <span className="text-[11px] text-zinc-500 hidden sm:inline">•</span>
            <span className="text-[11px] text-emerald-400 font-medium">
              {totalInStockCount} em estoque
            </span>
            <span className="text-[11px] text-red-400 font-medium">
              {totalToBuyCount} a comprar
            </span>
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
          <div className="text-center py-8 px-4 border border-dashed border-zinc-800 rounded-lg bg-[#14151c]/40">
            <Package className="w-7 h-7 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-xs font-semibold text-zinc-300 mb-1">Nenhum item adicionado</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition cursor-pointer"
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
                  className="bg-[#151720] border border-zinc-800/80 rounded-lg p-3 hover:border-zinc-700 transition space-y-2.5"
                >
                  {/* Row 1: Index, Item Name, Category, Store & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800/50">
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                      <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-300 shrink-0">
                        {index + 1}
                      </span>

                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                        placeholder="Nome do Equipamento (Ex: SSD NVMe 1TB Kingston)"
                        className="w-full bg-transparent border-0 font-medium text-xs text-white placeholder-zinc-500 outline-none focus:ring-0 px-1 py-0.5"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0">
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

                  {/* Row 2: Link, Stock Control, Quantities & Price in a streamlined layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    
                    {/* Link URL */}
                    <div className="md:col-span-5 flex items-center gap-1.5">
                      <input
                        type="url"
                        value={item.purchaseUrl}
                        onChange={(e) => handleUpdateItem(item.id, { purchaseUrl: e.target.value })}
                        placeholder="Link de compra (https://...)"
                        className="w-full bg-[#12141c] border border-zinc-800 focus:border-red-500 rounded px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none font-mono"
                      />

                      {item.purchaseUrl && (
                        <a
                          href={item.purchaseUrl.startsWith('http') ? item.purchaseUrl : `https://${item.purchaseUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium transition shrink-0"
                          title="Abrir link em nova aba"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300" />
                        </a>
                      )}
                    </div>

                    {/* Stock Control */}
                    <div className="md:col-span-3 flex items-center justify-between gap-2 bg-[#12141c] border border-zinc-800 rounded px-2.5 py-1">
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <Store className="w-3 h-3 text-zinc-400" />
                        Em loja?
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

                        {item.hasInStock && (
                          <input
                            type="number"
                            min="0"
                            value={item.stockQuantity}
                            onChange={(e) => handleUpdateItem(item.id, { stockQuantity: parseInt(e.target.value) || 0 })}
                            className="w-11 bg-zinc-900 border border-emerald-500/30 rounded px-1 py-0.5 text-xs font-mono font-bold text-emerald-300 text-center outline-none"
                            title="Quantidade em estoque"
                          />
                        )}
                      </div>
                    </div>

                    {/* Observations */}
                    <div className="md:col-span-4">
                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={(e) => handleUpdateItem(item.id, { notes: e.target.value })}
                        placeholder="Observação do item (opcional)"
                        className="w-full bg-[#12141c] border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 outline-none focus:border-zinc-600"
                      />
                    </div>

                  </div>

                  {/* Row 3: Qtd a Comprar, Preço Unitário e Subtotal (Sem coluna Necessário) */}
                  <div className="pt-2 border-t border-zinc-800/40 grid grid-cols-3 gap-2.5 items-center text-xs">
                    
                    <div>
                      <span className="text-[10px] text-red-400 font-medium block mb-0.5">Qtd a Comprar</span>
                      <input
                        type="number"
                        min="0"
                        value={item.quantityToBuy}
                        onChange={(e) => handleUpdateItem(item.id, { quantityToBuy: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#1b1317] border border-red-900/60 rounded px-2 py-1 font-mono font-bold text-center text-red-300 outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Preço Unitário (R$)</span>
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
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Subtotal</span>
                      <div className="bg-[#12141c] border border-zinc-800 rounded px-2.5 py-1 font-mono font-bold text-white text-right">
                        {formatCurrency(subtotal)}
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Total Summary Footer inside card */}
        {items.length > 0 && (
          <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              Total de itens a comprar: <strong className="text-white font-mono">{totalToBuyCount} un</strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Valor Total:</span>
              <span className="text-base font-bold font-mono text-white bg-[#161822] px-3 py-1 rounded-lg border border-zinc-800">
                {formatCurrency(totalInvestment)}
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
