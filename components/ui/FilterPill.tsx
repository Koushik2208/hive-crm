import React from 'react';

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  colorIndicator?: string | null;
  className?: string;
}

export function FilterPill({
  label,
  isActive,
  onClick,
  icon,
  colorIndicator,
  className = '',
}: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium 
        transition-all duration-300 cursor-pointer 
        ${isActive
          ? "bg-primary text-white shadow-md shadow-primary/20 scale-[0.98]"
          : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:scale-105 active:scale-95"
        }
        ${className}
      `}
    >
      {/* Icon Prefix (e.g. Avatar) */}
      {icon && (
        <div className="flex-shrink-0">
          {icon}
        </div>
      )}

      {/* Color Dot Indicator */}
      {colorIndicator && !icon && (
        <div 
          className={`w-1.5 h-1.5 rounded-full transition-transform duration-300 ${isActive ? 'scale-125 bg-white' : ''}`}
          style={{ backgroundColor: isActive ? '#fff' : colorIndicator }} 
        />
      )}

      <span className={isActive ? 'font-bold' : ''}>
        {label}
      </span>
    </button>
  );
}
