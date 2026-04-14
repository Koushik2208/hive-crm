import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { getCurrentTenantId } from "@/lib/auth/session";
import { ClientUpdateSchema } from "@/lib/validations/client.schema";

/**
 * PATCH /api/v1/clients/[id]
 * 
 * Updates an existing client. Checks for duplicate email/phone if changed.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validated = ClientUpdateSchema.parse(body);
    const tenantId = await getCurrentTenantId();

    // 1. Check if client exists and belongs to tenant
    const client = await prisma.clients.findFirst({
      where: { id, tenant_id: tenantId },
    });

    if (!client) {
      return Response.json({ error: "Client not found" }, { status: 404 });
    }

    // 2. Check for Duplicates if email/phone is being updated
    if (validated.email || validated.phone) {
      const existing = await prisma.clients.findFirst({
        where: {
          tenant_id: tenantId,
          id: { not: id }, // Exclude current client
          OR: [
            ...(validated.email ? [{ email: validated.email }] : []),
            ...(validated.phone ? [{ phone: validated.phone }] : []),
          ],
        },
      });

      if (existing) {
        const field = existing.email === validated.email ? "email" : "phone";
        return Response.json(
          { error: `Another client with this ${field} already exists.` },
          { status: 409 }
        );
      }
    }

    // 3. Perform update
    const updatedClient = await prisma.clients.update({
      where: { id },
      data: {
        first_name: validated.firstName,
        last_name: validated.lastName,
        email: validated.email,
        phone: validated.phone,
        dob: validated.dob ? new Date(validated.dob) : undefined,
        gender: validated.gender as any,
        notes: validated.notes,
        tags: validated.tags,
        avatar_url: validated.avatarUrl,
        medical_flags: validated.medicalFlags,
        beauty_notes: validated.beautyNotes,
      },
    });

    return Response.json({ data: updatedClient });
  } catch (error: any) {
    console.error(`[PATCH /api/v1/clients/${params.id}]`, error);
    if (error.name === "ZodError") {
      return Response.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return Response.json({ error: "Failed to update client" }, { status: 500 });
  }
}

/**
 * GET /api/v1/clients/[id]
 * 
 * Fetches a single client detail.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const tenantId = await getCurrentTenantId();

    const client = await prisma.clients.findFirst({
      where: { id, tenant_id: tenantId },
    });

    if (!client) {
      return Response.json({ error: "Client not found" }, { status: 404 });
    }

    return Response.json({ data: client });
  } catch (error) {
    console.error(`[GET /api/v1/clients/${params.id}]`, error);
    return Response.json({ error: "Failed to fetch client" }, { status: 500 });
  }
}
