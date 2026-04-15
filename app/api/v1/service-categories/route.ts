import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { getCurrentTenantId } from "@/lib/auth/session";
import { ServiceCategoryCreateSchema } from "@/lib/validations/service.schema";

/**
 * GET /api/v1/service-categories
 * 
 * Returns all service categories for the current tenant.
 */
export async function GET() {
  try {
    const tenantId = await getCurrentTenantId();

    const categories = await prisma.service_categories.findMany({
      where: { tenant_id: tenantId },
      orderBy: { sort_order: "asc" },
    });

    return Response.json({ data: categories });
  } catch (error) {
    console.error("[GET /api/v1/service-categories]", error);
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

/**
 * POST /api/v1/service-categories
 * 
 * Creates a new service category.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ServiceCategoryCreateSchema.parse(body);
    const tenantId = await getCurrentTenantId();

    const category = await prisma.service_categories.create({
      data: {
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        name: validated.name,
        color_hex: validated.color_hex,
        sort_order: validated.sort_order,
      },
    });

    return Response.json({ data: category }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/v1/service-categories]", error);
    if (error.name === "ZodError") {
      return Response.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Failed to create category" }, { status: 500 });
  }
}
