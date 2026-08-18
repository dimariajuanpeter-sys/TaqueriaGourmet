/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { X, Flame, Sparkles, Check, FlameKindling, Search, Info, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Product, Sauce } from '../types';

interface SauceSelectionModalProps {
  product: Product;
  sauces: Sauce[];
  onClose: () => void;
  onConfirm: (quantity: number, selectedSauces: Sauce[]) => void;
}

type SauceTab = 'all' | 'classic' | 'premium' | 'spicy';

export default function SauceSelectionModal({ product, sauces, onClose, onConfirm }: SauceSelectionModalProps) {
  const [selectedSauces, setSelectedSauces] = useState<Sauce[]>([]);
  const [activeTab, setActiveTab] = useState<SauceTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Filter and group sauces
  const filteredSauces = useMemo(() => {
    return sauces.filter(sauce => {
      // Search matching
      const matchesSearch = sauce.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Tab matching
      if (activeTab === 'spicy') return sauce.picante;
      if (activeTab === 'premium') return sauce.premium && !sauce.picante;
      if (activeTab === 'classic') return !sauce.premium && !sauce.picante;
      return true; // 'all'
    });
  }, [sauces, activeTab, searchQuery]);

  const toggleSauce = (sauce: Sauce) => {
    setSelectedSauces(prev => {
      const exists = prev.some(s => s.id === sauce.id);
      if (exists) {
        return prev.filter(s => s.id !== sauce.id);
      } else {
        return [...prev, sauce];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(quantity, selectedSauces);
  };

  const hasPicanteSelected = selectedSauces.some(s => s.picante);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#090909] p-6 md:p-8 max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl cursor-default"
      >
        {/* Header Close button */}
        <button 
          id="close-sauce-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 border border-white/10 text-white/40 hover:text-white transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Product Brief */}
        <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-white/10">
          <div className="w-full md:w-1/3 aspect-[4/3] rounded-[24px] overflow-hidden bg-zinc-900 border border-white/5 flex-shrink-0">
            <img 
              src={product.imagen} 
              alt={product.nombre} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-[#E23636]/10 text-[#E23636] border border-[#E23636]/20">
                  {product.categoria || 'Gourmet'}
                </span>
                {product.mas_vendido && (
                  <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-[#F2C94C]/10 text-[#F2C94C] border border-[#F2C94C]/20 flex items-center gap-1">
                    <Sparkles size={8} /> Best Seller
                  </span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mt-2 tracking-tight uppercase">
                {product.nombre}
              </h3>
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                {product.descripcion}
              </p>
            </div>
            <div className="text-xl font-black text-white mt-4 font-mono">
              ${product.precio.toLocaleString('es-AR')}
            </div>
          </div>
        </div>

        {/* Sauce Selection Area */}
        <div className="py-6 flex-1 flex flex-col min-h-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h4 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>Personalizá tus salsas y combinaciones</span>
                <span className="text-[10px] font-mono text-white/40">({selectedSauces.length} elegidas)</span>
              </h4>
              <p className="text-xs text-white/40 mt-1">Elegí todas las salsas, guarniciones y combinaciones artesanales para tu taco gourmet.</p>
            </div>

            {/* Sauce Search */}
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/30">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Buscar salsa o combinación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs rounded-full pl-9 pr-4 py-2 focus:outline-none focus:border-[#F2C94C]/50 transition-all font-sans"
              />
            </div>
          </div>

          {/* Salsas Filters / Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 border shrink-0 ${activeTab === 'all' ? 'bg-[#F2C94C] border-[#F2C94C] text-black font-extrabold' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              <span>Todas</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'all' ? 'bg-black/10 text-black' : 'bg-white/5 text-white/40'}`}>{sauces.length}</span>
            </button>
            <button
              onClick={() => { setActiveTab('classic'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 border shrink-0 ${activeTab === 'classic' ? 'bg-white text-black font-extrabold' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              <span>Clásicas</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'classic' ? 'bg-black/10 text-black' : 'bg-white/5 text-white/40'}`}>{sauces.filter(s => !s.picante && !s.premium).length}</span>
            </button>
            <button
              onClick={() => { setActiveTab('premium'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 border shrink-0 ${activeTab === 'premium' ? 'bg-[#F2C94C] border-[#F2C94C] text-black font-extrabold' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              <Sparkles size={11} />
              <span>Premium</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'premium' ? 'bg-black/10 text-black' : 'bg-white/5 text-white/40'}`}>{sauces.filter(s => s.premium && !s.picante).length}</span>
            </button>
            <button
              onClick={() => { setActiveTab('spicy'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 border shrink-0 ${activeTab === 'spicy' ? 'bg-[#E23636] border-[#E23636] text-white font-extrabold' : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              <Flame size={11} />
              <span>Picantes 🔥</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'spicy' ? 'bg-black/20 text-white' : 'bg-white/5 text-white/40'}`}>{sauces.filter(s => s.picante).length}</span>
            </button>
          </div>

          {/* Salsas Chips Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[35vh] overflow-y-auto pr-1 pb-4 scrollbar-thin">
            {filteredSauces.map((sauce) => {
              const isSelected = selectedSauces.some(s => s.id === sauce.id);
              return (
                <button
                  key={sauce.id}
                  onClick={() => toggleSauce(sauce)}
                  className={`relative flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer select-none group min-h-[64px] ${
                    isSelected 
                      ? sauce.picante
                        ? 'bg-[#E23636]/10 border-[#E23636] text-white'
                        : sauce.premium
                          ? 'bg-[#F2C94C]/10 border-[#F2C94C] text-white'
                          : 'bg-white/10 border-white/30 text-white'
                      : 'bg-white/5 border-white/5 hover:border-white/15 hover:bg-white/10 text-white/70'
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="text-[11px] font-bold leading-tight pr-4 uppercase tracking-wide">
                      {sauce.nombre}
                    </span>
                    <div className="flex-shrink-0 mt-0.5">
                      {isSelected ? (
                        <div className={`flex h-4 w-4 items-center justify-center rounded-full ${sauce.picante ? 'bg-[#E23636]' : sauce.premium ? 'bg-[#F2C94C] text-black' : 'bg-white text-black'}`}>
                          <Check size={10} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-white/10 group-hover:border-white/20" />
                      )}
                    </div>
                  </div>

                  {/* Attributes indicators */}
                  <div className="flex gap-1 mt-2.5">
                    {sauce.premium && (
                      <span className="text-[8px] font-black text-[#F2C94C] uppercase flex items-center gap-0.5 bg-[#F2C94C]/10 px-1.5 py-0.5 rounded-sm">
                        <Sparkles size={8} /> Premium
                      </span>
                    )}
                    {sauce.picante && (
                      <span className="text-[8px] font-black text-[#E23636] uppercase flex items-center gap-0.5 bg-[#E23636]/10 px-1.5 py-0.5 rounded-sm">
                        <Flame size={8} className="animate-pulse" /> Picante
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredSauces.length === 0 && (
              <div className="col-span-full py-8 text-center text-white/40 text-xs">
                No se encontraron salsas con el filtro especificado.
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center text-xs">
              <span className="text-white/40 mr-3 uppercase font-bold text-[10px]">Unidades:</span>
              <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <Minus size={12} />
                </button>
                <span className="px-3 text-xs font-black font-mono text-white min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {hasPicanteSelected && (
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-[#E23636] bg-[#E23636]/10 px-2.5 py-1.5 rounded-full border border-[#E23636]/20 animate-pulse">
                <Flame size={10} />
                <span>Contiene salsas picantes</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/10 text-white/60 hover:text-white text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="confirm-sauces-add-btn"
              onClick={handleConfirm}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#E23636] hover:bg-[#b81e1e] text-white font-black text-[10px] uppercase tracking-wider shadow-lg shadow-[#E23636]/15 hover:scale-102 transition-all cursor-pointer"
            >
              <ShoppingBag size={14} />
              <span>Agregar al Carrito (${(product.precio * quantity).toLocaleString('es-AR')})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
