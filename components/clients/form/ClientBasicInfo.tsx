"use client";

import React from 'react';
import { User, Camera, Edit2 } from 'lucide-react';
import { FormInput } from '@/components/ui/FormInput';

interface ClientBasicInfoProps {
  avatarPreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ClientBasicInfo({ 
  avatarPreview, 
  onImageChange 
}: ClientBasicInfoProps) {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <User className="text-secondary" size={22} />
        <h3 className="text-lg font-bold text-primary tracking-tight">Basic Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Avatar Upload Container */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="relative group">
            <div 
              className={`w-36 h-36 rounded-full bg-surface-container-low border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant cursor-pointer hover:border-secondary hover:bg-secondary-container/10 transition-all overflow-hidden ${avatarPreview ? 'border-none' : ''}`}
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera size={32} className="mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Upload Profile</span>
                </>
              )}
            </div>
            <input 
              id="avatar-upload" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={onImageChange}
            />
            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-2.5 rounded-full shadow-lg border-2 border-white cursor-pointer group-hover:scale-110 transition-transform">
              <Edit2 size={14} />
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-4 text-center leading-relaxed">
            Optimal: 400x400px<br />JPG or PNG
          </p>
        </div>

        {/* Identity Fields */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
          <FormInput 
            name="firstName" 
            label="First Name" 
            placeholder="e.g. Elena" 
            required 
          />
          <FormInput 
            name="lastName" 
            label="Last Name" 
            placeholder="e.g. Vance" 
            required 
          />
          <FormInput 
            name="email" 
            label="Email Address" 
            type="email" 
            placeholder="elena@luxurymail.com" 
            required 
          />
          <FormInput 
            name="phone" 
            label="Phone Number" 
            placeholder="+91 00000 00000" 
            required
          />
        </div>
      </div>
    </section>
  );
}
