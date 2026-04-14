import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { getCurrentTenantId } from "@/lib/auth/session";
import { ClientCreateSchema } from "@/lib/validations/client.schema";

/**
 * GET /api/v1/clients
 * 
 * Returns a paginated list of clients for the current tenant.
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
    const tag = searchParams.get("tag");
    const status = searchParams.get("status");

    const whereClause: any = {
      tenant_id: tenantId,
      ...(status === "Active" ? { is_active: true } : status === "Inactive" ? { is_active: false } : {}),
      ...(tag && tag !== "All Tags" && { tags: { has: tag } }),
      ...(search && {
        OR: [
          { first_name: { contains: search, mode: 'insensitive' } },
          { last_name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ]
      })
    };

    const [clients, total] = await Promise.all([
      prisma.clients.findMany({
        where: whereClause,
        orderBy: { first_name: "asc" },
        take: limit,
        skip: skip,
      }),
      prisma.clients.count({
        where: whereClause
      })
    ]);

    return Response.json({
      data: clients,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/clients]", error);
    return Response.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

/**
 * POST /api/v1/clients
 * 
 * Creates a new client. Checks for duplicate email/phone within the tenant.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ClientCreateSchema.parse(body);
    const tenantId = await getCurrentTenantId();

    // --- Check for Duplicates ---
    if (validated.email || validated.phone) {
      const existing = await prisma.clients.findFirst({
        where: {
          tenant_id: tenantId,
          OR: [
            ...(validated.email ? [{ email: validated.email }] : []),
            ...(validated.phone ? [{ phone: validated.phone }] : []),
          ],
        },
      });

      if (existing) {
        const field = existing.email === validated.email ? "email" : "phone";
        return Response.json(
          { error: `A client with this ${field} already exists.` },
          { status: 409 }
        );
      }
    }

    // --- Create Client ---
    const client = await prisma.clients.create({
      data: {
        id: crypto.randomUUID(),
        tenant_id: tenantId,
        first_name: validated.firstName,
        last_name: validated.lastName,
        email: validated.email,
        phone: validated.phone,
        dob: validated.dob ? new Date(validated.dob) : null,
        gender: validated.gender as any,
        notes: validated.notes,
        tags: validated.tags,
        avatar_url: validated.avatarUrl,
        medical_flags: validated.medicalFlags,
        beauty_notes: validated.beautyNotes,
        is_active: true,
        created_at: new Date(),
      },
    });

    return Response.json({ data: client }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/v1/clients]", error);
    if (error.name === "ZodError") {
      return Response.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Failed to create client" }, { status: 500 });
  }
}
