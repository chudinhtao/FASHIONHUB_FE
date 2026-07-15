export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: Category[];
}

export interface ProductShort {
  id: string;
  name: string;
  slug: string;
  price: string;
  originalPrice?: string | null;
  primaryImage: string;
  category: {
    name: string;
    slug: string;
  };
  totalStock?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  size?: string | null;
  color?: string | null;
  stock: number;
  sku: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: string;
  originalPrice?: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  description?: string | null;
  price: number;
  originalPrice?: number | null;
  categoryId: string;
  images: { url: string; isPrimary: boolean }[];
  variants: { size?: string | null; color?: string | null; stock: number; sku: string }[];
}
