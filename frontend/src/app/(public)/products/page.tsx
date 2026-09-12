import { AppBreadcrumb } from "@/components/shared";
import { PageHeader } from "@/components/shared";
import { ProductList } from "@/components/products/product-list";
import { getProducts, getCategories } from "@/lib/server/product";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const SITE_NAME = "Budako Achar";
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
      siteName: SITE_NAME,
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
  const [productsData, categoriesData] = await Promise.all([
    getProducts({ per_page: 12 }),
    getCategories(),
  ]);


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
