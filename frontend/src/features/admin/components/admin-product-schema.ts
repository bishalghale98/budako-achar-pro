import { z } from "zod";

export const variantSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  weight: z.number().min(0, "Weight must be at least 0"),
  unit: z.enum(["g", "kg"]),
  price: z.number().min(0, "Price must be at least 0"),
  compare_price: z.number().min(0).nullable().optional(),
  stock: z.number().int().min(0),
  sku: z.string().max(255).optional(),
  status: z.enum(["active", "inactive"]),
});

export const productSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  category_id: z.string().min(1, "Category is required"),
  slug: z.string().min(1, "Slug is required").max(255),
  short_description: z.string().max(500).optional(),
  description: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(["active", "inactive"]),
  variants: z
    .array(variantSchema)
    .min(1, "At least one variant is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type VariantFormValues = z.infer<typeof variantSchema>;
