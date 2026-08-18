/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function GourmetBackground() {
  return (
    <div className="fixed inset-0 -z-50 bg-[#090909] overflow-hidden select-none pointer-events-none">
      {/* Ketchup Splash (Elegant Dark Red) */}
      <div 
        id="bg-ketchup-splash-top"
        className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#E23636] rounded-full blur-[120px] opacity-10"
      />

      {/* Mustard Squeeze (Elegant Dark Yellow) */}
      <div 
        id="bg-mustard-squeeze-right"
        className="absolute bottom-[-50px] right-[10%] w-[500px] h-[500px] bg-[#F2C94C] rounded-full blur-[150px] opacity-10"
      />

      {/* Mayonnaise Dollop (Elegant Dark White/F2F2F2) */}
      <div 
        id="bg-mayo-dollop-bottom"
        className="absolute top-[20%] right-[-100px] w-[300px] h-[300px] bg-[#F2F2F2] rounded-full blur-[100px] opacity-5"
      />

      {/* Secondary aesthetic blurs to maintain premium contrast depth */}
      <div 
        id="bg-ketchup-splash-bottom"
        className="absolute -bottom-[20%] -left-[10%] w-[450px] h-[450px] bg-[#E23636] rounded-full blur-[130px] opacity-5"
      />

      {/* Artistic Spill Details (Small sharp translucent droplets) using Elegant Dark theme palette */}
      <div className="absolute top-[25%] left-[20%] w-4 h-6 rounded-full bg-[#E23636]/15 blur-[2px] transform rotate-12" />
      <div className="absolute top-[27%] left-[22%] w-2 h-2 rounded-full bg-[#E23636]/20 blur-[1px]" />
      
      <div className="absolute top-[60%] right-[25%] w-5 h-5 rounded-full bg-[#F2C94C]/15 blur-[2px]" />
      <div className="absolute top-[63%] right-[23%] w-3 h-4 rounded-full bg-[#F2C94C]/10 blur-[2px] transform -rotate-45" />

      <div className="absolute bottom-[35%] left-[45%] w-6 h-4 rounded-full bg-[#F2F2F2]/10 blur-[3px]" />
      <div className="absolute bottom-[33%] left-[47%] w-2 h-2 rounded-full bg-[#F2F2F2]/15 blur-[1px]" />
    </div>
  );
}
