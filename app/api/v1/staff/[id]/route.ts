import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { getCurrentTenantId } from "@/lib/auth/session";
import { StaffUpdateSchema } from "@/lib/validations/staff.schema";

/**
 * GET /api/v1/staff/[id]
 * 
 * Returns a single staff profile with full details.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenantId = await getCurrentTenantId();

    const staff = await prisma.staff_profiles.findFirst({
      where: {
        id,
        tenant_id: tenantId,
      },
      include: {
        users: true,
        staff_availability: true,
      },
    });

    if (!staff) {
      return Response.json({ error: "Staff not found" }, { status: 404 });
    }

    return Response.json({ data: staff });
  } catch (error) {
    console.error("[GET /api/v1/staff/[id]]", error);
    return Response.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

/**
 * PATCH /api/v1/staff/[id]
 * 
 * Updates an existing staff member.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = StaffUpdateSchema.parse(body);
    const tenantId = await getCurrentTenantId();

    // Verify ownership/existence first
    const existing = await prisma.staff_profiles.findFirst({
      where: { id, tenant_id: tenantId },
      select: { user_id: true, branch_id: true }
    });

    if (!existing) {
      return Response.json({ error: "Staff not found" }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update User details
      if (existing.user_id) {
        await tx.users.update({
          where: { id: existing.user_id },
          data: {
            first_name: validated.firstName,
            last_name: validated.lastName,
            email: validated.email,
            phone: validated.phone,
            role: validated.role as any,
            is_active: validated.isActive,
            branch_id: validated.branchId, // Sync branch
          },
        });
      }

      // 2. Update Staff Profile details
      const updatedProfile = await tx.staff_profiles.update({
        where: { id },
        data: {
          bio: validated.bio,
          commission_rate: validated.commissionRate,
          color_hex: validated.colorHex,
          branch_id: validated.branchId,
        },
      });

      // 3. Update availability if provided
      if (validated.availability) {
        // Delete existing availability for this staff member
        await tx.staff_availability.deleteMany({
          where: { staff_id: id },
        });

        // re-create new availability records
        await tx.staff_availability.createMany({
          data: validated.availability.map((avail) => {
            const startTime = new Date();
            const [sH, sM] = (avail.startTime || "09:00").split(':').map(Number);
            startTime.setUTCHours(isNaN(sH) ? 9 : sH, isNaN(sM) ? 0 : sM, 0, 0);

            const endTime = new Date();
            const [eH, eM] = (avail.endTime || "18:00").split(':').map(Number);
            endTime.setUTCHours(isNaN(eH) ? 18 : eH, isNaN(eM) ? 0 : eM, 0, 0);

            return {
              id: crypto.randomUUID(),
              staff_id: id,
              tenant_id: tenantId,
              branch_id: validated.branchId || existing.branch_id,
              day_of_week: avail.dayOfWeek,
              start_time: startTime,
              end_time: endTime,
              is_available: avail.isAvailable,
            };
          }),
        });
      }

      return await tx.staff_profiles.findUnique({
        where: { id },
        include: { users: true, staff_availability: true },
      });
    });


    return Response.json({ data: result });
  } catch (error: any) {
    console.error("[PATCH /api/v1/staff/[id]]", error);
    if (error.name === "ZodError") {
      return Response.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    // Return detailed error message for easier debugging
    return Response.json({ error: error.message || "Failed to update staff" }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/staff/[id]
 * 
 * Soft-deletes a staff member by deactivating their user account.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenantId = await getCurrentTenantId();

    const staff = await prisma.staff_profiles.findFirst({
      where: { id, tenant_id: tenantId },
      select: { user_id: true }
    });

    if (!staff || !staff.user_id) {
      return Response.json({ error: "Staff not found" }, { status: 404 });
    }

    await prisma.users.update({
      where: { id: staff.user_id },
      data: { is_active: false },
    });

    return Response.json({ message: "Staff member deactivated successfully" });
  } catch (error) {
    console.error("[DELETE /api/v1/staff/[id]]", error);
    return Response.json({ error: "Failed to delete staff" }, { status: 500 });
  }
}
