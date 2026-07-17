import { z } from 'zod';

export const reviewFormSchema = z.object({
  rating: z
    .number({
      message: 'reviews.form.validation.ratingRequired',
    })
    .min(1, 'reviews.form.validation.ratingMin')
    .max(5, 'reviews.form.validation.ratingMax'),
  comment: z
    .string()
    .max(1000, 'reviews.form.validation.commentMax')
    .optional()
    .or(z.literal('')),
  images: z
    .array(z.string())
    .max(3, 'reviews.form.validation.imagesMax'),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
