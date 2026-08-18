/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, User, Phone, MapPin, ClipboardList, ShoppingBag, Check, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/supabase';

interface CheckoutModalProps {
  onClose: () => void;
}

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { cart, total, clearCart, setActiveOrder, closeCart } = useCart();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    observaciones: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.telefono || !formData.direccion) {
      setErrorMsg('Por favor completá todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const orderData = {
        cliente: `${formData.nombre.trim()} ${formData.apellido.trim()}`,
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim(),
        observaciones: formData.observaciones.trim() || undefined,
        total: total
      };

      // Create formatting for order items
      const itemsFormatted = cart.map(item => ({
        product: item.product,
        cantidad: item.cantidad,
        salsasSelected: item.salsasSelected
      }));

      // Call Supabase / fallback service
      const newOrder = await createOrder(orderData, itemsFormatted);

      if (newOrder) {
        setSuccess(true);
        // Load active order tracking
        setActiveOrder(newOrder.id);
        // Clear shopping cart state
        clearCart();
        // Close sliding cart
        closeCart();
      } else {
        throw new Error('No se pudo procesar el pedido.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Hubo un error al guardar tu pedido. Por favor, reintenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-[32px] border border-white/10 bg-[#090909] p-6 md:p-8 shadow-2xl cursor-default"
      >
        <button
          id="close-checkout-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 border border-white/10 text-white/40 hover:text-white transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {!success ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <h3 className="font-display text-xl font-black text-white tracking-tighter uppercase">Completar Envío 🛵</h3>
              <p className="text-xs text-white/40 mt-1">Ingresá tus datos para que te enviemos tus tacos gourmet calientitos.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-white/40">Nombre *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/30">
                      <User size={14} />
                    </span>
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Juan"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 text-xs rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#F2C94C]/50 transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-white/40">Apellido *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/30">
                      <User size={14} />
                    </span>
                    <input
                      type="text"
                      name="apellido"
                      required
                      value={formData.apellido}
                      onChange={handleChange}
                      placeholder="Pérez"
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 text-xs rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#F2C94C]/50 transition-all font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-white/40">Teléfono Móvil *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/30">
                    <Phone size={14} />
                  </span>
                  <input
                    type="tel"
                    name="telefono"
                    required
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+54 9 11 1234-5678"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 text-xs rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#F2C94C]/50 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-white/40">Dirección Completa de Envío *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/30">
                    <MapPin size={14} />
                  </span>
                  <input
                    type="text"
                    name="direccion"
                    required
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Av. del Libertador 1500, Belgrano, CABA"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 text-xs rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#F2C94C]/50 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-white/40">Observaciones o Notas de Cocina</label>
                <div className="relative">
                  <span className="absolute top-3 left-3.5 pointer-events-none text-white/30">
                    <ClipboardList size={14} />
                  </span>
                  <textarea
                    name="observaciones"
                    rows={2}
                    value={formData.observaciones}
                    onChange={handleChange}
                    placeholder="Por favor cortar a la mitad / Timbre no funciona, llamar al llegar..."
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 text-xs rounded-[20px] pl-10 pr-4 py-3 focus:outline-none focus:border-[#F2C94C]/50 transition-all resize-none font-sans"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs font-bold text-[#E23636] bg-[#E23636]/10 border border-[#E23636]/20 rounded-full py-2.5 px-5">
                  {errorMsg}
                </div>
              )}

              {/* Order summary briefly */}
              <div className="p-4 rounded-[24px] bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                <div className="flex flex-col">
                  <span className="text-white/40 font-bold uppercase text-[9px] tracking-wide">Total de compra</span>
                  <span className="text-[10px] text-white/20 mt-0.5">Incluye envío y descuento</span>
                </div>
                <span className="text-base font-black font-mono text-[#F2C94C]">${total.toLocaleString('es-AR')}</span>
              </div>

              {/* Submit Button */}
              <button
                id="submit-checkout-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#E23636] hover:bg-[#b81e1e] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#E23636]/15 hover:scale-102 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Procesando Pedido...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    <span>Realizar Pedido de Envío</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Success Screen Animation */
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 shadow-md shadow-emerald-500/5">
              <Check size={32} strokeWidth={3} className="animate-bounce" />
            </div>
            <h3 className="font-display text-2xl font-black text-white tracking-tighter uppercase">¡Pedido Recibido!</h3>
            <p className="text-xs text-white/40 mt-2 max-w-[320px] leading-relaxed">
              Tu pedido de panchos gourmet está siendo enviado a la cocina. Podés seguir el progreso del delivery en tiempo real.
            </p>
            <button
              id="goto-tracking-btn"
              onClick={onClose}
              className="mt-8 px-6 py-2.5 rounded-full bg-white text-black hover:bg-[#F2C94C] font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Ver Seguimiento del Envío
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
