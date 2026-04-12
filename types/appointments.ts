import { Prisma } from "@prisma/client";

// The full payload returned by GET /api/v1/appointments
export type AppointmentWithDetails = Prisma.appointmentsGetPayload<{
  include: {
    clients: {
      select: {
        id: true;
        first_name: true;
        last_name: true;
        phone: true;
        avatar_url: true;
      };
    };
    staff_profiles: {
      select: {
        id: true;
        color_hex: true;
        users: {
          select: {
            first_name: true;
            last_name: true;
            avatar_url: true;
          };
        };
      };
    };
    services: {
      select: {
        id: true;
        name: true;
        duration_mins: true;
        price: true;
      };
    };
  };
}>;

export interface AppointmentsApiResponse {
  data: AppointmentWithDetails[];
  meta: {
    count: number;
    limit: number;
    offset: number;
  };
}
