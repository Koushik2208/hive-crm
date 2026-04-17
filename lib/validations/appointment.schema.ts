import { z } from "zod";

// Match the Prisma enum
export const AppointmentStatusSchema = z.enum([
  'booked',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
]);

export const AppointmentCreateSchema = z.object({
  branchId: z.string().min(1, "Branch is required").optional().nullable(),
  clientId: z.string().min(1, "Client is required"),
  staffId: z.string().min(1, "Staff is required"),
  serviceId: z.string().min(1, "Service is required"),
  // Use coerce to automatically turn ISO strings into Date objects
  startsAt: z.coerce.date(),
  // EndsAt is optional in the form; the API can calculate it if missing
  endsAt: z.coerce.date().optional().nullable(),
  status: AppointmentStatusSchema.default('booked'),
  notes: z.string().max(1000).optional().nullable(),
});

export const AppointmentUpdateSchema = AppointmentCreateSchema.partial();

// --- Standard Type Inferences ---

// Inferred Types (Post-transformation/defaults)
// Use these for API payloads and database operations
export type AppointmentCreateOutput = z.infer<typeof AppointmentCreateSchema>;
export type AppointmentUpdateOutput = z.infer<typeof AppointmentUpdateSchema>;

// Input Types (Pre-transformation)
// Use these as the generic for useForm<AppointmentFormValues>()
export type AppointmentFormValues = z.input<typeof AppointmentCreateSchema>;
export type AppointmentUpdateFormValues = z.input<typeof AppointmentUpdateSchema>;

// Aliases for general use
export type AppointmentCreateInput = AppointmentFormValues;
export type AppointmentUpdateInput = AppointmentUpdateFormValues;
