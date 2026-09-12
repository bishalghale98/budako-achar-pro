export type UnitType = "g" | "kg";

export type ProductStatus = "active" | "inactive";

export type VariantStatus = "active" | "inactive";

export interface ProductImage {
  id: string;
  image_url: string;
  is_thumbnail: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  weight: number;
  unit: UnitType;
  price: number;
  compare_price: number | null;
  stock: number;
  sku: string | null;
  status: VariantStatus;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  products_count?: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  ingredients: string | null;
  storage_info: string | null;
  rating: number;
  review_count: number;
  featured: boolean;
  status: ProductStatus;
  thumbnail_url: string | null;
  total_stock: number;
  is_available: boolean;
  low_stock: boolean;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProductResponse {
  success: boolean;
  product: Product;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}

export interface ProductReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: "pending" | "approved" | "rejected";
  user: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProductReviewsResponse {
  success: boolean;
  reviews: PaginatedResponse<ProductReview>;
}

export interface CreateReviewRequest {
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}
