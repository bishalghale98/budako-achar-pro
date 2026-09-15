import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/server/product";
import { ProductGallery } from "@/components/product-details";
import { AppBreadcrumb } from "@/components/shared";
import { ProductDetailsClient } from "./product-details-client";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const data = await getProductBySlug(slug);
    return data.product;
  } catch {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  const description =
    product.short_description ||
    product.description ||
    `Buy ${product.title} online.`;

  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;

  const thumbnail = product.thumbnail_url ?? product.images?.[0]?.image_url;

  return {
    title: product.title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: product.status === "active",
      follow: true,
    },

    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: product.title,
      description,
      siteName: "Buda's Ko Achar",
      ...(thumbnail && {
        images: [
          {
            url: thumbnail,
            alt: product.title,
            width: 800,
          },
        ],
      }),
    },

    twitter: {
      card: thumbnail ? "summary_large_image" : "summary",
      title: product.title,
      description,
      ...(thumbnail && {
        images: [thumbnail],
      }),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProduct(slug);

  const images = product.images ?? [];

  const description =
    product.description ??
    product.short_description ??
    "";

  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;

  const variants = product.variants ?? [];

  const prices = variants
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price));

  const lowestPrice =
    prices.length > 0 ? Math.min(...prices) : undefined;

  const highestPrice =
    prices.length > 0 ? Math.max(...prices) : undefined;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description,
    url: canonicalUrl,

    image: images
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => image.image_url),

    category: product.category?.name,

    aggregateRating:
      product.review_count > 0
        ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.review_count,
          bestRating: 5,
          worstRating: 1,
        }
        : undefined,

    ...(variants.length > 0 && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "NPR",
        lowPrice: lowestPrice,
        highPrice: highestPrice,
        offerCount: variants.length,
        availability:
          product.is_available
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: canonicalUrl,
      },
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Products",
        item: `${SITE_URL}/products`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category?.name,
        item: `${SITE_URL}/products/category/${product.category?.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <AppBreadcrumb
        items={[
          { label: "Products", href: "/products" },
          ...(product.category
            ? [
              {
                label: product.category.name,
                href: `/products/category/${product.category.slug}`,
              },
            ]
            : []),
          { label: product.title },
        ]}
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery images={images} />

        <div className="space-y-6">
          <ProductDetailsClient
            product={product}
            description={description}
          />
        </div>
      </div>
    </main>
  );
}