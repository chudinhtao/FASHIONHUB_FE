import React, { useState } from 'react';
import { StarRating } from './StarRating';
import type { Review } from '../types';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '@/lib/utils';

interface ReviewItemProps {
  review: Review;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  isAdmin,
  onDelete,
  isDeleting = false,
}) => {
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formattedDate = new Date(review.createdAt).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="py-6 border-b border-border-light last:border-b-0 relative group">
      {/* Admin soft delete action */}
      {isAdmin && (
        <button
          onClick={() => {
            if (window.confirm(t('reviews.delete.confirm', 'Bạn có chắc chắn muốn ẩn đánh giá này không?'))) {
              onDelete(review.id);
            }
          }}
          disabled={isDeleting}
          className="absolute top-6 right-0 text-[10px] uppercase font-bold tracking-widest text-error hover:text-red-700 transition-colors duration-200 select-none disabled:opacity-50"
        >
          {isDeleting ? t('reviews.delete.loading', 'Đang ẩn...') : t('reviews.delete.btn', '[Ẩn đánh giá]')}
        </button>
      )}

      {/* Header meta */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-zinc-900 text-white rounded-full flex items-center justify-center font-bold text-xs select-none">
            {getInitials(review.user?.name || 'C')}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-ink">
              {review.user?.name || t('reviews.item.anonymous', 'Khách hàng')}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 mt-0.5">
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="mt-1">
          <StarRating value={review.rating} size={12} />
        </div>
      </div>

      {/* Comment text */}
      {review.comment && (
        <p className="mt-3.5 text-xs text-charcoal font-light leading-relaxed whitespace-pre-wrap select-text">
          {review.comment}
        </p>
      )}

      {/* Attached photos list */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {review.images.map((url, idx) => (
            <div 
              key={idx} 
              className="w-14 aspect-[3/4] overflow-hidden border border-border-light bg-zinc-50 cursor-zoom-in transition-all duration-300 hover:opacity-85"
              onClick={() => setActiveImage(getImageUrl(url))}
            >
              <img 
                src={getImageUrl(url)} 
                alt={`Review attachment ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox photo modal */}
      <Modal
        open={!!activeImage}
        onCancel={() => setActiveImage(null)}
        footer={null}
        destroyOnClose
        centered
        width="auto"
        styles={{
          body: { padding: 0 },
        }}
        modalRender={(node) => (
          <div className="relative inline-block max-w-[90vw] max-h-[90vh] overflow-hidden bg-black">
            <span 
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-50 text-white text-3xl font-bold cursor-pointer select-none"
            >
              &times;
            </span>
            {node}
          </div>
        )}
      >
        {activeImage && (
          <img 
            src={activeImage} 
            alt="Review attachment lightbox"
            className="max-w-[85vw] max-h-[80vh] object-contain mx-auto block"
          />
        )}
      </Modal>
    </div>
  );
};
