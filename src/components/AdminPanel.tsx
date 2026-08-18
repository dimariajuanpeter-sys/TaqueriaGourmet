/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Edit3, Check, ToggleLeft, ToggleRight, 
  Trash, Save, ArrowLeft, Image as ImageIcon, Sparkles, 
  Flame, HelpCircle, AlertCircle, ShoppingBag, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { createProduct, updateProduct } from '../lib/supabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRefreshProducts: () => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const CATEGORIES = ['Clásicos', 'Premium', 'Especiales', 'Veggie'];

const PRESET_IMAGES = [
  { name: 'Al Pastor con Piña', url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop' },
  { name: 'Birria con Consomé', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop' },
  { name: 'Ribeye & Tuétano', url: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=800&auto=format&fit=crop' },
  { name: 'Suadero Confitado', url: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=800&auto=format&fit=crop' },
  { name: 'Cochinita Pibil', url: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=800&auto=format&fit=crop' },
  { name: 'Gobernador Camarón', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop' },
  { name: 'Carnitas Michoacanas', url: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=800&auto=format&fit=crop' },
  { name: 'Hongos & Trufa Veggie', url: 'https://images.unsplash.com/photo-1584536286788-78ae83c4c503?q=80&w=800&auto=format&fit=crop' },
];

export default function AdminPanel({ isOpen, onClose, products, onRefreshProducts, addToast }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState<number>(4500);
  const [imagen, setImagen] = useState('');
  const [categoria, setCategoria] = useState('Clásicos');
  const [disponible, setDisponible] = useState(true);
  const [destacado, setDestacado] = useState(false);
  const [mas_vendido, setMasVendido] = useState(false);

  // Handle switching to create mode
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setNombre('');
    setDescripcion('');
    setPrecio(4500);
    setImagen(PRESET_IMAGES[0].url);
    setCategoria('Clásicos');
    setDisponible(true);
    setDestacado(false);
    setMasVendido(false);
    setActiveTab('form');
  };

  // Handle switching to edit mode
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setNombre(product.nombre);
    setDescripcion(product.descripcion);
    setPrecio(product.precio);
    setImagen(product.imagen);
    setCategoria(product.categoria || 'Clásicos');
    setDisponible(product.disponible);
    setDestacado(product.destacado || false);
    setMasVendido(product.mas_vendido || false);
    setActiveTab('form');
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      addToast('El nombre del taco es requerido', 'error');
      return;
    }
    if (!descripcion.trim()) {
      addToast('La descripción es requerida', 'error');
      return;
    }
    if (precio <= 0) {
      addToast('El precio debe ser mayor a 0', 'error');
      return;
    }
    if (!imagen.trim()) {
      addToast('Se requiere una URL de imagen', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio,
        imagen: imagen.trim(),
        categoria,
        disponible,
        destacado,
        mas_vendido
      };

      if (editingProduct) {
        // Edit Mode
        const updated = await updateProduct(editingProduct.id, productData);
        addToast(`¡Taco "${updated.nombre}" actualizado con éxito!`, 'success');
      } else {
        // Create Mode
        const created = await createProduct(productData);
        addToast(`¡Taco "${created.nombre}" creado con éxito!`, 'success');
      }

      onRefreshProducts();
      setActiveTab('list');
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Error saving product:', error);
      addToast(error.message || 'Error al guardar el producto', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter products for local search
  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.categoria && p.categoria.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal content container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-4xl rounded-[32px] border border-zinc-800 bg-zinc-950/95 shadow-2xl overflow-hidden glass-panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-ketchup/15 border border-ketchup/30 flex items-center justify-center text-ketchup">
                <Flame size={20} className="animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Panel de Control</span>
                  <span className="text-[10px] uppercase font-mono tracking-widest bg-ketchup px-2 py-0.5 rounded-full text-white font-bold">Admin</span>
                </h2>
                <p className="text-xs text-zinc-400">Agrega, edita e inhabilita tacos gourmet en tiempo real</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {activeTab === 'list' ? (
              <div className="space-y-6">
                {/* Search and Action Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:max-w-xs">
                    <input 
                      type="text" 
                      placeholder="Buscar taco por nombre o desc..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-ketchup/50 transition-colors"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <button 
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-gradient-to-r from-ketchup to-ketchup/90 hover:brightness-110 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer shadow-md shadow-ketchup/20"
                  >
                    <Plus size={16} />
                    <span>Nuevo Taco Gourmet</span>
                  </button>
                </div>

                {/* Table / List */}
                {filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10">
                    <ShoppingBag size={40} className="text-zinc-600 mb-3" />
                    <p className="text-sm font-bold text-zinc-400">No se encontraron tacos</p>
                    <p className="text-xs text-zinc-500 mt-1">Intenta cambiar los términos de búsqueda o agrega uno nuevo.</p>
                  </div>
                ) : (
                  <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-black/10 divide-y divide-zinc-900">
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Left Info */}
                        <div className="flex items-center gap-4">
                          <img 
                            src={product.imagen} 
                            alt={product.nombre}
                            className="w-14 h-14 rounded-xl object-cover border border-zinc-800/80 bg-zinc-900"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-white text-sm">{product.nombre}</h4>
                              <span className="text-[10px] font-mono bg-zinc-900 px-2 py-0.5 rounded text-zinc-400 border border-zinc-800/50">
                                {product.categoria || 'Especiales'}
                              </span>
                              {!product.disponible && (
                                <span className="text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">
                                  Pausado
                                </span>
                              )}
                              {product.destacado && (
                                <span className="text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                                  ★ Destacado
                                </span>
                              )}
                              {product.mas_vendido && (
                                <span className="text-[10px] font-bold bg-ketchup/15 text-ketchup border border-ketchup/20 px-2 py-0.5 rounded">
                                  🔥 Más Vendido
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400 line-clamp-1 max-w-md">{product.descripcion}</p>
                            <p className="text-xs font-mono font-bold text-mustard">${product.precio.toLocaleString('es-AR')}</p>
                          </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button 
                            onClick={() => handleOpenEdit(product)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-300 hover:text-white text-xs transition-colors cursor-pointer"
                          >
                            <Edit3 size={14} />
                            <span>Editar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Creation & Editing Form */
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                {/* Form Navigation Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
                  <button 
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs transition-colors"
                  >
                    <ArrowLeft size={14} />
                    <span>Volver a la lista</span>
                  </button>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono">
                    {editingProduct ? 'Modo Edición de Datos' : 'Modo Registro'}
                  </span>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Core info */}
                  <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Nombre del Taco Gourmet</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Tacos de Asada al Mezquite"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-ketchup/50 transition-colors"
                      />
                    </div>

                    {/* Categoria */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Categoría</label>
                      <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map(cat => (
                          <button 
                            key={cat}
                            type="button"
                            onClick={() => setCategoria(cat)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              categoria === cat 
                                ? 'bg-ketchup/10 border-ketchup text-ketchup font-bold shadow-md shadow-ketchup/5' 
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Precio */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Precio (ARS)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                        <input 
                          type="number" 
                          required
                          min={1}
                          placeholder="5900"
                          value={precio || ''}
                          onChange={(e) => setPrecio(Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-ketchup/50 transition-colors font-mono"
                        />
                      </div>
                    </div>

                    {/* Descripción */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Descripción Gourmet</label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="Describe detalladamente los ingredientes gourmet, tipo de carne/mariscos, adobo y guarniciones..."
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-ketchup/50 transition-colors resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Right Column: Visual and flags */}
                  <div className="space-y-5">
                    {/* Imagen URL */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">URL de Imagen (Unsplash u otro)</label>
                      <input 
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={imagen}
                        onChange={(e) => setImagen(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-ketchup/50 transition-colors font-mono text-xs"
                      />
                    </div>

                    {/* Preset images tool */}
                    <div>
                      <span className="block text-[11px] font-medium text-zinc-500 mb-2">Presintonías de imágenes recomendadas:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {PRESET_IMAGES.map((preset, index) => (
                          <button 
                            key={index}
                            type="button"
                            onClick={() => {
                              setImagen(preset.url);
                              addToast(`Se seleccionó la imagen de ${preset.name}`, 'info');
                            }}
                            className={`group relative h-14 rounded-lg overflow-hidden border transition-all ${
                              imagen === preset.url ? 'border-ketchup ring-2 ring-ketchup/30' : 'border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <img 
                              src={preset.url} 
                              alt={preset.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="text-[9px] font-bold text-white tracking-tight leading-none px-1 text-center truncate w-full">{preset.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Flags / Boolean controls */}
                    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
                      <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800/50 pb-2 mb-2">Configuración de Visibilidad</span>
                      
                      {/* Disponible */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-zinc-300">¿Habilitado para la venta?</p>
                          <p className="text-[11px] text-zinc-500">Muestra u oculta este producto inmediatamente del menú general.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setDisponible(!disponible)}
                          className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {disponible ? (
                            <ToggleRight size={32} className="text-ketchup" />
                          ) : (
                            <ToggleLeft size={32} className="text-zinc-600" />
                          )}
                        </button>
                      </div>

                      {/* Destacado */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-zinc-300">¿Producto Destacado?</p>
                          <p className="text-[11px] text-zinc-500">Aparecerá destacado al inicio de la página principal.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setDestacado(!destacado)}
                          className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {destacado ? (
                            <ToggleRight size={32} className="text-amber-400" />
                          ) : (
                            <ToggleLeft size={32} className="text-zinc-600" />
                          )}
                        </button>
                      </div>

                      {/* Más Vendido */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-zinc-300">¿Etiqueta "Más Vendido"?</p>
                          <p className="text-[11px] text-zinc-500">Añade un sticker llamativo al producto en el menú.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setMasVendido(!mas_vendido)}
                          className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {mas_vendido ? (
                            <ToggleRight size={32} className="text-ketchup" />
                          ) : (
                            <ToggleLeft size={32} className="text-zinc-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
                  <button 
                    type="button"
                    onClick={() => {
                      setActiveTab('list');
                      setEditingProduct(null);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-gradient-to-r from-ketchup to-ketchup/90 hover:brightness-110 disabled:opacity-50 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer shadow-md shadow-ketchup/20"
                  >
                    {isSubmitting ? (
                      <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    <span>{editingProduct ? 'Guardar Cambios' : 'Crear Producto'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
