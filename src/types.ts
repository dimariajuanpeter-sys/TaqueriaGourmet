/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  disponible: boolean;
  destacado?: boolean;
  mas_vendido?: boolean;
  categoria?: string;
}

export interface Sauce {
  id: string;
  nombre: string;
  picante: boolean;
  premium: boolean;
}

export type OrderStatus = 'Pendiente' | 'Preparando' | 'En camino' | 'Entregado' | 'Cancelar';

export interface Order {
  id: string;
  cliente: string; // "Nombre Apellido"
  telefono: string;
  direccion: string;
  observaciones?: string;
  total: number;
  estado: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  cantidad: number;
  // Included for UI details:
  product?: Product;
  salsas?: Sauce[];
}

export interface CartItem {
  uniqueId: string; // combination of product and selected sauce ids to separate identical products with different sauces
  product: Product;
  cantidad: number;
  salsasSelected: Sauce[];
}
