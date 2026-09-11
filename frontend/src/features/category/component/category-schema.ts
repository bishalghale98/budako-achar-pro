import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(255, "Name too long"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
