import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Gộp các class CSS của Tailwind một cách an toàn và giải quyết các xung đột thuộc tính.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Trả về URL đầy đủ cho hình ảnh (hỗ trợ ảnh tĩnh tải lên server hoặc ảnh external link).
 */
export function getImageUrl(url: string | null | undefined, fallback = 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80') {
  if (!url) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
  const serverUrl = baseUrl.replace('/api/v1', '');
  return `${serverUrl}${url}`;
}
