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
    const tenantId = await getCurrentTenantId();

    const branches = await prisma.branches.findMany({
      where: {
        tenant_id: tenantId,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        address: true,
      },
      orderBy: { name: "asc" },
    });

    return Response.json({ data: branches });
  } catch (error) {
    console.error("[GET /api/v1/branches]", error);
    return Response.json({ error: "Failed to fetch branches" }, { status: 500 });
  }
}
