'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  return (
    <footer className="px-10 py-10 flex justify-center items-center gap-4">
      <button className="p-2 bg-surface-container-low rounded-lg text-[#4e4449] hover:bg-[#e9e8e5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-2">
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all duration-200 ${page === currentPage
                ? 'bg-primary text-white shadow-md'
                : 'hover:bg-surface-container-low text-[#4e4449] font-medium'
              }`}
          >
            {page}
          </button>
        ))}
        <span className="text-sm self-end pb-1 text-[#4e4449]/40">...</span>
        <button className="w-8 h-8 rounded-lg hover:bg-surface-container-low text-[#4e4449] text-sm font-medium">
          {totalPages}
        </button>
      </div>

      <button className="p-2 bg-surface-container-low rounded-lg text-[#4e4449] hover:bg-[#e9e8e5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <ChevronRight className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Pagination;
