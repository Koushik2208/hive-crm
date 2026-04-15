'use client'

import React from 'react';
import { Search, Bell, UserCircle } from 'lucide-react';
import { useSearchStore } from '@/stores/searchStore';

export default function Topbar() {
  const { searchQuery, setSearchQuery } = useSearchStore();

  return (
    <header className="sticky top-0 z-40 w-full bg-surface shadow-[0px_4px_16px_rgba(78,68,73,0.02)]">
      <div className="flex h-16 w-full max-w-[1920px] items-center justify-between px-8 mx-auto">
        <div className="flex items-center gap-8">
          <div className="text-xl font-semibold tracking-[-0.02em] text-primary">
            Ethereal CRM
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" size={16} />
            <input
              type="text"
              placeholder="Search services, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-full bg-surface-container-low pl-10 pr-4 py-1.5 text-sm text-primary placeholder-outline-variant focus:outline-none focus:ring-1 focus:ring-secondary transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-primary hover:bg-surface-container-low rounded-full transition-colors duration-300">
            <Bell size={20} />
          </button>
          <div className="group flex cursor-pointer items-center gap-2 pl-2">
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5tTBf-qmaJd5teD5Bd3rca9x8tBEW0BWJSijqduomYZDYq-9y90V8DUfmMoImt8wuUq3P1gJbPRZr-APueW_dy9ANlZOkYIJ-vG1e-bk0imxER7xCboM_21PRZetLUNO59Z3kB0YfFiOd3jKYyM4dhpddKt8QgFvDGb12ztWjGjWU0M0cokCzXGD2SVq3cVC1vQmW-uENkA-kbfZ4jY1CHm8PrOlZBsiY1MbDnePZf9TJnAghQ39k2BvDOTpcHLowxjjfnNyVhvM"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <UserCircle size={20} className="text-primary group-hover:text-secondary transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
