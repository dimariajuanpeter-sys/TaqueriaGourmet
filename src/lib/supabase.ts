/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Product, Sauce, Order, OrderItem, OrderStatus } from '../types';

// Read keys from Vite environment variables (both prefixed and non-prefixed for safety)
const metaEnv = (import.meta as any).env || {};
const SUPABASE_URL = (metaEnv.VITE_SUPABASE_URL || metaEnv.SUPABASE_URL || '').trim();
const SUPABASE_ANON_KEY = (metaEnv.VITE_SUPABASE_ANON_KEY || metaEnv.SUPABASE_ANON_KEY || '').trim();

// Check if keys are actually configured and are not default placeholders
export const isSupabaseConfigured = 
  SUPABASE_URL !== '' && 
  SUPABASE_ANON_KEY !== '' && 
  !SUPABASE_URL.includes('your-supabase-project') &&
  !SUPABASE_ANON_KEY.includes('your-anon-public-key');

// Global tracking for schema table cache errors
export let hasSchemaError = typeof window !== 'undefined' ? localStorage.getItem('supabase_schema_error') === 'true' : false;

export function getSchemaError() {
  return hasSchemaError;
}

export function setSchemaError(val: boolean) {
  hasSchemaError = val;
  if (typeof window !== 'undefined') {
    if (val) {
      localStorage.setItem('supabase_schema_error', 'true');
    } else {
      localStorage.removeItem('supabase_schema_error');
    }
  }
}

// Lazy initialize client to prevent startup crash if keys are missing
let supabaseInstance: any = null;

export function getSupabase() {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseInstance;
}

// ==========================================
// MOCK DATA SEEDING (For Demo/Offline Mode)
// ==========================================

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'taco-pastor',
    nombre: 'Tacos Al Pastor Artesanal',
    descripcion: 'Cerdo marinado 24h en adobo de achiote y cítricos con piña asada al carbón, cilantro fresco y cebollitas moradas encurtidas en tortilla de maíz nixtamalizado.',
    precio: 4200,
    imagen: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop',
    disponible: true,
    destacado: true,
    mas_vendido: true,
    categoria: 'Clásicos'
  },
  {
    id: 'taco-birria',
    nombre: 'Taco Birria de Res con Consomé',
    descripcion: 'Carne de res tierna braseada a fuego lento en chiles secos y especias mexicanas, con queso Oaxaca gratinado, servido con su consomé caliente para chopear.',
    precio: 5400,
    imagen: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop',
    disponible: true,
    destacado: true,
    mas_vendido: true,
    categoria: 'Premium'
  },
  {
    id: 'taco-ribeye',
    nombre: 'Taco de Ribeye & Tuétano Asado',
    descripcion: 'Corte de Ribeye premium a la parrilla sobre costra de queso fundido, bañado con tuétano asado al mezquite y sal marina de Colima.',
    precio: 6200,
    imagen: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=800&auto=format&fit=crop',
    disponible: true,
    destacado: true,
    categoria: 'Premium'
  },
  {
    id: 'taco-suadero',
    nombre: 'Taco de Suadero Confitado',
    descripcion: 'Suadero suave y jugoso confitado en manteca artesanal y hierbas de olor, dorado en plancha con cebolla picada y cilantro criollo.',
    precio: 4600,
    imagen: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=800&auto=format&fit=crop',
    disponible: true,
    categoria: 'Clásicos'
  },
  {
    id: 'taco-pibil',
    nombre: 'Taco Cochinita Pibil Yucateca',
    descripcion: 'Cerdo deshebrado horneado en hoja de plátano con achiote y naranja agria, coronado con cebollitas encurtidas con chile habanero y orégano.',
    precio: 4900,
    imagen: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=800&auto=format&fit=crop',
    disponible: true,
    destacado: true,
    categoria: 'Especiales'
  },
  {
    id: 'taco-gobernador',
    nombre: 'Taco Gobernador de Camarón & Queso',
    descripcion: 'Camarones salteados con pimientos tatemados, cebolla caramelizada y queso fundido dorado a la plancha en tortilla de harina o maíz.',
    precio: 5800,
    imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
    disponible: true,
    categoria: 'Premium'
  },
  {
    id: 'taco-carnitas',
    nombre: 'Taco Carnitas Michoacanas',
    descripcion: 'Pork carnitas estilo Michoacán doradas al exterior y suaves por dentro, con chicharrón crujiente espolvoreado y guacamole rústico.',
    precio: 4700,
    imagen: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=800&auto=format&fit=crop',
    disponible: true,
    mas_vendido: true,
    categoria: 'Clásicos'
  },
  {
    id: 'taco-veggie',
    nombre: 'Taco Hongos Silvestres & Trufa',
    descripcion: 'Mix de portobellos y champiñones salteados al epazote con ajo confitado, crema de aguacate y toque de aceite de trufa blanca.',
    precio: 4800,
    imagen: 'https://images.unsplash.com/photo-1584536286788-78ae83c4c503?q=80&w=800&auto=format&fit=crop',
    disponible: true,
    categoria: 'Veggie'
  },
  {
    id: 'taco-barbacoa',
    nombre: 'Taco Volcán Barbacoa de Cordero',
    descripcion: 'Cordero cocido al vapor en pencas de maguey, servido en tortilla tostada crocante con queso asadero fundido y salsa borracha al pulque.',
    precio: 5900,
    imagen: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop',
    disponible: true,
    destacado: true,
    mas_vendido: true,
    categoria: 'Especiales'
  }
];

