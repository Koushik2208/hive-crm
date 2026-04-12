import { Prisma, clients } from "@prisma/client";

// Basic type using the generated Prisma type
export type Client = clients;

// You can expand this later when you write the GET /api/v1/clients route.
// For example, if you include appointments or tags:
// export type ClientWithRelations = Prisma.clientsGetPayload<{ ... }>

export interface ClientsApiResponse {
  data: Client[];
  meta: {
    count: number;
    limit: number;
    offset: number;
  };
}
