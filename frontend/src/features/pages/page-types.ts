import type { TiptapDoc } from "@/components/shared/tiptap";

export type PageStatus = "draft" | "published";

export interface Page {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  content: TiptapDoc | null;
  status: PageStatus;
  created_by: string | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminPagesResponse {
  success: boolean;
  pages: Page[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AdminPageResponse {
  success: boolean;
  page: Page;
}

export interface PageFormData {
  title: string;
  slug: string;
  short_description?: string;
  content?: TiptapDoc;
  status: PageStatus;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
}
