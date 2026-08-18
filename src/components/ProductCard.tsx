/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddClick: (product: Product) => void;
}

export default function ProductCard({ product, onAddClick }: ProductCardProps) {
  return (
    <article 
      id={`product-card-${product.id}`}
      onClick={() => product.disponible && onAddClick(product)}
      className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 rounded-[32px] flex flex-col justify-between p-4 h-full group cursor-pointer"
    >
      {/* Product Image Section */}
      <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-white/10 transition-colors mb-4 flex-shrink-0">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-[#090909]/85 text-white border border-white/10 backdrop-blur-md">
            {product.categoria || 'Gourmet'}
          </span>
          {product.destacado && (
            <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-gradient-to-r from-[#E23636] to-red-600 text-white border border-white/5 flex items-center gap-1 shadow-md">
              <Sparkles size={8} /> Destacado
            </span>
          )}
          {product.mas_vendido && (
            <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-gradient-to-r from-[#F2C94C] to-amber-500 text-black border border-white/5 flex items-center gap-1 shadow-md">
              🔥 Best Seller
            </span>
          )}
        </div>

        {/* Dynamic Zooming Image */}
        <img
          src={product.imagen}
          alt={product.nombre}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Out of Stock overlay if disabled */}
        {!product.disponible && (
          <div className="absolute inset-0 bg-[#090909]/80 flex items-center justify-center backdrop-blur-sm">
            <span className="text-[10px] font-black tracking-widest uppercase text-white/50 border border-white/10 px-3 py-1.5 rounded-xl bg-black/40">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-[#F2C94C] transition-colors">
            {product.nombre}
          </h3>
          <p className="text-[11px] text-white/40 mt-1 leading-relaxed line-clamp-2 h-8">
            {product.descripcion}
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Precio</span>
            <span className="text-base font-black text-white font-mono">
              ${product.precio.toLocaleString('es-AR')}
            </span>
          </div>

          <button
            id={`add-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (product.disponible) onAddClick(product);
            }}
            disabled={!product.disponible}
            className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase transition-all duration-300 hover:bg-[#E23636] hover:border-[#E23636] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <Plus size={10} strokeWidth={3} />
            <span>Pedir</span>
          </button>
        </div>
      </div>
    </article>
  );
}
