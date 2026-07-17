import React from 'react';
import { Controller } from 'react-hook-form';
import { StarRating } from './StarRating';
import { useReviewFormView } from '../hooks';
import { getImageUrl } from '@/lib/utils';

interface ReviewFormProps {
  productId: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const {
    t,
    control,
    handleSubmit,
    errors,
    images,
    isUploading,
    fileInputRef,
    createReviewMut,
    handleFileChange,
    removePhoto,
    onSubmit,
  } = useReviewFormView(productId);

  return (
    <div className="border border-border-light p-6 md:p-8 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.01)]">
      <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-5 border-b border-border-light pb-3">
        {t('reviews.form.title', 'Đánh giá của bạn')}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Rating Picker */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-ink uppercase tracking-wider block">
            {t('reviews.form.ratingLabel', 'Chọn số sao')}
          </label>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <StarRating
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                }}
                size={22}
              />
            )}
          />
          {errors.rating && (
            <span className="text-[10px] text-error mt-1 block">
              {t(errors.rating.message || '')}
            </span>
          )}
        </div>

        {/* Comment Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-ink uppercase tracking-wider block">
            {t('reviews.form.commentLabel', 'Bình luận chi tiết')}
          </label>
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder={t(
                  'reviews.form.commentPlaceholder',
                  'Chia sẻ cảm nhận thực tế của bạn về chất liệu, kích cỡ, trải nghiệm mặc sản phẩm này...',
                )}
                maxLength={1000}
                className="w-full h-28 border border-border-light p-3 text-xs font-light text-charcoal outline-none focus:border-ink transition-colors duration-300 resize-none"
              />
            )}
          />
          {errors.comment && (
            <span className="text-[10px] text-error mt-1 block">
              {t(errors.comment.message || '')}
            </span>
          )}
        </div>

        {/* Real photo uploader */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-ink uppercase tracking-wider block">
            {t('reviews.form.photosLabel', 'Hình ảnh thực tế (Tối đa 3 ảnh)')}
          </label>

          <div className="flex gap-3 items-center flex-wrap">
            {/* Upload Click Target */}
            {images.length < 3 && (
              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`w-14 aspect-[3/4] border border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white hover:border-zinc-400 select-none ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? (
                  <span className="text-[9px] font-bold text-zinc-400">...</span>
                ) : (
                  <>
                    <span className="text-lg font-light text-zinc-400 leading-none">+</span>
                    <span className="text-[8px] font-bold text-zinc-400 uppercase mt-0.5">
                      {t('reviews.form.uploadBtn', 'Ảnh')}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Uploaded items previews */}
            {images.map((url, idx) => (
              <div
                key={idx}
                className="w-14 aspect-[3/4] border border-border-light relative overflow-hidden"
              >
                <img
                  src={getImageUrl(url)}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <span
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 w-4 h-4 bg-black/60 hover:bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center cursor-pointer select-none"
                >
                  &times;
                </span>
              </div>
            ))}
          </div>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
          />

          {images.length >= 3 && (
            <div className="text-[9px] text-[#D46B08] bg-[#FFFBE6] border border-[#FFE58F] px-2.5 py-1.5 mt-1 select-none">
              {t('reviews.form.maxPhotosReached', 'Đã đạt giới hạn tối đa 3 ảnh.')}
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={createReviewMut.isPending || isUploading}
          className="w-full bg-ink hover:bg-primaryGold text-white hover:text-white py-3 h-auto font-sans font-bold text-[11px] uppercase tracking-[0.15em] text-center flex items-center justify-center transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          {createReviewMut.isPending
            ? t('reviews.form.submitLoading', 'Đang gửi...')
            : t('reviews.form.submitBtn', 'Gửi đánh giá')}
        </button>
      </form>
    </div>
  );
};
