import { z } from "zod";

// --- URL Safety ---

const SAFE_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];

function isSafeUrl(url: string): boolean {
  const lower = url.toLowerCase().trim();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return false;
  }
  if (url.startsWith("/") || url.startsWith("#")) return true;
  return SAFE_PROTOCOLS.some((p) => lower.startsWith(p));
}

// --- Marks ---

const markSchema = z.object({
  type: z.enum(["bold", "italic", "strike", "underline", "code", "link"]),
  attrs: z
    .object({
      href: z.string().optional(),
      target: z.literal("_blank").optional(),
    })
    .optional(),
});

// --- Tiptap Document Schema ---
// Structural validation is enforced by Laravel's ValidTiptapDocument rule.
// Zod validates node/mark types and attribute shapes at the form level.

const tiptapNodeSchema: z.ZodType<unknown> = z.lazy(() =>
  z.object({
    type: z.string(),
    text: z.string().optional(),
    marks: z.array(markSchema).optional(),
    attrs: z
      .object({
        level: z.number().optional(),
        textAlign: z.enum(["left", "center", "right"]).optional(),
        language: z.string().optional(),
        src: z.string().optional(),
        alt: z.string().optional(),
        title: z.string().optional(),
        href: z.string().optional(),
        target: z.literal("_blank").optional(),
      })
      .optional(),
    content: z.array(tiptapNodeSchema).optional(),
  })
);

export const tiptapDocSchema = z.object({
  type: z.literal("doc"),
  content: z.array(tiptapNodeSchema).min(1, "Document must contain at least one block"),
});

export type TiptapDoc = z.infer<typeof tiptapDocSchema>;

// --- Page Form Schema ---

export const pageSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens"
    ),
  short_description: z.string().max(500).optional(),
  content: tiptapDocSchema.nullable().optional(),
  status: z.enum(["draft", "published"]),
  seo_title: z.string().max(255).optional().or(z.literal("")),
  seo_description: z.string().max(500).optional().or(z.literal("")),
  canonical_url: z.string().url().max(500).optional().or(z.literal("")),
});

export type PageFormValues = z.infer<typeof pageSchema>;
