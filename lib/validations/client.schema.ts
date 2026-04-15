import { z } from "zod";

export const ClientCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional().nullable(),
  phone: z.string().optional().nullable(),
  dob: z.string().optional().nullable(), // Store as string for easy parsing or use z.date()
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  avatarUrl: z.string().url().optional().nullable(),
  medicalFlags: z.object({
    allergies: z.array(z.string()).default([]),
    conditions: z.array(z.string()).default([]),
    medications: z.array(z.string()).default([]),
  }).optional().default({
    allergies: [],
    conditions: [],
    medications: [],
  }),
  beautyNotes: z.object({
    hair_colour: z.string().optional().default(""),
    last_colour_date: z.string().optional().default(""),
    preferred_stylist: z.string().optional().default(""),
  }).optional().default({
    hair_colour: "",
    last_colour_date: "",
    preferred_stylist: "",
  }),
});

export const ClientUpdateSchema = ClientCreateSchema.partial();

export type ClientCreateInput = z.infer<typeof ClientCreateSchema>;
export type ClientUpdateInput = z.infer<typeof ClientUpdateSchema>;

// Input types (pre-transform) — required for useForm<> with zodResolver when using .default()
export type ClientCreateFormInput = z.input<typeof ClientCreateSchema>;
