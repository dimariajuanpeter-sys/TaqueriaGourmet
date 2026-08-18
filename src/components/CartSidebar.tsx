/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, Ticket, Check, Sparkles, ShoppingBag, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartSidebarProps {
  onCheckoutClick: () => void;
}

export default function CartSidebar({ onCheckoutClick }: CartSidebarProps) {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    couponCode,
    discountPercentage,
    shippingCost,
    subtotal,
    discountAmount,
    total,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    const result = applyCoupon(couponInput);
    setCouponMsg({ success: result.success, text: result.message });
    if (result.success) {
      setCouponInput('');
    }
    setTimeout(() => setCouponMsg(null), 4000);
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div 
        id="cart-backdrop"
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Sidebar panel */}
      <div 
        id="cart-sidebar-panel"
        className="relative flex h-full w-full max-w-md flex-col border-l border-zinc-900 bg-zinc-950/95 p-6 shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-white">Tu Carrito</h3>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold font-mono text-zinc-400">
              {cartItemsCount}
            </span>
          </div>
          <button
            id="close-cart-btn"
            onClick={closeCart}
            className="rounded-lg p-1.5 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {cart.map((item) => (
            <div
              key={item.uniqueId}
              id={`cart-item-${item.uniqueId}`}
              className="flex gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 transition-all"
            >
              {/* Product Thumbnail */}
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
                <img
                  src={item.product.imagen}
                  alt={item.product.nombre}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Detail context */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="text-sm font-semibold text-white truncate leading-snug">
                      {item.product.nombre}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.uniqueId)}
                      className="text-zinc-500 hover:text-ketchup p-0.5 rounded hover:bg-zinc-900 transition-all flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Sauce Badges */}
                  {item.salsasSelected.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.salsasSelected.map((sauce) => (
                        <span
                          key={sauce.id}
                          className={`text-[9px] font-medium px-1.5 py-0.2 rounded border ${
                            sauce.picante
                              ? 'bg-ketchup/10 border-ketchup/30 text-ketchup'
                              : sauce.premium
                                ? 'bg-mustard/10 border-mustard/30 text-mustard'
                                : 'bg-zinc-800/80 border-zinc-700/50 text-zinc-400'
                          }`}
                        >
                          {sauce.picante && '🔥 '}{sauce.nombre}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-600 italic block mt-1">Sin salsas</span>
                  )}
                </div>

                {/* Pricing + Action Controls */}
                <div className="flex items-center justify-between mt-2.5">
                  {/* Quantity controls */}
                  <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
                    <button
                      onClick={() => updateQuantity(item.uniqueId, -1)}
                      className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="px-2 text-xs font-bold font-mono text-zinc-300 min-w-[14px] text-center">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.uniqueId, 1)}
                      className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  <span className="text-xs font-bold font-mono text-white">
                    ${(item.product.precio * item.cantidad).toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500">
              <div className="rounded-full bg-zinc-900 p-4 border border-zinc-800 text-zinc-600 mb-4 animate-bounce">
                <ShoppingBag size={28} />
              </div>
              <h4 className="text-sm font-semibold text-zinc-300">Tu carrito está vacío</h4>
              <p className="text-xs text-zinc-600 mt-1 max-w-[200px]">¡Agregá unos exquisitos tacos gourmet con salsas y combinaciones para empezar!</p>
            </div>
          )}
        </div>

        {/* Coupons, Calculations & Checkout Actions */}
        {cart.length > 0 && (
          <div className="border-t border-zinc-900 pt-4 space-y-4">
            {/* Promo coupon form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Cupón de Descuento</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-zinc-600">
                    <Ticket size={14} />
                  </span>
                  <input
                    type="text"
                    placeholder="Ejem: MEGATACO, TACO10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-600 text-xs rounded-xl pl-8.5 pr-2 py-2 focus:outline-none focus:border-zinc-700 uppercase font-mono font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-300 text-xs font-semibold transition-all"
                >
                  Aplicar
                </button>
              </div>

              {couponMsg && (
                <div className={`text-[10px] font-semibold mt-1 flex items-center gap-1 ${couponMsg.success ? 'text-emerald-400' : 'text-ketchup'}`}>
                  {couponMsg.success ? <Check size={10} /> : <X size={10} />}
                  <span>{couponMsg.text}</span>
                </div>
              )}

              {/* Active coupon tag */}
              {couponCode && (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 mt-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-mono">
                    <Tag size={12} />
                    <span>{couponCode} APILCADO</span>
                    <span className="text-[10px] font-normal bg-emerald-500/20 px-1 py-0.2 rounded">
                      {couponCode === 'DELIVERYGRATIS' ? 'Envíos Gratis' : `-${discountPercentage}%`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-emerald-400 hover:text-white text-[10px] font-bold hover:underline transition-colors"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-zinc-400 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-zinc-300">${subtotal.toLocaleString('es-AR')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Descuento ({discountPercentage}%)</span>
                  <span className="font-mono">-${discountAmount.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Costo de envío</span>
                <span className="font-mono text-zinc-300">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase">Gratis</span>
                  ) : (
                    `$${shippingCost.toLocaleString('es-AR')}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-900/60">
                <span className="font-display">Total</span>
                <span className="font-mono text-mustard">${total.toLocaleString('es-AR')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="confirm-checkout-trigger"
              onClick={onCheckoutClick}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-ketchup to-red-600 hover:from-ketchup-hover hover:to-red-700 text-white font-bold text-sm shadow-md shadow-ketchup/20 hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <ShoppingBag size={16} />
              <span>Confirmar Pedido</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
