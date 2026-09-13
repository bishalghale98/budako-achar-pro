import { z } from "zod";

export const checkoutSchema = z
  .object({
    customer_name: z.string().min(1, "Full name is required"),
    customer_phone: z.string().min(1, "Phone number is required"),
    customer_email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    address_id: z.string().optional(),
    address_line: z.string().optional(),
    area: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    delivery_notes: z.string().optional(),
    payment_method: z.enum(["cod", "digital", "bank"]),
    payment_proof: z.custom<File | null>().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.payment_method !== "cod" && !data.payment_proof) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payment screenshot is required for this method",
        path: ["payment_proof"],
      });
    }

    if (!data.address_id) {
      if (!data.address_line) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Street address is required",
          path: ["address_line"],
        });
      }
      if (!data.city) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "City is required",
          path: ["city"],
        });
      }
      if (!data.province) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Province is required",
          path: ["province"],
        });
      }
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
