import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";
import { getCurrentTenantId } from "@/lib/auth/session";
import { startOfDay, endOfDay, startOfWeek, startOfMonth, format, subDays } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const tenantId = await getCurrentTenantId();
    const now = new Date();
    
    // Bounds
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);

    const [
      summaryData,
      upcomingRaw,
      revenueToday,
      revenueWeek,
      revenueMonth,
      staffPerformanceData,
      topServicesData,
      clientStats
    ] = await Promise.all([
      // 1. Appointment Summary (Today)
      prisma.appointments.groupBy({
        by: ['status'],
        where: { tenant_id: tenantId, starts_at: { gte: todayStart, lte: todayEnd } },
        _count: { _all: true }
      }),

      // 2. Upcoming Schedule (Next 3)
      prisma.appointments.findMany({
        where: {
          tenant_id: tenantId,
          starts_at: { gte: now },
          status: { in: ['booked', 'confirmed', 'in_progress'] }
        },
        take: 3,
        orderBy: { starts_at: 'asc' },
        include: {
          clients: { select: { first_name: true, last_name: true } },
          services: { select: { name: true, duration_mins: true } },
          staff_profiles: { include: { users: { select: { first_name: true } } } }
        }
      }),

      // 3. Revenue Today
      prisma.invoices.aggregate({
        _sum: { total: true },
        where: { tenant_id: tenantId, status: 'paid', created_at: { gte: todayStart, lte: todayEnd } }
      }),

      // 4. Revenue Week
      prisma.invoices.aggregate({
        _sum: { total: true },
        where: { tenant_id: tenantId, status: 'paid', created_at: { gte: weekStart } }
      }),

      // 5. Revenue Month
      prisma.invoices.aggregate({
        _sum: { total: true },
        where: { tenant_id: tenantId, status: 'paid', created_at: { gte: monthStart } }
      }),

      // 6. Staff Performance (Revenue from Services/Products only)
      prisma.invoice_items.groupBy({
        by: ['staff_id'],
        where: {
          tenant_id: tenantId,
          staff_id: { not: null },
          item_type: { in: ['service', 'product'] },
          invoices: { status: 'paid' }
        },
        _sum: { total: true },
        _count: { invoice_id: true },
        orderBy: { _sum: { total: 'desc' } },
        take: 5
      }),

      // 7. Top Services (Last 30 Days)
      prisma.invoice_items.groupBy({
        by: ['service_id'],
        where: {
          tenant_id: tenantId,
          item_type: 'service',
          invoices: { status: 'paid', created_at: { gte: subDays(now, 30) } }
        },
        _count: { service_id: true },
        orderBy: { _count: { service_id: 'desc' } },
        take: 3
      }),

      // 8. Client Growth
      prisma.$transaction([
        prisma.clients.count({ where: { tenant_id: tenantId } }),
        prisma.clients.count({ where: { tenant_id: tenantId, created_at: { gte: monthStart } } })
      ])
    ]);

    // Flatten Schedule Data
    const schedule = upcomingRaw.map(apt => {
      const startDate = apt.starts_at ? new Date(apt.starts_at) : null;
      return {
        id: apt.id,
        time: startDate ? format(startDate, "hh:mm") : "--:--",
        ampm: startDate ? format(startDate, "a") : "",
        clientName: apt.clients ? `${apt.clients.first_name} ${apt.clients.last_name}` : "Unknown Client",
        serviceName: apt.services?.name || "Unknown Service",
        staffName: apt.staff_profiles?.users?.first_name || "Unknown Staff",
        status: apt.status,
        startsAt: apt.starts_at
      };
    });

    // Fetch Names for Staff and Services
    const staffIds = staffPerformanceData.map(s => s.staff_id).filter(Boolean) as string[];
    const serviceIds = topServicesData.map(s => s.service_id).filter(Boolean) as string[];

    const [staffProfiles, services] = await Promise.all([
      prisma.staff_profiles.findMany({
        where: { id: { in: staffIds } },
        include: { users: { select: { first_name: true, last_name: true } } }
      }),
      prisma.services.findMany({
        where: { id: { in: serviceIds } },
        select: { id: true, name: true }
      })
    ]);

    // Construct Response
    return Response.json({
      data: {
        summary: {
          total: summaryData.reduce((acc, s) => s.status !== 'cancelled' ? acc + s._count._all : acc, 0),
          completed: summaryData.find(s => s.status === 'completed')?._count._all || 0,
          cancelled: summaryData.find(s => s.status === 'cancelled')?._count._all || 0,
          booked: summaryData.find(s => s.status === 'booked')?._count._all || 0
        },
        schedule,
        revenue: {
          today: Number(revenueToday._sum.total || 0),
          thisWeek: Number(revenueWeek._sum.total || 0),
          thisMonth: Number(revenueMonth._sum.total || 0),
          currency: 'INR'
        },
        staffPerformance: staffPerformanceData.map(s => {
          const profile = staffProfiles.find(p => p.id === s.staff_id);
          return {
            id: s.staff_id,
            name: profile?.users ? `${profile.users.first_name} ${profile.users.last_name}` : 'Unknown',
            appointments: s._count.invoice_id,
            revenue: Number(s._sum.total || 0),
            initial: profile?.users?.first_name?.charAt(0) || '?'
          };
        }),
        topServices: topServicesData.map(s => ({
          name: services.find(svc => svc.id === s.service_id)?.name || 'Unknown',
          count: s._count.service_id,
          percentage: 0 // Will be calculated client-side or during dashboard logic
        })),
        clientStats: {
          total: clientStats[0],
          newThisMonth: clientStats[1]
        }
      }
    });

  } catch (error: any) {
    console.error("[GET /api/v1/dashboard]", error);
    return Response.json({ error: "Aggregation failed" }, { status: 500 });
  }
}

