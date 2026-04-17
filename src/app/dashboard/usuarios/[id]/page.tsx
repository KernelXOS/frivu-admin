export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      subscription: true,
      enrollments: {
        include: { event: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) notFound();

  const hasSub = user.subscription && user.subscription.plan !== "FREE" && user.subscription.status === "ACTIVE";

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header title={user.name || user.email} subtitle="Detalle de usuario" />
      <div className="p-8 space-y-6">
        <Link href="/dashboard/usuarios" className="text-xs text-zinc-500 hover:text-[#E8FF47]">← Volver a usuarios</Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-white font-semibold">Información personal</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center text-2xl font-bold text-white">
                {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">{user.name || "Sin nombre"}</p>
                <p className="text-zinc-500 text-sm">{user.email}</p>
                <p className="text-zinc-600 text-xs mt-1">Registrado {formatDate(user.createdAt)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge
                variant={user.role === "ADMIN" ? "warning" : user.role === "MODERATOR" ? "info" : "default"}
              >
                {user.role}
              </Badge>
              {hasSub ? (
                <Badge variant="premium">👑 {user.subscription!.plan}</Badge>
              ) : (
                <Badge variant="default">Sin suscripción</Badge>
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
            <h2 className="text-white font-semibold">Suscripción</h2>
            {user.subscription ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Plan</span>
                  <span className="text-white">{user.subscription.plan}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Estado</span>
                  <Badge variant={user.subscription.status === "ACTIVE" ? "success" : "danger"}>
                    {user.subscription.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Inicio</span>
                  <span className="text-white">{formatDate(user.subscription.startsAt)}</span>
                </div>
                {user.subscription.expiresAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Vence</span>
                    <span className="text-white">{formatDate(user.subscription.expiresAt)}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">Sin suscripción activa.</p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-white font-semibold">Eventos inscritos ({user.enrollments.length})</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase">Evento</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase">Tipo</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase">Estado inscripción</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {user.enrollments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-zinc-500 text-sm">No hay inscripciones.</td>
                </tr>
              )}
              {user.enrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-zinc-800/50">
                  <td className="px-4 py-3 text-white text-sm">{enr.event.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={enr.event.type === "PREMIUM" ? "premium" : "info"}>
                      {enr.event.type === "PREMIUM" ? "👑 Premium" : "Gratuito"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        enr.status === "ACCEPTED" ? "success" : enr.status === "REJECTED" ? "danger" : "warning"
                      }
                    >
                      {enr.status === "ACCEPTED" ? "Aceptado" : enr.status === "REJECTED" ? "Rechazado" : "Pendiente"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-sm">{formatDate(enr.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
