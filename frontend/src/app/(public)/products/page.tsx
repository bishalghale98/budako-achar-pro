import { AppBreadcrumb } from "@/components/shared";
import { PageHeader } from "@/components/shared";
import { ProductList } from "@/components/products/product-list";
import { Metadata } from "next";
import { getSiteSettingsForMetadata } from "@/lib/server/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsForMetadata();
  const siteName = settings?.brand_name || "Buda Ko Achar";
  const title = `Our Achar Collection | Traditional Nepali Achar`;
  const description = `Discover our collection of traditional Nepali achar made with authentic spices. Handcrafted and delivered fresh.`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://budaachar.com"}/products`;

  return {
    title,
    description,
    keywords: ["Nepali Achar", "Traditional Pickles", "Authentic Spices", "Buda Achar Collection"],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}


export default async function ProductsPage() {


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AppBreadcrumb items={[{ label: "Products" }]} />
      <PageHeader
        title="Our Achar Collection"
        description="Discover our collection of traditional Nepali achar made with authentic spices."
      />
      <ProductList />
    </div>
  );
}