const MOCK_SAUCES: Sauce[] = [
  { id: 's-1', nombre: 'Salsa Verde Tatemada', picante: false, premium: false },
  { id: 's-2', nombre: 'Salsa Roja de Molcajete', picante: false, premium: false },
  { id: 's-3', nombre: 'Guacamole Rústico con Pico de Gallo', picante: false, premium: true },
  { id: 's-4', nombre: 'Salsa Macha con Cacahuate & Ajonjolí', picante: true, premium: true },
  { id: 's-5', nombre: 'Salsa Habanero & Mango Tropical', picante: true, premium: true },
  { id: 's-6', nombre: 'Chipotle Cremoso Ahumado', picante: true, premium: false },
  { id: 's-7', nombre: 'Salsa Taquera Tradicional', picante: false, premium: false },
  { id: 's-8', nombre: 'Salsa Borracha al Pulque & Cerveza', picante: false, premium: true },
  { id: 's-9', nombre: 'Queso Fundido Oaxaca Suave', picante: false, premium: true },
  { id: 's-10', nombre: 'Salsa Chimichurri Habanero', picante: true, premium: true },
  { id: 's-11', nombre: 'Cebollitas Moradas Encurtidas', picante: false, premium: false },
  { id: 's-12', nombre: 'Salsa Xnipec Yucateca Cítrica', picante: true, premium: false },
  { id: 's-13', nombre: 'Crema Ácida de Limón & Cilantro', picante: false, premium: false },
  { id: 's-14', nombre: 'Salsa de Chile de Árbol Bravo', picante: true, premium: true },
  { id: 's-15', nombre: 'Salsa de Aguacate & Tomatillo', picante: false, premium: true },
  { id: 's-16', nombre: 'Chiles Toreados en Soya & Limón', picante: true, premium: true },
  { id: 's-17', nombre: 'Salsa Pico de Gallo Fresco', picante: false, premium: false },
  { id: 's-18', nombre: 'Salsa Morita con Piloncillo', picante: false, premium: true },
  { id: 's-19', nombre: 'Queso Cotija Rallado Artesanal', picante: false, premium: false },
  { id: 's-20', nombre: 'Salsa BBQ Chipotle al Mezcal', picante: true, premium: true },
  { id: 's-21', nombre: 'Piña Asada Caramelizada con Canela', picante: false, premium: true },
  { id: 's-22', nombre: 'Crema de Ajo Asado al Carbón', picante: false, premium: true },
  { id: 's-23', nombre: 'Habanera Tatemada Negra Maya', picante: true, premium: true },
  { id: 's-24', nombre: 'Chicharrón de Serrano Crocante', picante: true, premium: true },
  { id: 's-25', nombre: 'Frijoles Refritos con Epazote', picante: false, premium: false },
  { id: 's-26', nombre: 'Salsa de Maracuyá & Serrano', picante: true, premium: true },
  { id: 's-27', nombre: 'Salsa Ranchera Casera', picante: false, premium: false },
  { id: 's-28', nombre: 'Alioli de Cilantro & Lima', picante: false, premium: true },
  { id: 's-29', nombre: 'Salsa Pasilla con Naranja Agria', picante: false, premium: false },
  { id: 's-30', nombre: 'Pesto Mexicano de Cilantro & Pepitas', picante: false, premium: true },
  { id: 's-31', nombre: 'Salsa Secreta del Taquero Mayor', picante: true, premium: true },
  { id: 's-32', nombre: 'Salsa de Jalapeño Asado & Crema', picante: true, premium: false }
];

