import { z } from "zod";

export const companySchema = z.object({
  company_name: z.string().min(1, "Required"),
  gst_number: z.string(),
  pan_number: z.string(),
  msme_number: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.email().or(z.literal("")),
  website: z.string(),
  bank_name: z.string(),
  account_number: z.string(),
  ifsc_code: z.string(),
  branch: z.string(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;
