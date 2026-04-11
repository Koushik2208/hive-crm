"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, IdCard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', href: '/appointments', icon: Calendar },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Staff', href: '/staff', icon: IdCard },
  { name: 'Services', href: '/services', icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-low flex flex-col py-8 px-6 z-50">
      <div className="mb-8 px-4">
        <h1 className="text-lg font-bold text-primary">The Sanctuary</h1>
        <p className="text-[0.7rem] uppercase tracking-[0.05em] text-secondary font-medium">Luxury Spa & Salon</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          // Check if current path matches href EXACTLY, or if it's a sub-route (e.g. /appointments/123)
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ease-out duration-250 ${
                isActive
                  ? 'bg-surface-container-lowest text-primary shadow-[0px_12px_32px_rgba(78,68,73,0.04)] font-semibold'
                  : 'text-secondary hover:glass-surface'
              }`}
            >
              {/* Force fill on calendar specifically to maintain the mock aesthetic when active */}
              <Icon 
                size={20} 
                fill={isActive && item.name === 'Calendar' ? "currentColor" : "none"} 
                className={isActive ? "text-primary" : ""} 
              />
              <span className="font-sans text-sm tracking-[0.01em]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4">
        <Button variant="primary" className="w-full">
          Book Appointment
        </Button>
      </div>
    </aside>
  );
}
