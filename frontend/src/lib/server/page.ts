import { serverFetch } from "./api";
import type { Page } from "@/features/pages/page-types";

export interface PageResponse {
  success: boolean;
  page: Page;
}

export async function getPageBySlug(slug: string): Promise<PageResponse> {
  return serverFetch<PageResponse>(`/api/pages/${slug}`);
}
