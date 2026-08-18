/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingCart, Flame, MessageSquare, Menu, X, HelpCircle, Utensils, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SupabaseConfigGuide from './SupabaseConfigGuide';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export default function Navbar({ onOpenAdmin }: NavbarProps) {
  const { cart, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.cantidad, 0);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Menú', href: '#menu' },
    { name: 'Salsas', href: '#salsas' },
    { name: 'Cómo Funciona', href: '#how-it-works' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a 
          href="#inicio" 
          onClick={(e) => handleScroll(e, '#inicio')}
          className="flex items-center gap-2 group cursor-pointer select-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ketchup to-mustard shadow-md shadow-ketchup/20 group-hover:scale-105 transition-transform">
            <Flame className="text-black" size={18} fill="currentColor" />
          </div>
          <span className="font-display font-black tracking-tighter text-base sm:text-lg lg:text-xl flex items-center gap-1.5">
            <span className="text-[#E23636]">TAQUERÍA</span>
            <span className="bg-[#F2C94C] text-black px-1.5 py-0.5 rounded-md italic font-black text-[10px] tracking-tight">GOURMET</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-xs uppercase tracking-wider font-semibold text-white/50 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}

          <button
            onClick={onOpenAdmin}
            className="text-xs uppercase tracking-wider font-bold text-ketchup hover:text-white transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-ketchup/20 bg-ketchup/5 hover:bg-ketchup/20 cursor-pointer"
          >
            <Settings size={12} className="animate-spin-slow" />
            <span>Panel Admin</span>
          </button>
        </nav>

        {/* Action Items */}
        <div className="hidden md:flex items-center gap-4">
          <SupabaseConfigGuide />
          
          <button
            id="open-cart-btn-desktop"
            onClick={openCart}
            className="relative flex items-center gap-2 bg-ketchup px-4 py-2 rounded-full cursor-pointer hover:scale-105 transition-transform border border-white/10"
          >
            <ShoppingCart size={14} className="text-white" />
            <span className="text-[10px] font-black tracking-wider text-white uppercase">CARRITO ({cartItemsCount})</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            id="open-cart-btn-mobile"
            onClick={openCart}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-zinc-300 hover:text-white"
          >
            <ShoppingCart size={16} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-ketchup text-[9px] font-bold text-white ring-1 ring-black">
                {cartItemsCount}
              </span>
            )}
          </button>

          <button
            id="mobile-menu-trigger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-zinc-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-white/5 bg-black/95 px-4 pt-2 pb-4 space-y-3 animate-in fade-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-ketchup hover:bg-zinc-900 transition-colors text-left"
            >
              <Settings size={16} />
              <span>Panel Administrador</span>
            </button>
          </nav>
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-xs text-zinc-500">Base de datos:</span>
            <SupabaseConfigGuide />
          </div>
        </div>
      )}
    </header>
  );
}
