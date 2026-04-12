export * from "./appointments";
export * from "./staff";
export * from "./clients";
export * from "./invoices";

// Re-export common types from Prisma directly if needed globally
export type { 
  appointment_status, 
  user_role, 
  invoice_status, 
  payment_method_type,
  gender_type,
  product_type
} from "@prisma/client";
