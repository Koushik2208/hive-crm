import { z } from "zod";

// --- Service Category Schemas ---

export const ServiceCategoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional().nullable(),
  sort_order: z.number().int().optional().default(0),
});

export type ServiceCategoryCreateInput = z.infer<typeof ServiceCategoryCreateSchema>;

// --- Service Schemas ---

export const ServiceCreateSchema = z.object({
  name: z.string().min(1, "Service name is required").max(255),
  description: z.string().optional().nullable(),
  category_id: z.string().uuid("Invalid category ID").optional().nullable(),
  branch_id: z.string().uuid("Invalid branch ID").optional().nullable(),
  duration_mins: z.number().int().positive("Duration must be positive"),
  buffer_mins: z.number().int().nonnegative().default(0),
  price: z.number().positive("Price must be positive"),
  is_multi_staff: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const ServiceUpdateSchema = ServiceCreateSchema.partial();

// Inferred Types (Post-transform)
export type ServiceCreateOutput = z.infer<typeof ServiceCreateSchema>;
export type ServiceUpdateOutput = z.infer<typeof ServiceUpdateSchema>;

// Input Types (Pre-transform) - used for useForm
export type ServiceCreateInput = z.input<typeof ServiceCreateSchema>;
export type ServiceUpdateInput = z.input<typeof ServiceUpdateSchema>;
