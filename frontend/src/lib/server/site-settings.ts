import { serverFetch } from "./api";
import type { SiteSettingsResponse } from "@/features/settings/settings-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getSiteSettings() {
  const data = await serverFetch<SiteSettingsResponse>("/api/site-settings");
  return data.site_settings;
}

function resolveMediaUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_URL}/storage/${path}`;
}

export async function getSiteSettingsForMetadata() {
  try {
    const res = await fetch(`${API_URL}/api/site-settings`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const settings = data.site_settings;

    if (settings) {
      settings.brand_logo = resolveMediaUrl(settings.brand_logo);
      settings.favicon = resolveMediaUrl(settings.favicon);
      settings.og_image = resolveMediaUrl(settings.og_image);
    }

    return settings;
  } catch {
    return null;
  }
}
