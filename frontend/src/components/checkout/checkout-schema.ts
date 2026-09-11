import { z } from "zod";

export const checkoutSchema = z
  .object({
    customer_name: z.string().min(1, "Full name is required"),
    customer_phone: z.string().min(1, "Phone number is required"),
    customer_email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    address_line: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    province: z.string().min(1, "Province is required"),
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
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
