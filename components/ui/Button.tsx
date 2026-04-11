import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'segment';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    
    // Core foundational styles
    const baseClass = "inline-flex items-center justify-center font-medium transition-all ease-out duration-200 disabled:opacity-50 disabled:pointer-events-none shrink-0";
    
    // Thematic visual variants matching globals.css tokens
    const variants = {
      primary: "bg-primary-gradient text-surface-container-lowest shadow-[var(--shadow-ambient)] hover:scale-95 font-semibold",
      outline: "border border-outline-variant text-primary hover:bg-surface-container-low",
      ghost: "text-primary hover:bg-surface-container-low",
      segment: "text-secondary hover:text-primary active:bg-surface/50"
    };

    // Standardized spacing and scaling
    const sizes = {
      sm: "px-5 py-1.5 text-sm rounded-full",
      md: "px-6 py-2.5 text-sm rounded-xl",
      lg: "px-8 py-3 text-base rounded-2xl",
      icon: "p-2 rounded-full",
    };

    return (
      <button
        ref={ref}
        className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
