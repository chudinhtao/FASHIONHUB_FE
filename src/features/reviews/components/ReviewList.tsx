import React from 'react';
import { ReviewItem } from './ReviewItem';
import { useReviewListView } from '../hooks';

interface ReviewListProps {
  productId: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const {
    t,
    isAdmin,
    reviews,
    hasMore,
    isLoading,
    isError,
    refetch,
    limit,
    setLimit,
    deleteReviewMut,
  } = useReviewListView(productId);

  if (isLoading && limit === 5) {
    return (
      <div className="py-8 space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-zinc-200 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-zinc-200 w-1/4" />
                <div className="h-2 bg-zinc-200 w-16" />
              </div>
            </div>
            <div className="h-4 bg-zinc-200 w-full" />
            <div className="h-4 bg-zinc-200 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border border-red-200 bg-red-50 p-4 text-center text-xs text-error font-semibold mt-4">
        <span>{t('reviews.list.error', 'Không thể tải danh sách đánh giá.')}</span>
        <button 
          onClick={() => refetch()} 
          className="underline ml-2 hover:text-red-700 cursor-pointer"
        >
          {t('reviews.list.retry', 'Thử lại')}
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-xs font-light text-charcoal border-t border-border-light select-none">
        {t('reviews.list.empty', 'Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!')}
      </div>
    );
  }

  return (
    <div className="border-t border-border-light mt-2">
      <div className="divide-y divide-border-light">
        {reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            isAdmin={isAdmin}
            onDelete={(id) => deleteReviewMut.mutate(id)}
            isDeleting={deleteReviewMut.isPending && deleteReviewMut.variables === review.id}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setLimit((prev) => prev + 5)}
            className="border border-border-light text-ink hover:border-ink px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 hover:bg-zinc-50"
          >
            {t('reviews.list.loadMore', 'Xem thêm đánh giá')}
          </button>
        </div>
      )}
    </div>
  );
};
