'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 3;
  
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <footer className="px-10 py-10 flex justify-center items-center gap-4">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 bg-surface-container-low rounded-lg text-[#4e4449] hover:bg-[#e9e8e5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all duration-200 ${page === currentPage
                ? 'bg-primary text-white shadow-md'
                : 'hover:bg-surface-container-low text-[#4e4449] font-medium'
              }`}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            <span className="text-sm self-end pb-1 text-[#4e4449]/40">...</span>
            <button 
              onClick={() => onPageChange(totalPages)}
              className={`w-8 h-8 rounded-lg text-sm font-bold transition-all duration-200 ${totalPages === currentPage
                ? 'bg-primary text-white shadow-md'
                : 'hover:bg-surface-container-low text-[#4e4449] font-medium'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 bg-surface-container-low rounded-lg text-[#4e4449] hover:bg-[#e9e8e5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Pagination;
