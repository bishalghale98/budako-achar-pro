import { z } from "zod";
import type { TiptapDoc } from "@/components/shared/tiptap";

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
  content: z.record(z.string(), z.unknown()).optional() as z.ZodType<TiptapDoc | undefined>,
  status: z.enum(["draft", "published"]),
  seo_title: z.string().max(255).optional().or(z.literal("")),
  seo_description: z.string().max(500).optional().or(z.literal("")),
  canonical_url: z.string().url().max(500).optional().or(z.literal("")),
});

export type PageFormValues = z.infer<typeof pageSchema>;
