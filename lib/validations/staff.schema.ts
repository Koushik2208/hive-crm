import { z } from "zod";

const AvailabilityItemSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  isAvailable: z.boolean(),
});

export const StaffCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["super_admin", "tenant_owner", "branch_manager", "receptionist", "staff", "client"]).default("staff"),
  branchId: z.string().min(1, "Branch is required"),
  bio: z.string().optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  colorHex: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color").optional(),
  isActive: z.boolean().default(true),
  availability: z.array(AvailabilityItemSchema).default([]),
});

export const StaffUpdateSchema = StaffCreateSchema.partial();

/** Use this as the form's generic type — it represents what the form *inputs* look like */
export type StaffFormValues = z.input<typeof StaffCreateSchema>;

/** Use this for API payloads — it represents the validated *output* after defaults are applied */
export type StaffCreateInput = z.output<typeof StaffCreateSchema>;
export type StaffUpdateInput = z.input<typeof StaffUpdateSchema>;

/** Shape of a single availability row — used by AvailabilityGrid */
export type AvailabilityItem = z.infer<typeof AvailabilityItemSchema>;
