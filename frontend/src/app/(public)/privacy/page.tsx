import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/server/page";
import { renderTiptapContent } from "@/lib/server/tiptap-render";
import { PolicyContent } from "@/components/shared";
import { privacyData } from "@/data/policies";
import type { Page } from "@/features/pages/page-types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

async function fetchCmsPage(): Promise<Page | null> {
  try {
    const { page } = await getPageBySlug("privacy-policy");
    return page;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchCmsPage();
  if (!page) {
    return {
      title: privacyData.title,
      description: "Privacy Policy for Buda Ko Achar",
    };
  }
  return {
    title: page.seo_title || page.title,
    description: page.seo_description || page.short_description || "",
    alternates: {
      canonical: page.canonical_url || `${SITE_URL}/privacy`,
    },
  };
}

export default async function PrivacyPage() {
  const page = await fetchCmsPage();

  if (page?.content) {
    const { html, className } = renderTiptapContent(page.content);

    return (
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold text-dark-text">
            {page.title}
          </h1>
          {page.published_at && (
            <p className="mt-2 text-sm text-gray-500">
              Last updated:{" "}
              {new Date(page.published_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          {html && (
            <div
              className={`prose prose-gray mt-8 max-w-none text-gray-600 ${className}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </section>
    );
  }

  return (
    <PolicyContent
      title={privacyData.title}
      lastUpdated={privacyData.lastUpdated}
      sections={privacyData.sections}
    />
  );
}
