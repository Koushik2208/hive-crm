import { Prisma, invoices, invoice_items } from "@prisma/client";

// Basic types using the generated Prisma types
export type Invoice = invoices;
export type InvoiceItem = invoice_items;

// A standard invoice response that includes its line items and basic client info
export type InvoiceWithItems = Prisma.invoicesGetPayload<{
  include: {
    invoice_items: true;
    clients: {
      select: {
        id: true;
        first_name: true;
        last_name: true;
        email: true;
      };
    };
  };
}>;

export interface InvoicesApiResponse {
  data: InvoiceWithItems[];
  meta: {
    count: number;
    limit: number;
    offset: number;
  };
}
