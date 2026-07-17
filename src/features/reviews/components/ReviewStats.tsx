import React from 'react';
import { StarRating } from './StarRating';
import type { ReviewStats as ReviewStatsType } from '../types';
import { useTranslation } from 'react-i18next';

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({ stats }) => {
  const { t } = useTranslation();
  const { averageRating, totalReviews, distribution } = stats;

  return (
    <div className="border border-border-light p-6 md:p-8 bg-[#FCFCFB] flex flex-col md:flex-row gap-8 items-center">
      {/* Left side: big average */}
      <div className="flex flex-col items-center justify-center text-center md:border-r md:border-border-light md:pr-10 min-w-[160px]">
        <span className="font-mono text-5xl font-bold tracking-tight text-ink leading-none">
          {averageRating.toFixed(1)}
        </span>
        <div className="mt-3">
          <StarRating value={Math.round(averageRating)} size={18} />
        </div>
        <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider mt-2.5">
          {totalReviews} {t('reviews.stats.totalCount', 'Đánh giá')}
        </span>
      </div>

      {/* Right side: distribution breakdown */}
      <div className="flex-grow w-full space-y-2.5">
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const count = distribution[star.toString() as '1' | '2' | '3' | '4' | '5'] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3 text-xs">
              <span className="w-8 font-semibold text-charcoal text-right select-none">
                {star} ★
              </span>
              <div className="flex-grow h-1.5 bg-zinc-100 relative">
                <div 
                  className="h-full bg-primaryGold transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 text-right font-mono text-charcoal">
                {Math.round(percentage)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
