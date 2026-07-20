import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(100, "Maximum 100 characters"),

  organisation: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  gst_number: z.string(),
  email: z.email().or(z.literal("")),
  phone: z.string(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
