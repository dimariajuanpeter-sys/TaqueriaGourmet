/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, Key, Terminal, Copy, Check, Info, Server, Sparkles, X, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured, getSchemaError } from '../lib/supabase';

export default function SupabaseConfigGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const schemaError = getSchemaError();
  const isPendingSqlSetup = isSupabaseConfigured && schemaError;

  const sqlCode = `--- 1. Copia y pega el contenido de /supabase-setup.sql
--- 2. Ejecútalo en el Editor SQL de tu proyecto en Supabase (https://database.new)
--- Esto creará las tablas: products, sauces, orders, order_items, order_sauces,
--- e insertará los 8 panchos gourmet destacados y las 32 salsas artesanales de forma automática.`;

  return (
    <>
      {/* Mini floating status pill */}
      <div 
        id="supabase-status-pill"
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-black/40 backdrop-blur-md cursor-pointer transition-all text-xs ${
          isPendingSqlSetup 
            ? 'border-red-500/50 hover:border-red-500 shadow-md shadow-red-500/10' 
            : 'border-zinc-800 hover:border-zinc-700'
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isPendingSqlSetup 
              ? 'bg-red-400' 
              : isSupabaseConfigured 
                ? 'bg-emerald-400' 
                : 'bg-amber-400'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            isPendingSqlSetup 
              ? 'bg-red-500' 
              : isSupabaseConfigured 
                ? 'bg-emerald-500' 
                : 'bg-amber-500'
          }`}></span>
        </span>
        <span className={`font-mono ${isPendingSqlSetup ? 'text-red-400 font-bold' : 'text-zinc-400'}`}>
          {isPendingSqlSetup 
            ? 'Faltan Tablas (SQL)' 
            : isSupabaseConfigured 
              ? 'Supabase Conectado' 
              : 'Modo Demo (Local)'}
        </span>
        <Info size={12} className={isPendingSqlSetup ? 'text-red-400 ml-0.5 animate-pulse' : 'text-zinc-500 ml-0.5'} />
      </div>

      {/* Guide Modal */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#090909] p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl cursor-default"
          >
            <button 
              id="close-guide-btn"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 border border-white/10 text-white/40 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`p-3 rounded-xl border ${
                isPendingSqlSetup 
                  ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                  : isSupabaseConfigured 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                <Database size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {isPendingSqlSetup 
                    ? '¡Falta Ejecutar el Script SQL!' 
                    : isSupabaseConfigured 
                      ? '¡Conexión Supabase Activa!' 
                      : 'Configurar Base de Datos Real (Supabase)'}
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  {isPendingSqlSetup
                    ? 'Las credenciales están conectadas, pero tu base de datos de Supabase aún no tiene el esquema de tablas configurado.'
                    : isSupabaseConfigured 
                      ? 'La aplicación se encuentra leyendo y escribiendo datos directamente de tu base de datos en tiempo real.' 
                      : 'La aplicación está corriendo en modo demo local usando localStorage con 32 salsas y 8 panchos listos para probar.'}
                </p>
              </div>
            </div>

            {/* Missing Tables / SQL Schema Cache Warning Banner */}
            {isPendingSqlSetup && (
              <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs flex gap-3 items-start">
                <AlertCircle size={18} className="flex-shrink-0 text-red-400 mt-0.5 animate-bounce" />
                <div>
                  <h4 className="font-bold text-red-200 mb-1">⚠️ ERROR DE TABLAS DETECTADO (PGRST205)</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Tus credenciales de Supabase en <code className="text-white font-mono">.env</code> están correctas, pero las tablas <code className="text-white font-semibold">products</code> y <code className="text-white font-semibold">sauces</code> no existen en la base de datos de Supabase. La aplicación está operando temporalmente con datos de prueba offline para asegurar su funcionamiento.
                  </p>
                  <p className="text-zinc-400 mt-2 leading-relaxed">
                    <strong>Cómo solucionarlo:</strong> Copia las instrucciones SQL del <strong>Paso 2</strong> abajo, pégalas en el <strong>SQL Editor</strong> de tu proyecto en Supabase (en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-amber-400 underline hover:text-amber-300">supabase.com</a>) y presiona el botón <strong>Run</strong>. Al recargar esta página, tu base de datos estará activa e inicializada con los 8 panchos (incluyendo el nuevo <strong>Pancho Cohete</strong>) y las 32 salsas.
                  </p>
                </div>
              </div>
            )}

            {/* Config Steps */}
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-zinc-200">Crear un proyecto en Supabase</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Ve a <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">supabase.com</a> y crea un proyecto nuevo de base de datos de PostgreSQL en 2 minutos.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-zinc-200">Ejecutar el esquema SQL</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Copia el contenido del archivo <code className="text-zinc-300 font-mono bg-zinc-900 px-1 py-0.5 rounded text-[11px]">/supabase-setup.sql</code> creado en este workspace, pégalo en el **SQL Editor** de Supabase y dale a **Run**.
                  </p>
                  
                  {/* Copy SQL block */}
                  <div className="mt-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                      <Terminal size={14} className="text-zinc-500" />
                      <span>supabase-setup.sql (Schema + 32 Salsas)</span>
                    </div>
                    <button
                      onClick={() => handleCopy(sqlCode, 'sql')}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs transition-all"
                    >
                      {copiedText === 'sql' ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Instrucción SQL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-zinc-200">Configurar Variables de Entorno</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Agrega los secretos de Supabase en la pestaña **Secrets** o **Settings** del panel de AI Studio:
                  </p>
                  <div className="mt-3 p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">VITE_SUPABASE_URL</span>
                      <button 
                        onClick={() => handleCopy('VITE_SUPABASE_URL', 'env1')}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {copiedText === 'env1' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-900 pt-1.5">
                      <span className="text-zinc-500">VITE_SUPABASE_ANON_KEY</span>
                      <button 
                        onClick={() => handleCopy('VITE_SUPABASE_ANON_KEY', 'env2')}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {copiedText === 'env2' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Alert */}
            <div className="mt-8 p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/20 text-xs text-zinc-400 flex items-start gap-2.5">
              <Sparkles size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-300 mb-0.5">Ventaja de nuestro diseño híbrido:</p>
                Aunque no configures las llaves ahora, la aplicación es **100% funcional** para que puedas navegar, elegir salsas premium, armar tu carrito, confirmar pedidos e incluso simular el seguimiento del delivery en tiempo real con transiciones animadas automáticas.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
