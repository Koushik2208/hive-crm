import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { getCurrentTenantId } from "@/lib/auth/session";

/**
 * GET /api/v1/branches
 * 
 * Returns a list of branches for the current tenant.
 * Used primarily for dropdown selections in forms.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const tenantId = await getCurrentTenantId();

    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 10), 1), 100);
    const skip = (page - 1) * limit;

    const whereClause = {
      tenant_id: tenantId,
      is_active: true,
    };

    const [branches, total] = await Promise.all([
      prisma.branches.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          address: true,
        },
        orderBy: { name: "asc" },
        take: limit,
        skip: skip,
      }),
      prisma.branches.count({ where: whereClause })
    ]);

    return Response.json({
      data: branches,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/branches]", error);
    return Response.json({ error: "Failed to fetch branches" }, { status: 500 });
  }
}
