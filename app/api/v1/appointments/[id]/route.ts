import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { AppointmentUpdateSchema } from "@/lib/validations/appointment.schema";
import { getCurrentTenantId } from "@/lib/auth/session";

/**
 * PATCH /api/v1/appointments/:id
 * 
 * Updates an appointment.
 * Handles rescheduling conflicts and duration recalculation.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const validated = AppointmentUpdateSchema.parse(body);
    const tenantId = await getCurrentTenantId();

    // 1. Verify existence and tenant ownership
    const existing = await prisma.appointments.findUnique({
      where: { id, tenant_id: tenantId }
    });

    if (!existing) {
      return Response.json({ error: "Appointment not found" }, { status: 404 });
    }

    // 2. Schedule Change Logic
    const isTimeChanged = validated.startsAt || validated.endsAt;
    const isStaffChanged = validated.staffId && validated.staffId !== existing.staff_id;
    const isServiceChanged = validated.serviceId && validated.serviceId !== existing.service_id;

    let startsAt = validated.startsAt || existing.starts_at;
    let endsAt = validated.endsAt || existing.ends_at;
    let staffId = validated.staffId || existing.staff_id;

    // Recalculate duration if service or start time changed but endsAt wasn't explicitly provided
    if ((isServiceChanged || (validated.startsAt && !validated.endsAt)) && startsAt) {
      const serviceId = validated.serviceId || existing.service_id;
      const service = await prisma.services.findUnique({
        where: { id: serviceId as string },
        select: { duration_mins: true }
      });
      
      if (service) {
        const duration = service.duration_mins || 60;
        endsAt = new Date(new Date(startsAt).getTime() + duration * 60000);
      }
    }

    // 3. Conflict Detection
    if ((isTimeChanged || isStaffChanged) && startsAt && endsAt) {
      const conflict = await prisma.appointments.findFirst({
        where: {
          id: { not: id }, // Exclude self
          tenant_id: tenantId,
          staff_id: staffId,
          status: { notIn: ['cancelled'] },
          AND: [
            { starts_at: { lt: endsAt } },
            { ends_at: { gt: startsAt } }
          ]
        }
      });

      if (conflict) {
        return Response.json({ 
          error: "Scheduling Conflict", 
          details: "This staff member has a conflict at the new time." 
        }, { status: 409 });
      }
    }

    // 4. Update
    const updated = await prisma.appointments.update({
      where: { id },
      data: {
        branch_id: validated.branchId,
        client_id: validated.clientId,
        staff_id: validated.staffId,
        service_id: validated.serviceId,
        starts_at: validated.startsAt,
        ends_at: endsAt,
        status: validated.status,
        notes: validated.notes,
        updated_at: new Date(),
      },
      include: {
        clients: true,
        services: true,
        staff_profiles: {
          include: { users: true }
        }
      }
    });

    return Response.json({ data: updated });
  } catch (error: any) {
    console.error(`[PATCH /api/v1/appointments/${id}]`, error);
    if (error.name === "ZodError") {
      return Response.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return Response.json({ error: error.message || "Failed to update appointment" }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/appointments/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const tenantId = await getCurrentTenantId();

    // Verify existence and tenant ownership
    const existing = await prisma.appointments.findUnique({
      where: { id, tenant_id: tenantId }
    });

    if (!existing) {
      return Response.json({ error: "Appointment not found" }, { status: 404 });
    }

    await prisma.appointments.delete({
      where: { id }
    });

    return Response.json({ success: true });
  } catch (error: any) {
    console.error(`[DELETE /api/v1/appointments/${id}]`, error);
    return Response.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}
