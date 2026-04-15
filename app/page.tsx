'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * HiveCRM Landing Page
 * Designed with the "Aura Velvet" aesthetic:
 * Deep purples, ambient glows, and high-impact editorial typography.
 */
export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-primary flex flex-col items-center justify-center px-6">
      
      {/* Ambient Glow Background Assets */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles className="text-secondary w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            Welcome to the future of CRM
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-display font-bold text-white mb-6 tracking-tighter leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Elevate your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-outline-variant italic">
            Patient Experience
          </span>
        </h1>

        {/* Descriptive Subtext */}
        <p className="max-w-xl text-lg text-white/40 font-light mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          A premium management suite designed for modern clinics. 
          Seamlessly manage clients, appointments, and inventory with the elegance of 
          <span className="text-white/70 font-medium"> Aura Velvet</span>.
        </p>

        {/* Primary CTA Button */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <Link href="/dashboard">
            <button className="group relative px-10 py-5 bg-white rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-white/10 hover:shadow-white/20">
              {/* Button Glow Hover Effect */}
              <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-center gap-3">
                <span className="text-sm font-bold uppercase tracking-widest text-primary group-hover:text-white transition-colors duration-500">
                  Launch Dashboard
                </span>
                <ArrowRight className="w-5 h-5 text-primary group-hover:text-white group-hover:translate-x-1 transition-all duration-500" />
              </div>
            </button>
          </Link>
        </div>

        {/* Footer Attribution */}
        <div className="absolute bottom-[-100px] lg:bottom-12 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold tracking-[0.3em] text-white/20">
          &copy; 2026 HiveCRM &bull; Aura Velvet Design System
        </div>
      </div>
    </main>
  );
}