// Local Storage Helper Initializations
const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('taqueria_orders')) {
    localStorage.setItem('taqueria_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('taqueria_order_items')) {
    localStorage.setItem('taqueria_order_items', JSON.stringify([]));
  }
  if (!localStorage.getItem('taqueria_order_sauces')) {
    localStorage.setItem('taqueria_order_sauces', JSON.stringify([]));
  }
  if (!localStorage.getItem('taqueria_custom_products')) {
    localStorage.setItem('taqueria_custom_products', JSON.stringify([]));
  }
};
initializeLocalStorage();

export function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('taqueria_custom_products');
  return stored ? JSON.parse(stored) : [];
}

export function saveLocalProduct(product: Product) {
  if (typeof window === 'undefined') return;
  const localProducts = getLocalProducts();
  const index = localProducts.findIndex(p => p.id === product.id);
  if (index !== -1) {
    localProducts[index] = product;
  } else {
    localProducts.push(product);
  }
  localStorage.setItem('taqueria_custom_products', JSON.stringify(localProducts));
}

// ==========================================
// DATA RETRIEVAL & MANIPULATION FUNCTIONS
// ==========================================

/**
 * Fetch all available gourmet products
 */
export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('nombre');
      if (error) throw error;
      if (data && data.length > 0) {
        setSchemaError(false);
        return data;
      }
    } catch (e: any) {
      console.warn('Error fetching products from Supabase, returning mock products instead:', e);
      if (e && (e.code === 'PGRST205' || (e.message && e.message.includes('relation') && e.message.includes('does not exist')) || (e.message && e.message.includes('schema cache')))) {
        setSchemaError(true);
      }
    }
  }

  // Fallback merged products (mock + offline custom)
  const localProducts = getLocalProducts();
  const merged = [...MOCK_PRODUCTS];
  localProducts.forEach(localP => {
    const idx = merged.findIndex(m => m.id === localP.id);
    if (idx !== -1) {
      merged[idx] = localP;
    } else {
      merged.push(localP);
    }
  });
  return merged;
}

/**
 * Creates a new product either in Supabase or LocalStorage
 */
export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  const newId = `prod-${Math.floor(100000 + Math.random() * 900000)}`;
  const newProduct: Product = {
    id: newId,
    ...productData,
    disponible: productData.disponible ?? true
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          nombre: productData.nombre,
          descripcion: productData.descripcion,
          precio: productData.precio,
          imagen: productData.imagen,
          disponible: productData.disponible ?? true,
          destacado: productData.destacado ?? false,
          mas_vendido: productData.mas_vendido ?? false,
          categoria: productData.categoria ?? 'Especiales'
        })
        .select()
        .single();
      
      if (!error && data) {
        return data as Product;
      }
      if (error) {
        console.warn('Supabase product creation error, falling back to local storage:', error);
      }
    } catch (e) {
      console.warn('Supabase product creation failed, falling back to local storage:', e);
    }
  }

  // Fallback to local storage
  saveLocalProduct(newProduct);
  return newProduct;
}

/**
 * Updates an existing product either in Supabase or LocalStorage
 */
