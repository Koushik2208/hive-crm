import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
  maxWidth?: string;
}

/**
 * Standard container for all dashboard pages.
 * Ensures consistent padding, max-width, and provides a choice between
 * layout-managed scrolling or component-managed scrolling (for Calendars).
 */
export default function PageContainer({
  children,
  scrollable = true,
  className = '',
  maxWidth = 'max-w-[1600px]'
}: PageContainerProps) {
  return (
    <main
      className={`
        flex-1 p-8 h-full flex flex-col 
        ${maxWidth} mx-auto w-full 
        ${scrollable ? 'overflow-y-auto scrollbar-hide' : 'overflow-hidden'}
        ${className}
      `}
    >
      {children}
    </main>
  );
}
