import { Prisma } from "@prisma/client";

// The full payload returned by GET /api/v1/staff
export type StaffProfileWithDetails = Prisma.staff_profilesGetPayload<{
  select: {
    id: true;
    bio: true;
    color_hex: true;
    commission_rate: true;
    branch_id: true;
    created_at: true;
    users: {
      select: {
        id: true;
        first_name: true;
        last_name: true;
        email: true;
        phone: true;
        role: true;
        avatar_url: true;
        is_active: true;
      };
    };
    staff_availability: {
      select: {
        id: true;
        day_of_week: true;
        start_time: true;
        end_time: true;
        is_available: true;
      };
      orderBy: { day_of_week: "asc" };
    };
  };
}>;

export type StaffMember<T extends boolean = true> = T extends true ? StaffProfileWithDetails : StaffProfileBasic;


// A variant without the schedule (when ?include_schedule is not true)
export type StaffProfileBasic = Omit<StaffProfileWithDetails, "staff_availability">;

export interface StaffApiResponse<T extends boolean = false> {
  data: T extends true ? StaffProfileWithDetails[] : StaffProfileBasic[];
  meta: {
    count: number;
    limit: number;
    offset: number;
  };
}
