import { ProductVariant, ProductImage } from './catalog.types';

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  originalPrice?: string | null;
  images: ProductImage[];
}

export interface CartProductVariant extends ProductVariant {
  product: CartProduct;
}

export interface CartItem {
  id: string;
  userId: string;
  variantId: string;
  quantity: number;
  variant: CartProductVariant;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartInput {
  variantId: string;
  quantity: number;
}

export interface UpdateCartQtyInput {
  quantity: number;
}
