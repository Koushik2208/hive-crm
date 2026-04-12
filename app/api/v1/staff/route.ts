import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { getCurrentTenantId } from "@/lib/auth/session";
import { StaffCreateSchema } from "@/lib/validations/staff.schema";

/**
 * GET /api/v1/staff
 *
 * Returns a list of staff profiles with their linked user details
 * and weekly availability schedule.
 *
 * Query parameters (all optional):
 *   branch_id        – UUID. Filter to a specific branch.
 *   is_active        – "true" | "false". Filter by user active status.
 *   include_schedule – "true". Include staff_availability rows in response.
 *   limit            – Max rows to return (default 100, max 200).
 *   offset           – Rows to skip for pagination (default 0).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const branchId = searchParams.get("branch_id");
    const isActiveParam = searchParams.get("is_active");
    const roleParam = searchParams.get("role");
    const includeSchedule = searchParams.get("include_schedule") === "true";
    const limit = Math.min(Number(searchParams.get("limit") ?? 100), 200);
    const offset = Number(searchParams.get("offset") ?? 0);

    // Resolve is_active filter — only apply when explicitly provided
    const isActive =
      isActiveParam === "true"
        ? true
        : isActiveParam === "false"
          ? false
          : undefined;

    const tenantId = await getCurrentTenantId();

    const staffList = await prisma.staff_profiles.findMany({
      where: {
        tenant_id: tenantId,
        ...(branchId && { branch_id: branchId }),
        // Filter via the related users row
        ...((isActive !== undefined || roleParam) && {
          users: { 
            ...(isActive !== undefined && { is_active: isActive }),
            ...(roleParam && { role: roleParam as any }),
          },
        }),
      },
      select: {
        id: true,
        bio: true,
        color_hex: true,
        commission_rate: true,
        branch_id: true,
        created_at: true,
        // Flatten the user details alongside the profile
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            role: true,
            avatar_url: true,
            is_active: true,
          },
        },
        // Only include the weekly schedule when explicitly requested
        // (avoids inflating the response for simple staff-picker dropdowns)
        ...(includeSchedule && {
          staff_availability: {
            select: {
              id: true,
              day_of_week: true,
              start_time: true,
              end_time: true,
              is_available: true,
            },
            orderBy: { day_of_week: "asc" },
          },
        }),
      },
      orderBy: {
        // Sort alphabetically by the linked user's first name
        users: { first_name: "asc" },
      },
      take: limit,
      skip: offset,
    });

    return Response.json({
      data: staffList,
      meta: {
        count: staffList.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/staff]", error);
    return Response.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/staff
 *
 * Creates a new staff member.
 * This is a transactional operation that creates/updates a User
 * and creates a linked Staff Profile.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = StaffCreateSchema.parse(body);
    const tenantId = await getCurrentTenantId();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Ensure user exists or create them
      // We use upsert to handle cases where a client might be becoming a staff member
      const user = await tx.users.upsert({
        where: { email: validated.email },
        update: {
          first_name: validated.firstName,
          last_name: validated.lastName,
          phone: validated.phone,
          role: validated.role as any,
          is_active: validated.isActive,
          tenant_id: tenantId,
          branch_id: validated.branchId, // Sync branch
        },
        create: {
          id: crypto.randomUUID(),
          email: validated.email,
          first_name: validated.firstName,
          last_name: validated.lastName,
          phone: validated.phone,
          role: validated.role as any,
          is_active: validated.isActive,
          tenant_id: tenantId,
          branch_id: validated.branchId, // Sync branch
        },
      });

      // 2. Create the staff profile
      const staffProfile = await tx.staff_profiles.create({
        data: {
          id: crypto.randomUUID(),
          user_id: user.id,
          tenant_id: tenantId,
          branch_id: validated.branchId,
          bio: validated.bio,
          commission_rate: validated.commissionRate,
          color_hex: validated.colorHex,
        },
      });

      // 3. Create availability records if provided
      if (validated.availability) {
        await tx.staff_availability.createMany({
          data: validated.availability.map((avail) => {
            const startTime = new Date();
            const [sH, sM] = avail.startTime.split(':').map(Number);
            startTime.setHours(sH, sM, 0, 0);

            const endTime = new Date();
            const [eH, eM] = avail.endTime.split(':').map(Number);
            endTime.setHours(eH, eM, 0, 0);

            return {
              id: crypto.randomUUID(),
              staff_id: staffProfile.id,
              tenant_id: tenantId,
              branch_id: validated.branchId,
              day_of_week: avail.dayOfWeek,
              start_time: startTime,
              end_time: endTime,
              is_available: avail.isAvailable,
            };
          }),
        });
      }

      return await tx.staff_profiles.findUnique({
        where: { id: staffProfile.id },
        include: { users: true, staff_availability: true },
      });
    });


    return Response.json({ data: result }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/v1/staff]", error);
    if (error.name === "ZodError") {
      return Response.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Failed to create staff" }, { status: 500 });
  }
}
