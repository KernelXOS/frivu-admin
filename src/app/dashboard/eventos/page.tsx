export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; tipo?: string }>;
}) {
  const params = await searchParams;
  const filter = params.filter;
  const tipo = params.tipo;

  const events = await prisma.event.findMany({
    include: {
      _count: { select: { enrollments: true, standings: true } },
      enrollments: { where: { status: "PENDING" }, select: { id: true } },
    },
    where: {
      ...(filter ? { status: filter as any } : {}),
      ...(tipo ? { type: tipo as any } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
      ACTIVE: { label: "Activo", variant: "success" },
      DRAFT: { label: "Borrador", variant: "warning" },
      FINISHED: { label: "Finalizado", variant: "default" },
      CANCELLED: { label: "Cancelado", variant: "danger" },
    };
    return map[status] || { label: status, variant: "default" };
  };

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header title="Eventos" subtitle={`${events.length} eventos`} />
      <div className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Todos", filter: "", tipo: "" },
              { label: "Activos", filter: "ACTIVE", tipo: "" },
              { label: "Borrador", filter: "DRAFT", tipo: "" },
              { label: "Finalizados", filter: "FINISHED", tipo: "" },
              { label: "👑 Premium", filter: "", tipo: "PREMIUM" },
              { label: "🆓 Gratuito", filter: "", tipo: "FREE" },
            ].map((opt) => {
              const active =
                (filter || "") === opt.filter && (tipo || "") === opt.tipo;
              return (
                <Link
                  key={opt.label}
                  href={`/dashboard/eventos?filter=${opt.filter}&tipo=${opt.tipo}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? "bg-[#E8FF47]/10 text-[#E8FF47] border border-[#E8FF47]/20"
                      : "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700"
                  }`}
                >
                  {opt.label}
                </Link>
              );
            })}
          </div>
          <Link
            href="/dashboard/eventos/nuevo"
            className="flex items-center gap-2 bg-[#E8FF47] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d4eb3a] transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Nuevo evento
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.length === 0 && (
            <div className="col-span-3 text-center py-16 text-zinc-500 text-sm">
              No hay eventos con estos filtros.
            </div>
          )}
          {events.map((event) => {
            const s = statusBadge(event.status);
            return (
              <Link
                key={event.id}
                href={`/dashboard/eventos/${event.id}`}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2">
                    <Badge variant={event.type === "PREMIUM" ? "premium" : "info"}>
                      {event.type === "PREMIUM" ? "👑 Premium" : "Gratuito"}
                    </Badge>
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </div>
                  {event.enrollments.length > 0 && (
                    <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full border border-amber-500/30">
                      {event.enrollments.length} pendiente{event.enrollments.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-semibold text-base group-hover:text-[#E8FF47] transition-colors">
                  {event.name}
                </h3>
                {event.description && (
                  <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{event.description}</p>
                )}
                <div className="flex items-center justify-between mt-4 text-xs text-zinc-500">
                  <span>{formatDate(event.startDate)}</span>
                  <span>{event._count.enrollments} inscriptos</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
