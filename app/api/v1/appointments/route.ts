import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

/**
 * GET /api/v1/appointments
 *
 * Query parameters (all optional):
 *   date        – ISO date string (YYYY-MM-DD). Returns appointments that
 *                 start on this calendar day (server local-time). Takes
 *                 precedence over date_from / date_to.
 *   date_from   – ISO datetime. Lower bound for starts_at (inclusive).
 *   date_to     – ISO datetime. Upper bound for starts_at (inclusive).
 *   branch_id   – UUID. Filter to a single branch.
 *   staff_id    – UUID. Filter to a single staff member.
 *   status      – One of: booked | confirmed | in_progress | completed |
 *                 cancelled | no_show
 *   limit       – Max rows to return (default 200, max 500).
 *   offset      – Rows to skip for pagination (default 0).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // --- Parse query params ---
    const date = searchParams.get("date");
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");
    const branchId = searchParams.get("branch_id");
    const staffId = searchParams.get("staff_id");
    const status = searchParams.get("status");
    const limit = Math.min(Number(searchParams.get("limit") ?? 200), 500);
    const offset = Number(searchParams.get("offset") ?? 0);

    // --- Build starts_at filter ---
    let startsAtFilter: { gte?: Date; lte?: Date } = {};

    if (date) {
      // A single calendar day: midnight → 23:59:59.999
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      startsAtFilter = { gte: dayStart, lte: dayEnd };
    } else {
      if (dateFrom) {
        const d = new Date(dateFrom);
        // Ensure starting at 00:00 if only date string was passed
        if (dateFrom.length === 10) d.setUTCHours(0, 0, 0, 0);
        startsAtFilter.gte = d;
      }
      if (dateTo) {
        const d = new Date(dateTo);
        // Stretch to 23:59:59.999 if only date string (YYYY-MM-DD) was passed
        if (dateTo.length === 10) d.setUTCHours(23, 59, 59, 999);
        startsAtFilter.lte = d;
      }
    }

    // --- Fetch appointments ---
    const appointments = await prisma.appointments.findMany({
      where: {
        ...(Object.keys(startsAtFilter).length > 0 && {
          starts_at: startsAtFilter,
        }),
        ...(branchId && { branch_id: branchId }),
        ...(staffId && { staff_id: staffId }),
        // Cast is safe — Prisma validates against the enum at runtime
        ...(status && { status: status as never }),
      },
      include: {
        // Client basic info for the appointment card
        clients: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            phone: true,
            avatar_url: true,
          },
        },
        // Staff profile + linked user name
        staff_profiles: {
          select: {
            id: true,
            color_hex: true,
            users: {
              select: {
                first_name: true,
                last_name: true,
                avatar_url: true,
              },
            },
          },
        },
        // Service name and duration for calendar rendering
        services: {
          select: {
            id: true,
            name: true,
            duration_mins: true,
            price: true,
          },
        },
      },
      orderBy: { starts_at: "asc" },
      take: limit,
      skip: offset,
    });

    return Response.json({
      data: appointments,
      meta: {
        count: appointments.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/appointments]", error);
    return Response.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}