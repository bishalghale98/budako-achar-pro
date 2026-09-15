import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/server/page";
import { renderTiptapContent } from "@/lib/server/tiptap-render";
import { AppBreadcrumb } from "@/components/shared";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPage(slug: string) {
  try {
    const data = await getPageBySlug(slug);
    return data.page;
  } catch {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);

  const description =
    page.seo_description || page.short_description || "";

  const canonicalUrl =
    page.canonical_url || `${SITE_URL}/pages/${page.slug}`;

  return {
    title: page.seo_title || page.title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: page.status === "published",
      follow: true,
    },
  };
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);

  const { html, className } = renderTiptapContent(page.content);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <AppBreadcrumb
        items={[
          { label: page.title },
        ]}
      />

      <article className="mt-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">
          {page.title}
        </h1>

        {html && (
          <div
            className={className}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </article>
    </main>
  );
}
