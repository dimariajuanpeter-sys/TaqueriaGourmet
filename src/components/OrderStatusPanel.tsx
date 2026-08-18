/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { getOrderItems } from '../lib/supabase';
import { OrderItem } from '../types';
import { Clock, ChefHat, Truck, CheckCircle2, XCircle, ChevronRight, ShoppingBag, MapPin, Phone, RefreshCw, X } from 'lucide-react';

export default function OrderStatusPanel() {
  const { activeOrder, activeOrderId, cancelActiveOrder, setActiveOrder, refreshActiveOrder } = useCart();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function loadItems() {
      if (!activeOrderId) return;
      setLoadingItems(true);
      try {
        const items = await getOrderItems(activeOrderId);
        setOrderItems(items);
      } catch (e) {
        console.error('Error loading order items:', e);
      } finally {
        setLoadingItems(false);
      }
    }
    loadItems();
  }, [activeOrderId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshActiveOrder();
    if (activeOrderId) {
      try {
        const items = await getOrderItems(activeOrderId);
        setOrderItems(items);
      } catch (e) {}
    }
    setTimeout(() => setRefreshing(false), 800);
  };

  if (!activeOrder) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center max-w-xl mx-auto my-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 mx-auto mb-4 animate-spin">
          <RefreshCw size={20} />
        </div>
        <p className="text-sm text-zinc-400">Buscando información de tu pedido...</p>
      </div>
    );
  }

  const { id, cliente, telefono, direccion, observaciones, total, estado, created_at } = activeOrder;

  // Progress stepper mapping
  const statusSteps = [
    { label: 'Pendiente', desc: 'Recibido en cocina', icon: Clock, color: 'text-zinc-400', activeBg: 'bg-zinc-700/50 border-zinc-500' },
    { label: 'Preparando', desc: 'Armando tacos al comal', icon: ChefHat, color: 'text-mustard', activeBg: 'bg-mustard/15 border-mustard' },
    { label: 'En camino', desc: 'Repartidor en viaje', icon: Truck, color: 'text-ketchup', activeBg: 'bg-ketchup/15 border-ketchup' },
    { label: 'Entregado', desc: '¡Buen provecho!', icon: CheckCircle2, color: 'text-emerald-400', activeBg: 'bg-emerald-500/15 border-emerald-500' }
  ];

  const getStepIndex = (currentEstado: string) => {
    if (currentEstado === 'Pendiente') return 0;
    if (currentEstado === 'Preparando') return 1;
    if (currentEstado === 'En camino') return 2;
    if (currentEstado === 'Entregado') return 3;
    return -1; // Canceled
  };

  const currentStepIndex = getStepIndex(estado);
  const isCanceled = estado === 'Cancelar';

  return (
    <div id="order-tracking-panel" className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Tracker Hero */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative corner splash */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-ketchup/5 to-transparent rounded-bl-full pointer-events-none" />

        {/* Top header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-wider">Código de Seguimiento</span>
              <button
                onClick={handleRefresh}
                className={`p-1 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-900 transition-all ${refreshing ? 'animate-spin text-white' : ''}`}
                title="Actualizar estado"
              >
                <RefreshCw size={12} />
              </button>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-mono mt-0.5 tracking-tight flex items-center gap-2">
              <span>{id}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!isCanceled && estado !== 'Entregado' && (
              <button
                id="cancel-order-btn"
                onClick={cancelActiveOrder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-ketchup/30 bg-ketchup/5 text-ketchup hover:bg-ketchup hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <X size={12} />
                <span>Cancelar Pedido</span>
              </button>
            )}

            <button
              id="new-order-btn"
              onClick={() => setActiveOrder(null)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <ShoppingBag size={12} />
              <span>Pedir Otros Tacos</span>
            </button>
          </div>
        </div>

        {/* Status Stepper Timeline */}
        {isCanceled ? (
          <div className="py-8 flex flex-col items-center text-center">
            <XCircle size={48} className="text-ketchup animate-pulse mb-3" />
            <h3 className="font-display text-lg font-bold text-white">Pedido Cancelado</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              Tu pedido ha sido cancelado con éxito. Si fue un error o deseas modificar el pedido, podés armar otro desde el menú principal.
            </p>
          </div>
        ) : (
          <div className="py-8">
            {/* Desktop Horizontal Stepper */}
            <div className="hidden md:grid grid-cols-4 gap-4 relative">
              {/* Stepper bar line */}
              <div className="absolute top-[22px] left-[12.5%] right-[12.5%] h-0.5 bg-zinc-800 -z-10">
                <div 
                  className="h-full bg-gradient-to-r from-zinc-500 via-mustard to-ketchup transition-all duration-1000"
                  style={{ width: `${(currentStepIndex / 3) * 100}%` }}
                />
              </div>

              {statusSteps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;
                const isUpcoming = idx > currentStepIndex;

                return (
                  <div key={step.label} className="flex flex-col items-center text-center">
                    <div className={`h-11 w-11 rounded-full border flex items-center justify-center transition-all duration-500 ${
                      isActive 
                        ? `${step.activeBg} scale-110 shadow-md shadow-white/5` 
                        : isCompleted 
                          ? 'bg-zinc-900 border-zinc-700 text-emerald-400' 
                          : 'bg-zinc-950 border-zinc-900 text-zinc-600'
                    }`}>
                      <Icon size={18} className={isActive ? step.color : ''} />
                    </div>
                    <span className={`text-xs font-bold mt-3 transition-colors ${isActive ? 'text-white' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">{step.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="md:hidden space-y-6">
              {statusSteps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;
                const isUpcoming = idx > currentStepIndex;

                return (
                  <div key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-9 w-9 rounded-full border flex items-center justify-center shrink-0 ${
                        isActive 
                          ? `${step.activeBg} scale-105` 
                          : isCompleted 
                            ? 'bg-zinc-900 border-zinc-700 text-emerald-400' 
                            : 'bg-zinc-950 border-zinc-900 text-zinc-600'
                      }`}>
                        <Icon size={14} className={isActive ? step.color : ''} />
                      </div>
                      {idx < 3 && (
                        <div className={`w-0.5 h-10 my-1 ${isCompleted ? 'bg-zinc-700' : 'bg-zinc-900'}`} />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className={`text-xs font-bold ${isActive ? 'text-white' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Details Accordion */}
        <div className="border-t border-zinc-900/60 pt-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Left Column: Delivery details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">Detalles de Entrega</h4>
            
            <div className="space-y-3 font-medium text-zinc-400">
              <div className="flex gap-2.5 items-start">
                <MapPin size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Dirección</span>
                  <span className="text-zinc-200">{direccion}</span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Phone size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Teléfono de contacto</span>
                  <span className="text-zinc-200">{telefono}</span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Clock size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Fecha y Hora</span>
                  <span className="text-zinc-200">
                    {new Date(created_at).toLocaleDateString('es-AR')} - {new Date(created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {observaciones && (
                <div className="p-3 rounded-xl border border-zinc-900 bg-zinc-900/10 text-[11px] leading-relaxed text-zinc-500">
                  <span className="font-bold text-zinc-400 block mb-0.5">Notas de cocina:</span>
                  "{observaciones}"
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Items */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white font-display uppercase tracking-wider">Tu Menú Elegido</h4>

            {loadingItems ? (
              <div className="py-6 text-center text-zinc-500 animate-pulse">
                Cargando platos...
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-3 justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-zinc-200">
                        <span className="font-mono font-bold text-mustard bg-mustard/10 px-1.5 py-0.2 rounded text-[10px]">
                          x{item.cantidad}
                        </span>
                        <span className="font-semibold truncate text-xs">
                          {item.product?.nombre || 'Pancho Especial'}
                        </span>
                      </div>
                      
                      {/* Sauces of this item */}
                      {item.salsas && item.salsas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 pl-7">
                          {item.salsas.map((s) => (
                            <span 
                              key={s.id} 
                              className={`text-[9px] px-1 py-0.1 rounded ${s.picante ? 'bg-ketchup/10 text-ketchup' : s.premium ? 'bg-mustard/10 text-mustard' : 'bg-zinc-900 text-zinc-500'}`}
                            >
                              {s.nombre}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-zinc-300 shrink-0 font-medium">
                      ${((item.product?.precio || 0) * item.cantidad).toLocaleString('es-AR')}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between font-bold text-white text-sm pt-4 border-t border-zinc-900/60 font-mono">
                  <span>Total Pagado</span>
                  <span className="text-mustard">${total.toLocaleString('es-AR')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
