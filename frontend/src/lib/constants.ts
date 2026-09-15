export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

if (!SITE_URL && process.env.NODE_ENV === "production") {
  console.error(
    "NEXT_PUBLIC_SITE_URL is not set. SEO metadata and canonical URLs will be incorrect."
  );
}
