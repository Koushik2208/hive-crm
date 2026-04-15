import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { getCurrentTenantId } from "@/lib/auth/session";

/**
 * PATCH /api/v1/service-categories/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const tenantId = await getCurrentTenantId();

    const category = await prisma.service_categories.update({
      where: { 
        id,
        tenant_id: tenantId 
      },
      data: {
        name: body.name,
        color_hex: body.color_hex,
        sort_order: body.sort_order,
      },
    });

    return Response.json({ data: category });
  } catch (error: any) {
    console.error(`[PATCH /api/v1/service-categories]`, error);
    return Response.json({ error: "Failed to update category" }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/service-categories/[id]
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenantId = await getCurrentTenantId();

    await prisma.service_categories.delete({
      where: { 
        id,
        tenant_id: tenantId 
      },
    });

    return Response.json({ success: true });
  } catch (error: any) {
    console.error(`[DELETE /api/v1/service-categories]`, error);
    return Response.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
