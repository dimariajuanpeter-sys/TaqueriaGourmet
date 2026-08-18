/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Sauce, CartItem, Order, OrderStatus } from '../types';
import { getOrder, updateOrderStatus } from '../lib/supabase';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  couponCode: string;
  discountPercentage: number;
  shippingCost: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  activeOrderId: string | null;
  activeOrder: Order | null;
  addToCart: (product: Product, quantity: number, sauces: Sauce[]) => void;
  removeFromCart: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, delta: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setActiveOrder: (orderId: string | null) => void;
  cancelActiveOrder: () => Promise<boolean>;
  refreshActiveOrder: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('taqueria_cart') || localStorage.getItem('pancheria_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState(() => {
    return localStorage.getItem('taqueria_coupon') || localStorage.getItem('pancheria_coupon') || '';
  });
  const [discountPercentage, setDiscountPercentage] = useState(() => {
    const savedCode = localStorage.getItem('taqueria_coupon') || localStorage.getItem('pancheria_coupon') || '';
    if (savedCode === 'TACO10' || savedCode === 'PANCHO10') return 10;
    if (savedCode === 'MEGATACO' || savedCode === 'MEGAPANCHI') return 20;
    return 0;
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return localStorage.getItem('taqueria_active_order_id') || localStorage.getItem('pancheria_active_order_id') || null;
  });
  const [activeOrder, setActiveOrderState] = useState<Order | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('taqueria_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (couponCode) {
      localStorage.setItem('taqueria_coupon', couponCode);
    } else {
      localStorage.removeItem('taqueria_coupon');
    }
  }, [couponCode]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem('taqueria_active_order_id', activeOrderId);
      refreshActiveOrder();
    } else {
      localStorage.removeItem('taqueria_active_order_id');
      setActiveOrderState(null);
    }
  }, [activeOrderId]);

  // Listener for status updates in local mock mode
  useEffect(() => {
    const handleStatusUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ orderId: string; status: OrderStatus }>;
      if (activeOrderId && customEvent.detail.orderId === activeOrderId) {
        refreshActiveOrder();
      }
    };

    window.addEventListener('order-status-update', handleStatusUpdate);
    return () => {
      window.removeEventListener('order-status-update', handleStatusUpdate);
    };
  }, [activeOrderId]);

  // Periodic pooling for active order status
  useEffect(() => {
    if (!activeOrderId) return;
    const interval = setInterval(() => {
      refreshActiveOrder();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [activeOrderId]);

  const refreshActiveOrder = async () => {
    if (!activeOrderId) return;
    try {
      const order = await getOrder(activeOrderId);
      if (order) {
        setActiveOrderState(order);
      } else {
        // If order not found anywhere, clear active state
        setActiveOrderId(null);
      }
    } catch (e) {
      console.error('Error refreshing active order:', e);
    }
  };

  const setActiveOrder = (orderId: string | null) => {
    setActiveOrderId(orderId);
  };

  const cancelActiveOrder = async (): Promise<boolean> => {
    if (!activeOrderId) return false;
    try {
      const success = await updateOrderStatus(activeOrderId, 'Cancelar');
      if (success) {
        await refreshActiveOrder();
        return true;
      }
    } catch (e) {
      console.error('Error cancelling order:', e);
    }
    return false;
  };

  // Cart Management
  const addToCart = (product: Product, quantity: number, sauces: Sauce[]) => {
    // Sort sauce IDs so the unique combination can be verified
    const sortedSauceIds = [...sauces].map(s => s.id).sort().join(',');
    const uniqueId = `${product.id}-${sortedSauceIds}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.uniqueId === uniqueId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].cantidad += quantity;
        return updated;
      } else {
        return [...prev, { uniqueId, product, cantidad: quantity, salsasSelected: sauces }];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (uniqueId: string) => {
    setCart(prev => prev.filter(item => item.uniqueId !== uniqueId));
  };

  const updateQuantity = (uniqueId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.uniqueId === uniqueId) {
          const newQty = item.cantidad + delta;
          return { ...item, cantidad: Math.max(1, newQty) };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Financial Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.precio * item.cantidad, 0);
  const discountAmount = Math.round(subtotal * (discountPercentage / 100));

  // If cart is empty, shipping is 0, otherwise fixed premium shipping fee (e.g. $450)
  // Support free shipping coupon: DELIVERYGRATIS
  const isFreeShipping = couponCode === 'DELIVERYGRATIS';
  const shippingCost = subtotal > 0 ? (isFreeShipping ? 0 : 500) : 0;

  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'TACO10' || cleanCode === 'PANCHO10') {
      setCouponCode('TACO10');
      setDiscountPercentage(10);
      return { success: true, message: '¡Cupón TACO10 aplicado! 10% de descuento.' };
    }
    if (cleanCode === 'MEGATACO' || cleanCode === 'MEGAPANCHI') {
      setCouponCode('MEGATACO');
      setDiscountPercentage(20);
      return { success: true, message: '¡Cupón MEGATACO aplicado! 20% de descuento premium.' };
    }
    if (cleanCode === 'DELIVERYGRATIS') {
      setCouponCode('DELIVERYGRATIS');
      setDiscountPercentage(0);
      return { success: true, message: '¡Cupón de ENVÍO GRATIS aplicado con éxito!' };
    }
    return { success: false, message: 'El cupón ingresado no es válido.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercentage(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        couponCode,
        discountPercentage,
        shippingCost,
        subtotal,
        discountAmount,
        total,
        activeOrderId,
        activeOrder,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        applyCoupon,
        removeCoupon,
        setActiveOrder,
        cancelActiveOrder,
        refreshActiveOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