export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  const supabase = getSupabase();
  let supabaseResult: Product | null = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          nombre: productData.nombre,
          descripcion: productData.descripcion,
          precio: productData.precio,
          imagen: productData.imagen,
          disponible: productData.disponible,
          destacado: productData.destacado,
          mas_vendido: productData.mas_vendido,
          categoria: productData.categoria
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        supabaseResult = data as Product;
      } else if (error) {
        console.warn('Supabase product update error, falling back to local storage:', error);
      }
    } catch (e) {
      console.warn('Supabase product update failed, falling back to local storage:', e);
    }
  }

  // Update in local storage fallback
  const localProducts = getLocalProducts();
  const existingLocal = localProducts.find(p => p.id === id);
  const defaultProduct = MOCK_PRODUCTS.find(p => p.id === id);
  
  const baseProduct = existingLocal || defaultProduct || {
    id,
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    disponible: true,
    categoria: 'Especiales'
  };

  const finalUpdated: Product = {
    ...baseProduct,
    ...productData,
    id // ensure ID remains constant
  };

  saveLocalProduct(finalUpdated);
  return supabaseResult || finalUpdated;
}

/**
 * Fetch all available sauces (all 32 varieties)
 */
export async function getSauces(): Promise<Sauce[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('sauces')
        .select('*')
        .order('nombre');
      if (error) throw error;
      if (data && data.length > 0) {
        setSchemaError(false);
        return data;
      }
    } catch (e: any) {
      console.warn('Error fetching sauces from Supabase, returning mock sauces instead:', e);
      if (e && (e.code === 'PGRST205' || (e.message && e.message.includes('relation') && e.message.includes('does not exist')) || (e.message && e.message.includes('schema cache')))) {
        setSchemaError(true);
      }
    }
  }
  return MOCK_SAUCES;
}

/**
 * Creates a complete order and inserts associated order_items and selected sauces
 */
export async function createOrder(
  orderData: { cliente: string; telefono: string; direccion: string; observaciones?: string; total: number },
  items: { product: Product; cantidad: number; salsasSelected: Sauce[] }[]
): Promise<Order> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      // 1. Insert order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          cliente: orderData.cliente,
          telefono: orderData.telefono,
          direccion: orderData.direccion,
          observaciones: orderData.observaciones || '',
          total: orderData.total,
          estado: 'Pendiente'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert items and sauces
      for (const item of items) {
        const { data: orderItem, error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: item.product.id,
            cantidad: item.cantidad
          })
          .select()
          .single();

        if (itemError) throw itemError;

        // If sauces were selected for this item, link them
        if (item.salsasSelected.length > 0) {
          const sauceLinks = item.salsasSelected.map(sauce => ({
            order_item_id: orderItem.id,
            sauce_id: sauce.id
          }));

          const { error: saucesError } = await supabase
            .from('order_sauces')
            .insert(sauceLinks);

          if (saucesError) throw saucesError;
        }
      }

      return order as Order;
    } catch (e) {
      console.error('Supabase order creation failed. Falling back to local order storage:', e);
    }
  }

  // FALLBACK: Local Storage Database Implementation
  const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder: Order = {
    id: newOrderId,
    cliente: orderData.cliente,
    telefono: orderData.telefono,
    direccion: orderData.direccion,
    observaciones: orderData.observaciones,
    total: orderData.total,
    estado: 'Pendiente',
    created_at: new Date().toISOString()
  };

  // Save order
  const orders = JSON.parse(localStorage.getItem('taqueria_orders') || localStorage.getItem('pancheria_orders') || '[]');
  orders.push(newOrder);
  localStorage.setItem('taqueria_orders', JSON.stringify(orders));

  // Save items and sauce linkages locally
  const localItems = JSON.parse(localStorage.getItem('taqueria_order_items') || localStorage.getItem('pancheria_order_items') || '[]');
  const localSauces = JSON.parse(localStorage.getItem('taqueria_order_sauces') || localStorage.getItem('pancheria_order_sauces') || '[]');

  items.forEach((item, index) => {
    const itemId = `item-${newOrderId}-${index}`;
    localItems.push({
      id: itemId,
      order_id: newOrderId,
      product_id: item.product.id,
      cantidad: item.cantidad
    });

    item.salsasSelected.forEach((sauce, sIndex) => {
      localSauces.push({
        id: `link-${itemId}-${sIndex}`,
        order_item_id: itemId,
        sauce_id: sauce.id
      });
    });
  });

  localStorage.setItem('taqueria_order_items', JSON.stringify(localItems));
  localStorage.setItem('taqueria_order_sauces', JSON.stringify(localSauces));

  // Trigger simulated status transitions for local offline mode to give the user a fantastic experience
  simulateOrderStatusTransitions(newOrderId);

  return newOrder;
}

