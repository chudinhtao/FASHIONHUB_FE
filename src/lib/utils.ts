import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Gộp các class CSS của Tailwind một cách an toàn và giải quyết các xung đột thuộc tính.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
