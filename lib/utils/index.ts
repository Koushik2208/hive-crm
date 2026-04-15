/**
 * Utility for merging Tailwind CSS classes.
 * Provides a lightweight alternative to clsx + tailwind-merge.
 */
export function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}

// Re-export other utilities as they are added
export * from './currency';
export * from './date';