/**
 * Simulates order preparation, shipping, and delivery transitions in LocalStorage mode
 */
function simulateOrderStatusTransitions(orderId: string) {
  const transitions: { status: OrderStatus; delay: number }[] = [
    { status: 'Preparando', delay: 15000 }, // after 15s
    { status: 'En camino', delay: 35000 },  // after another 20s
    { status: 'Entregado', delay: 55000 }   // after another 20s
  ];

  transitions.forEach(({ status, delay }) => {
    setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem('taqueria_orders') || localStorage.getItem('pancheria_orders') || '[]');
      const orderIndex = orders.findIndex((o: any) => o.id === orderId);
      if (orderIndex !== -1 && orders[orderIndex].estado !== 'Cancelar' && orders[orderIndex].estado !== 'Entregado') {
        orders[orderIndex].estado = status;
        localStorage.setItem('taqueria_orders', JSON.stringify(orders));
        // Dispatch custom event to notify React components about status update
        window.dispatchEvent(new CustomEvent('order-status-update', { detail: { orderId, status } }));
      }
    }, delay);
  });
}

/**
 * Gets the current status of an order
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      if (error) throw error;
      if (data) return data as Order;
    } catch (e) {
      console.warn('Error fetching order from Supabase:', e);
    }
  }

  // Fallback local search
  const orders = JSON.parse(localStorage.getItem('taqueria_orders') || localStorage.getItem('pancheria_orders') || '[]');
  const localOrder = orders.find((o: any) => o.id === orderId);
  return localOrder || null;
}

/**
 * Updates the status of an order (e.g. Cancelling an order or moving forward)
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ estado: status })
        .eq('id', orderId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Error updating status in Supabase:', e);
    }
  }

  // Fallback local update
  const orders = JSON.parse(localStorage.getItem('taqueria_orders') || localStorage.getItem('pancheria_orders') || '[]');
  const orderIndex = orders.findIndex((o: any) => o.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].estado = status;
    localStorage.setItem('taqueria_orders', JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('order-status-update', { detail: { orderId, status } }));
    return true;
  }
  return false;
}

/**
 * Fetch detailed items for a given order, including their products and selected sauces
 */
export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      // In Supabase, we do nested queries
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          order_id,
          product_id,
          cantidad,
          products (*),
          order_sauces (
            sauces (*)
          )
        `)
        .eq('order_id', orderId);

      if (error) throw error;

      if (data) {
        return data.map((item: any) => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          cantidad: item.cantidad,
          product: item.products,
          salsas: item.order_sauces?.map((os: any) => os.from_sauces || os.sauces).filter(Boolean) || []
        }));
      }
    } catch (e) {
      console.warn('Error fetching order items from Supabase:', e);
    }
  }

  // Fallback Local Storage
  const localItems = JSON.parse(localStorage.getItem('taqueria_order_items') || localStorage.getItem('pancheria_order_items') || '[]');
  const localSauces = JSON.parse(localStorage.getItem('taqueria_order_sauces') || localStorage.getItem('pancheria_order_sauces') || '[]');

  const orderItems = localItems.filter((item: any) => item.order_id === orderId);

  return orderItems.map((item: any) => {
    const product = MOCK_PRODUCTS.find(p => p.id === item.product_id);
    const itemSauceIds = localSauces
      .filter((sLink: any) => sLink.order_item_id === item.id)
      .map((sLink: any) => sLink.sauce_id);

    const salsas = MOCK_SAUCES.filter(s => itemSauceIds.includes(s.id));

    return {
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      cantidad: item.cantidad,
      product,
      salsas
    };
  });
}
