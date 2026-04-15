import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { getCurrentTenantId } from "@/lib/auth/session";
import { ServiceCreateSchema } from "@/lib/validations/service.schema";

/**
 * GET /api/v1/services
 * 
 * Returns a paginated list of services for the current tenant.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const tenantId = await getCurrentTenantId();

    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 10), 1), 100);
    const skip = (page - 1) * limit;

    // --- Filtering Logic ---
    const search = searchParams.get("search");
    const categoryId = searchParams.get("category_id");
    const branchId = searchParams.get("branch_id");
    const isActiveParam = searchParams.get("is_active");
    
    // Resolve is_active boolean filter
    const isActive = isActiveParam === "true" ? true : isActiveParam === "false" ? false : undefined;

    const whereClause: any = {
      tenant_id: tenantId,
      ...(isActive !== undefined && { is_active: isActive }),
      ...(categoryId && { category_id: categoryId }),
      ...(branchId && { branch_id: branchId }),
      ...(search && {
        name: { contains: search, mode: 'insensitive' }
      })
    };

    const [services, total] = await Promise.all([
      prisma.services.findMany({
        where: whereClause,
        include: {
          service_categories: {
            select: {
              id: true,
              name: true,
              color_hex: true,
            }
          }
        },
        orderBy: { name: "asc" },
        take: limit,
        skip: skip,
      }),
      prisma.services.count({
        where: whereClause
      })
    ]);

    return Response.json({
      data: services,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/services]", error);
    return Response.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

/**
 * POST /api/v1/services
 * 
 * Creates a new service.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ServiceCreateSchema.parse(body);
    const tenantId = await getCurrentTenantId();

    const service = await prisma.services.create({
      data: {
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        name: validated.name,
        description: validated.description,
        duration_mins: validated.duration_mins,
        buffer_mins: validated.buffer_mins,
        price: validated.price,
        is_multi_staff: validated.is_multi_staff,
        is_active: validated.is_active,
        category_id: validated.categoryId,
        branch_id: validated.branchId,
      },
      include: {
        service_categories: true
      }
    });

    return Response.json({ data: service }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/v1/services]", error);
    if (error.name === "ZodError") {
      return Response.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Failed to create service" }, { status: 500 });
  }
}
