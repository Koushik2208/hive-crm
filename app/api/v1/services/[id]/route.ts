import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { getCurrentTenantId } from "@/lib/auth/session";
import { ServiceUpdateSchema } from "@/lib/validations/service.schema";

/**
 * GET /api/v1/services/[id]
 * 
 * Returns detailed information for a single service.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenantId = await getCurrentTenantId();

    const service = await prisma.services.findFirst({
      where: {
        id,
        tenant_id: tenantId,
      },
      include: {
        service_categories: true,
      },
    });

    if (!service) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    return Response.json({ data: service });
  } catch (error) {
    console.error("[GET /api/v1/services/[id]]", error);
    return Response.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}

/**
 * PATCH /api/v1/services/[id]
 * 
 * Updates a service's information.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = ServiceUpdateSchema.parse(body);
    const tenantId = await getCurrentTenantId();

    // Verify ownership and existence
    const existing = await prisma.services.findFirst({
      where: { id, tenant_id: tenantId },
    });

    if (!existing) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    const updated = await prisma.services.update({
      where: { id },
      data: {
        name: validated.name,
        description: validated.description,
        duration_mins: validated.duration_mins,
        buffer_mins: validated.buffer_mins,
        price: validated.price,
        is_multi_staff: validated.is_multi_staff,
        is_active: validated.is_active,
        category_id: validated.category_id,
        branch_id: validated.branch_id,
      },
      include: {
        service_categories: true,
      },
    });

    return Response.json({ data: updated });
  } catch (error: any) {
    console.error("[PATCH /api/v1/services/[id]]", error);
    if (error.name === "ZodError") {
      return Response.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Failed to update service" }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/services/[id]
 * 
 * Deactivates a service (soft delete).
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenantId = await getCurrentTenantId();

    // Verify ownership and existence
    const existing = await prisma.services.findFirst({
      where: { id, tenant_id: tenantId },
    });

    if (!existing) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    // Perform soft delete by deactivating
    await prisma.services.update({
      where: { id },
      data: { is_active: false },
    });

    return Response.json({ message: "Service deactivated successfully" });
  } catch (error) {
    console.error("[DELETE /api/v1/services/[id]]", error);
    return Response.json({ error: "Failed to deactivate service" }, { status: 500 });
  }
}
