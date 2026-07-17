import { api } from '@/services/api';
import { ApiResponse, PaginatedResponse } from '@/types';
import type { Review, ReviewStats, CanReviewResponse, CreateReviewInput } from './types';

export const reviewsApi = {
  async getProductReviews(
    productId: string,
    params?: { page?: number; limit?: number },
  ): Promise<PaginatedResponse<Review>> {
    return api.get(`/reviews/product/${productId}`, { params });
  },

  async getProductStats(productId: string): Promise<ApiResponse<ReviewStats>> {
    return api.get(`/reviews/stats/${productId}`);
  },

  async canReview(productId: string): Promise<ApiResponse<CanReviewResponse>> {
    return api.get(`/reviews/can-review/${productId}`);
  },

  async createReview(data: CreateReviewInput): Promise<ApiResponse<Review>> {
    return api.post('/reviews', data);
  },

  async deleteReview(id: string): Promise<ApiResponse<any>> {
    return api.delete(`/reviews/${id}`);
  },
};
