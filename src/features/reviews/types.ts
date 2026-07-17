export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string | null;
  images: string[];
  isActive: boolean;
  createdAt: string;
  user: {
    name: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

export interface CanReviewResponse {
  canReview: boolean;
  reason: 'PRODUCT_NOT_FOUND' | 'NOT_PURCHASED' | 'ALREADY_REVIEWED' | null;
}

export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment?: string;
  images?: string[];
}
