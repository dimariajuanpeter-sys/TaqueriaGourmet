/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Sparkles, 
  Search, 
  Utensils, 
  Truck, 
  ChefHat, 
  MessageSquare, 
  Instagram, 
  Clock, 
  AlertCircle, 
  Phone, 
  ArrowRight, 
  ChevronRight, 
  Copy, 
  Check, 
  Heart,
  HelpCircle,
  TrendingUp,
  X,
  MapPin
} from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import { getProducts, getSauces, getSchemaError, isSupabaseConfigured } from './lib/supabase';
import { Product, Sauce } from './types';

// Components
import GourmetBackground from './components/GourmetBackground';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import SauceSelectionModal from './components/SauceSelectionModal';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import OrderStatusPanel from './components/OrderStatusPanel';
import AdminPanel from './components/AdminPanel';

// Toast Notification Type
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

function TaqueriaLayout() {
  const { cart, activeOrderId, activeOrder, total, openCart } = useCart();
  
  // State variables
  const [products, setProducts] = useState<Product[]>([]);
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [hasDbSchemaError, setHasDbSchemaError] = useState(false);

  // Modal controls
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Loader Simulator to give a pristine skeleton experience
  useEffect(() => {
    async function loadDatabase() {
      try {
        setLoading(true);
        // Add a premium 600ms network simulated latency to show off the skeleton loading!
        await new Promise(resolve => setTimeout(resolve, 750));
        
        const fetchedProducts = await getProducts();
        const fetchedSauces = await getSauces();
        
        setProducts(fetchedProducts);
        setSauces(fetchedSauces);
        setHasDbSchemaError(getSchemaError());
      } catch (e) {
        console.error('Error seeding initial state:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDatabase();
  }, []);

  // Helper: Trigger custom toast
  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleRefreshProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setHasDbSchemaError(getSchemaError());
    } catch (e) {
      console.error('Error refreshing products:', e);
    }
  };

  // Categories extraction
  const categories = useMemo(() => {
    const cats = ['Todos'];
    products.forEach(p => {
      if (p.categoria && !cats.includes(p.categoria)) {
        cats.push(p.categoria);
      }
    });
    return cats;
  }, [products]);

  // Filters logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || p.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const featuredProducts = useMemo(() => {
    return products.filter(p => p.destacado && p.disponible);
  }, [products]);

  // Open modal callback
  const handleAddProductClick = (product: Product) => {
    setModalProduct(product);
  };

  // Confirm custom sauces and item quantity
  const { addToCart } = useCart();
  const handleConfirmAdd = (quantity: number, selectedSauces: Sauce[]) => {
    if (modalProduct) {
      addToCart(modalProduct, quantity, selectedSauces);
      addToast(
        `¡Agregado al carrito: ${quantity}x ${modalProduct.nombre}!`,
        'success'
      );
      setModalProduct(null);
    }
  };

  // Trigger floating WhatsApp chat link
  const handleWhatsAppChat = () => {
    const message = encodeURIComponent(
      "¡Hola! Me gustaría hacer una consulta sobre los tacos gourmet y las salsas de la casa."
    );
    window.open(`https://wa.me/5491112345678?text=${message}`, '_blank');
  };

  return (
    <div className="relative min-h-screen text-zinc-200 antialiased font-sans select-text">
      {/* Dynamic spill abstract background */}
      <GourmetBackground />

      {/* Header bar */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        
        {/* MISSING SCHEMAS / TABLES BANNER */}
        {isSupabaseConfigured && hasDbSchemaError && (
          <div className="p-6 rounded-[28px] border border-red-500/30 bg-red-500/5 backdrop-blur-xl max-w-4xl mx-auto shadow-lg shadow-red-500/5 relative overflow-hidden animate-fade-in">
            {/* Subtle light pulse background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-5 items-start">
              <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex-shrink-0 animate-pulse">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-2 text-left">
                <h3 className="text-base font-black text-red-200 uppercase tracking-tight flex items-center gap-2">
                  <span>⚠️ Conexión Detectada, pero faltan las tablas (SQL)</span>
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Tus variables de entorno <code className="text-white font-mono bg-white/5 px-1 rounded border border-white/5">SUPABASE_URL</code> y <code className="text-white font-mono bg-white/5 px-1 rounded border border-white/5">SUPABASE_ANON_KEY</code> están bien configuradas y activas. 
                  Sin embargo, el motor de base de datos de Supabase responde que <strong>no encuentra las tablas de productos y salsas</strong> en tu proyecto.
                </p>
                <div className="text-xs text-zinc-400 leading-relaxed pt-1">
                  <p className="font-bold text-zinc-300 mb-1">¡Soluciónalo en un clic!</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Haz clic en el botón <span className="text-red-400 font-bold">"Faltan Tablas (SQL)"</span> en la esquina superior derecha de la pantalla (en la barra de navegación).</li>
                    <li>Sigue las instrucciones para copiar el script completo del archivo <code className="text-white font-mono bg-white/10 px-1 rounded">/supabase-setup.sql</code>.</li>
                    <li>Pégalo en el <strong>SQL Editor</strong> de tu panel en Supabase y presiona <strong>Run</strong>. Al recargar, ¡ya estarás interactuando en tiempo real con tu base de datos!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE ORDER TRACKING FLOATER NOTICE */}
        {activeOrderId && activeOrder && (
          <div className="animate-bounce-slow mt-2">
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-3xl mx-auto shadow-md shadow-emerald-500/5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">¡Tu Pedido está Activo!</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Estado: <span className="text-emerald-400 font-bold">{activeOrder.estado}</span> • Código: <span className="font-mono text-zinc-300">{activeOrderId}</span>
                  </p>
                </div>
              </div>
              <a
                href="#seguimiento-pedido"
                className="flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                <span>Seguir en Vivo</span>
                <ChevronRight size={12} />
              </a>
            </div>
          </div>
        )}

        {/* HERO SECTION */}
        <section id="inicio" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 md:pt-8">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white/50">
              <span className="flex h-1.5 w-1.5 rounded-full bg-mustard animate-pulse"></span>
              <span>Premium Delivery • Street Food Gourmet</span>
            </div>
            
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tighter text-white uppercase">
              Los mejores <br />
              <span className="text-ketchup">Tacos</span> <br />
              en tu casa.
            </h1>
            
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-lg">
              Tortillas de maíz nixtamalizado hechas a mano, carnes premium marinadas a fuego lento, cortes selectos y un universo exclusivo con más de 30 salsas y combinaciones gourmet para personalizar tu taco ideal.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#menu"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm hover:bg-mustard transition-all duration-300 shadow-2xl shadow-black hover:scale-102 active:scale-98 cursor-pointer"
              >
                <span>Pedir Ahora</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="#salsas"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white font-bold text-sm transition-all"
              >
                <span>Mural de Salsas ({sauces.length})</span>
              </a>
            </div>

            {/* Quick stats / trust features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 max-w-md">
              <div>
                <span className="block text-xl font-black text-white font-sans">15m</span>
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Tiempo de envío</span>
              </div>
              <div>
                <span className="block text-xl font-black text-white font-sans">30+</span>
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Salsas Gourmet</span>
              </div>
              <div>
                <span className="block text-xl font-black text-white font-sans">100%</span>
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Artesanal</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero tacos showcase image */}
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1200&auto=format&fit=crop" 
              alt="Tacos Gourmet Al Pastor y Ribeye" 
              className="w-full h-full object-cover transform scale-102 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay float pill info */}
            <div className="absolute bottom-6 left-6 right-6 z-20 p-5 rounded-[24px] bg-black/40 border border-white/5 backdrop-blur-md flex justify-between items-center">
              <div>
                <span className="bg-[#F2C94C] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-sm">
                  ⭐ Destacado del mes
                </span>
                <h4 className="text-sm font-black text-white mt-1.5 uppercase tracking-tight">Taco Al Pastor Supremo con Piña Asada</h4>
              </div>
              <a 
                href="#menu" 
                className="p-2.5 rounded-full bg-white text-black hover:bg-mustard transition-colors shadow-lg"
              >
                <ChevronRight size={14} strokeWidth={3} />
              </a>
            </div>
          </div>
        </section>

        {/* PROMOTION BANNER */}
        <section className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          {/* Subtle colored backdrop blobs */}
          <div className="absolute -top-[50%] -left-[10%] w-64 h-64 bg-mustard/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 rounded-2xl bg-mustard/10 border border-mustard/30 text-mustard flex-shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Cupón Premium Activo</span>
                <span className="text-[10px] bg-[#F2C94C] text-black px-2 py-0.5 rounded font-black uppercase">20% OFF</span>
              </h3>
              <p className="text-xs text-white/40 mt-1">
                Usa el código <code className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded font-bold border border-white/5">MEGATACO</code> en el carrito para obtener un 20% de descuento total (o <code className="text-white font-mono bg-white/5 px-1 py-0.5 rounded font-bold">TACO10</code> para 10%).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 font-mono">Envío gratis usando: <code className="text-[#F2C94C] font-bold">DELIVERYGRATIS</code></span>
          </div>
        </section>

        {/* ORDER TRACKING SECTION (Conditional display) */}
        {activeOrderId && (
          <section id="seguimiento-pedido" className="pt-4 scroll-mt-20">
            <div className="text-center space-y-2 mb-6">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
                Seguimiento de tu Delivery 🛵
              </h2>
              <p className="text-xs text-white/40 max-w-sm mx-auto">
                Tu pedido se actualiza automáticamente. Puedes ver su avance a continuación en tiempo real.
              </p>
            </div>
            <OrderStatusPanel />
          </section>
        )}

        {/* FEATURED / DESTACADOS SECTION */}
        {featuredProducts.length > 0 && !loading && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-2xl text-white tracking-tighter uppercase flex items-center gap-2">
                  <Sparkles size={20} className="text-mustard" />
                  <span>Sugerencias del Taquero Chef</span>
                </h2>
                <p className="text-xs text-white/40 mt-1">Nuestras combinaciones y tacos más aclamados para pedir al instante.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onAddClick={handleAddProductClick} 
                />
              ))}
            </div>
          </section>
        )}

        {/* THE CORE MENU (PRODUCT GRID + FILTERS + SEARCH) */}
        <section id="menu" className="space-y-6 scroll-mt-20">
          {/* Header filter controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tighter uppercase">
                Nuestros Tacos Gourmet
              </h2>
              <p className="text-xs text-white/40 mt-1">Elegí tus tacos favoritos y combinalos gratis con más de 30 salsas y guarniciones.</p>
            </div>

            {/* Right filter controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Product Search */}
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/30">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Buscar tacos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-5 pl-10 text-xs focus:outline-none focus:border-[#F2C94C]/50 transition-all text-white placeholder-white/30"
                />
              </div>
            </div>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all duration-300 shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-[#F2C94C] border-[#F2C94C] text-black shadow-lg shadow-[#F2C94C]/10 font-extrabold'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Core Grid */}
          {loading ? (
            /* Pulsing skeleton items during initialization load */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[32px] p-4 flex flex-col justify-between h-[340px] animate-pulse">
                  <div className="w-full aspect-[4/3] rounded-[24px] bg-white/5 mb-4" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/5 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-5/6" />
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                    <div className="h-6 bg-white/5 rounded w-1/3" />
                    <div className="h-8 bg-white/5 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onAddClick={handleAddProductClick} 
                />
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-16 text-white/40">
                  <AlertCircle size={32} className="mx-auto text-white/20 mb-2" />
                  <p className="text-xs">No se encontraron tacos para la búsqueda seleccionada.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* EXTRAVAGANT SAUCES MOSAIC WALL (More than 30 options!) */}
        <section id="salsas" className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 scroll-mt-20 relative overflow-hidden">
          {/* Subtle colored backdrop mustard blob */}
          <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-[#E23636]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-xl mb-8">
            <span className="bg-[#F2C94C] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-sm">
              Universo de Sabores
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-3 tracking-tighter uppercase">
              Mural de Salsas y Guarniciones 🍯
            </h2>
            <p className="text-xs text-white/40 mt-1 leading-relaxed">
              Disponemos de <strong>{sauces.length} opciones distintas</strong> totalmente elaboradas artesanalmente por nuestros chefs taqueros. Desde las clásicas más suaves hasta los picantes más audaces con habanero y chile de árbol.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-wrap gap-2 animate-pulse">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="h-8 w-24 bg-white/5 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-start">
              {sauces.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold uppercase border transition-all duration-300 cursor-pointer ${
                    s.picante
                      ? 'bg-[#E23636]/10 border-[#E23636]/30 text-red-400 hover:bg-[#E23636] hover:text-white'
                      : s.premium
                        ? 'bg-[#F2C94C]/10 border-[#F2C94C]/30 text-[#F2C94C] hover:bg-[#F2C94C] hover:text-black'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white hover:text-black'
                  }`}
                >
                  {s.picante && <Flame size={10} className="text-red-400 animate-pulse group-hover:text-white" />}
                  {s.premium && <Sparkles size={10} className="text-[#F2C94C] group-hover:text-black" />}
                  <span>{s.nombre}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-zinc-500 text-left mt-6 italic">
            * Podés seleccionar múltiples combinaciones sin límite al ordenar tus tacos gourmet.
          </p>
        </section>

        {/* HOW IT WORKS / STEPPER */}
        <section id="how-it-works" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-2">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tighter uppercase">
              ¿Cómo funciona el envío?
            </h2>
            <p className="text-xs text-white/40 max-w-sm mx-auto">
              Nuestra logística premium está pensada para que disfrutes de tacos recién hechos y calientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 text-left relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
              <span className="absolute top-4 right-4 text-4xl font-black font-sans text-white/5 select-none">01</span>
              <div className="h-10 w-10 rounded-xl bg-[#E23636]/10 border border-[#E23636]/20 flex items-center justify-center text-[#E23636] mb-4">
                <Utensils size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Elegí tus Tacos</h3>
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                Navegá entre nuestras variedades de tacos en tortilla nixtamalizada con cortes premium: Pastor, Asada, Birria, Suadero o Pibil.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 text-left relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
              <span className="absolute top-4 right-4 text-4xl font-black font-sans text-white/5 select-none">02</span>
              <div className="h-10 w-10 rounded-xl bg-[#F2C94C]/10 border border-[#F2C94C]/20 flex items-center justify-center text-[#F2C94C] mb-4">
                <ChefHat size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sumá tus Salsas</h3>
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                Elegí gratis tus favoritas entre nuestro catálogo de más de 30 salsas tatemadas, guacamole artesanal, picantes intensos y guarniciones.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 text-left relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
              <span className="absolute top-4 right-4 text-4xl font-black font-sans text-white/5 select-none">03</span>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Truck size={18} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Envío Express</h3>
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                Nuestros repartidores salen al instante. Embalamos en empaque térmico especial para garantizar que tus tacos lleguen recién salidos del comal.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT & SOCIALS */}
        <section id="contacto" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 scroll-mt-20 border-t border-white/5">
          <div className="space-y-6 text-left">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tighter uppercase">
                Hablá con Nosotros
              </h2>
              <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                ¿Tenés consultas para taquizas en eventos corporativos, cumpleaños o pedidos grandes? Escribinos o seguinos en redes sociales para enterarte de los lanzamientos semanales de salsas y tacos especiales.
              </p>
            </div>

            <div className="space-y-3 font-semibold text-xs text-white/50">
              <div className="flex gap-3 items-center">
                <Clock size={16} className="text-white/30" />
                <span>Martes a Domingo de 19:00 a 00:00 hs</span>
              </div>
              <div className="flex gap-3 items-center">
                <MapPin size={16} className="text-white/30" />
                <span>Zona de cobertura: CABA Norte, Argentina</span>
              </div>
              <div className="flex gap-3 items-center">
                <Phone size={16} className="text-white/30" />
                <span>+54 9 11 1234-5678</span>
              </div>
            </div>

            {/* Social handles */}
            <div className="flex gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase"
              >
                <Instagram size={14} />
                <span>Instagram</span>
              </a>
              <button 
                onClick={handleWhatsAppChat}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>WhatsApp Soporte</span>
              </button>
            </div>
          </div>

          {/* Map/gourmet mockup banner */}
          <div className="relative aspect-[16/10] md:aspect-auto rounded-[32px] overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center p-6 text-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop')" }} />
            <div className="relative z-10 space-y-3 max-w-sm">
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-tight">¿Estás en Zona de Envío?</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Entregamos en menos de 25 minutos en Belgrano, Palermo, Núñez, Colegiales y Recoleta. Si estás fuera del mapa, consultanos por WhatsApp.
              </p>
              <button
                onClick={handleWhatsAppChat}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white text-black hover:bg-[#F2C94C] font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>Consultar Cobertura</span>
                <ChevronRight size={12} strokeWidth={3} />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-black/40 py-8 text-center text-[11px] text-white/30 font-bold uppercase tracking-wider">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Flame className="text-[#E23636]" size={14} fill="currentColor" />
            <span className="font-bold tracking-tight text-white/50">TAQUERÍA GOURMET • {new Date().getFullYear()}</span>
          </div>
          <p className="font-bold text-[10px] text-white/20">Diseño Elegant Dark. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* MODALS & SIDEBAR LAYERS */}
      
      {/* Salsas Multi-selection Overlay Modal */}
      {modalProduct && (
        <SauceSelectionModal
          product={modalProduct}
          sauces={sauces}
          onClose={() => setModalProduct(null)}
          onConfirm={handleConfirmAdd}
        />
      )}

      {/* Shopping Cart sliding sidebar */}
      <CartSidebar 
        onCheckoutClick={() => {
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout delivery form overlay modal */}
      {isCheckoutOpen && (
        <CheckoutModal 
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

      {/* Admin Panel product manager modal */}
      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onRefreshProducts={handleRefreshProducts}
        addToast={addToast}
      />

      {/* WHATSAPP FLOAT BUTTON */}
      <button
        id="whatsapp-float-btn"
        onClick={handleWhatsAppChat}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        title="Chatear por WhatsApp"
      >
        <MessageSquare size={26} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* TOAST SYSTEM CONTAINER */}
      <div id="toast-container" className="fixed bottom-6 left-6 z-50 space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full border border-white/10 bg-black/90 backdrop-blur-md text-white text-[10px] font-bold uppercase shadow-2xl pointer-events-auto animate-in slide-in-from-left duration-300"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <TaqueriaLayout />
    </CartProvider>
  );
}
