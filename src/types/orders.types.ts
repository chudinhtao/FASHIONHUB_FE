import { ProductVariant, ProductImage } from './catalog.types';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export interface OrderItemProduct {
  id: string;
  name: string;
  slug: string;
  images: ProductImage[];
}

export interface OrderItemVariant extends ProductVariant {
  product: OrderItemProduct;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: string;
  variant: OrderItemVariant;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string | null;
  orderNumber: string;
  recipientName: string;
  phone: string;
  shippingAddress: string;
  totalAmount: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  notes?: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutInput {
  recipientName: string;
  phone: string;
  shippingAddress: string;
  notes?: string;
}

export interface UpdateAddressInput {
  recipientName: string;
  phone: string;
  shippingAddress: string;
}

export interface UpdateStatusInput {
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
}
