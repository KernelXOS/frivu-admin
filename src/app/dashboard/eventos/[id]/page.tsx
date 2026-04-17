export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EnrollmentActions } from "./EnrollmentActions";
import { StandingForm } from "./StandingForm";

export default async function EventoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
      standings: { orderBy: { position: "asc" } },
    },
  });

  if (!event) notFound();

  const pending = event.enrollments.filter((e) => e.status === "PENDING");
  const accepted = event.enrollments.filter((e) => e.status === "ACCEPTED");

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header title={event.name} subtitle="Detalle del evento" />
      <div className="p-8 space-y-6">
        <Link href="/dashboard/eventos" className="text-xs text-zinc-500 hover:text-[#E8FF47]">
          ← Volver a eventos
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant={event.type === "PREMIUM" ? "premium" : "info"}>
              {event.type === "PREMIUM" ? "👑 Premium" : "🆓 Gratuito"}
            </Badge>
            <Badge
              variant={
                event.status === "ACTIVE" ? "success" : event.status === "CANCELLED" ? "danger" : event.status === "FINISHED" ? "default" : "warning"
              }
            >
              {event.status === "ACTIVE" ? "Activo" : event.status === "CANCELLED" ? "Cancelado" : event.status === "FINISHED" ? "Finalizado" : "Borrador"}
            </Badge>
          </div>
          {event.description && <p className="text-zinc-400 text-sm mb-4">{event.description}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-zinc-500 text-xs">Inicio</p>
              <p className="text-white">{formatDate(event.startDate)}</p>
            </div>
            {event.endDate && (
              <div>
                <p className="text-zinc-500 text-xs">Fin</p>
                <p className="text-white">{formatDate(event.endDate)}</p>
              </div>
            )}
            <div>
              <p className="text-zinc-500 text-xs">Inscritos</p>
              <p className="text-white">{accepted.length}{event.maxPlayers ? ` / ${event.maxPlayers}` : ""}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Pendientes</p>
              <p className="text-amber-400 font-medium">{pending.length}</p>
            </div>
          </div>
        </div>

        {pending.length > 0 && (
          <div className="bg-zinc-900 border border-amber-500/20 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-white font-semibold">Solicitudes pendientes ({pending.length})</h2>
            </div>
            <div className="divide-y divide-zinc-800">
              {pending.map((enr) => (
                <div key={enr.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">{enr.user.name || enr.user.email}</p>
                    <p className="text-zinc-500 text-xs">{enr.user.email}</p>
                  </div>
                  <EnrollmentActions enrollmentId={enr.id} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-white font-semibold">Jugadores inscritos ({accepted.length})</h2>
          </div>
          {accepted.length === 0 ? (
            <p className="p-6 text-zinc-500 text-sm">No hay jugadores aceptados aún.</p>
          ) : (
            <div className="divide-y divide-zinc-800">
              {accepted.map((enr) => (
                <div key={enr.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                      {(enr.user.name || enr.user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm">{enr.user.name || "—"}</p>
                      <p className="text-zinc-500 text-xs">{enr.user.email}</p>
                    </div>
                  </div>
                  <Badge variant="success">Aceptado</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-white font-semibold">Tabla de posiciones</h2>
            <StandingForm eventId={event.id} />
          </div>
          {event.standings.length === 0 ? (
            <p className="p-6 text-zinc-500 text-sm">Sin posiciones registradas aún.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase w-12">#</th>
                  <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase">Jugador</th>
                  <th className="text-center px-4 py-3 text-xs text-zinc-500 font-medium uppercase">Pts</th>
                  <th className="text-center px-4 py-3 text-xs text-zinc-500 font-medium uppercase">G</th>
                  <th className="text-center px-4 py-3 text-xs text-zinc-500 font-medium uppercase">E</th>
                  <th className="text-center px-4 py-3 text-xs text-zinc-500 font-medium uppercase">P</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {event.standings.map((s) => (
                  <tr key={s.id} className={`${s.position <= 3 ? "bg-[#E8FF47]/5" : ""}`}>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-bold ${
                          s.position === 1 ? "text-yellow-400" : s.position === 2 ? "text-zinc-300" : s.position === 3 ? "text-amber-600" : "text-zinc-500"
                        }`}
                      >
                        {s.position === 1 ? "🥇" : s.position === 2 ? "🥈" : s.position === 3 ? "🥉" : s.position}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white text-sm font-medium">{s.playerName}</td>
                    <td className="px-4 py-3 text-center text-[#E8FF47] font-bold">{s.points}</td>
                    <td className="px-4 py-3 text-center text-emerald-400 text-sm">{s.wins}</td>
                    <td className="px-4 py-3 text-center text-zinc-400 text-sm">{s.draws}</td>
                    <td className="px-4 py-3 text-center text-red-400 text-sm">{s.losses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
