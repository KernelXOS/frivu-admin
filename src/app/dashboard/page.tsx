export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { Users, Trophy, Crown, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [totalUsers, totalEvents, activeSubscriptions, pendingEnrollments, recentEvents] =
    await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.subscription.count({ where: { status: "ACTIVE", plan: { not: "FREE" } } }),
      prisma.enrollment.count({ where: { status: "PENDING" } }),
      prisma.event.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { enrollments: true } } },
      }),
    ]);

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header title="Dashboard" subtitle="Vista general de Frivu" />
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total usuarios" value={totalUsers} icon={Users} color="blue" />
          <StatCard title="Eventos" value={totalEvents} icon={Trophy} color="yellow" />
          <StatCard title="Suscripciones activas" value={activeSubscriptions} icon={Crown} color="purple" />
          <StatCard title="Solicitudes pendientes" value={pendingEnrollments} icon={Clock} color="green" />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-white font-semibold">Eventos recientes</h2>
          </div>
          <div className="divide-y divide-zinc-800">
            {recentEvents.length === 0 && (
              <p className="p-6 text-zinc-500 text-sm">No hay eventos aún.</p>
            )}
            {recentEvents.map((event) => (
              <div key={event.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{event.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{formatDate(event.startDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400 text-xs">{event._count.enrollments} inscriptos</span>
                  <Badge variant={event.type === "PREMIUM" ? "premium" : "info"}>
                    {event.type === "PREMIUM" ? "👑 Premium" : "Gratuito"}
                  </Badge>
                  <Badge
                    variant={
                      event.status === "ACTIVE"
                        ? "success"
                        : event.status === "FINISHED"
                        ? "default"
                        : event.status === "CANCELLED"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {event.status === "ACTIVE"
                      ? "Activo"
                      : event.status === "FINISHED"
                      ? "Finalizado"
                      : event.status === "CANCELLED"
                      ? "Cancelado"
                      : "Borrador"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
