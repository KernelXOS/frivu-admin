export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function SuscripcionesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = params.filter;

  const [allUsers, withSub] = await Promise.all([
    prisma.user.findMany({
      include: { subscription: true },
      where:
        filter === "con_sub"
          ? { subscription: { status: "ACTIVE", plan: { not: "FREE" } } }
          : filter === "sin_sub"
          ? { OR: [{ subscription: null }, { subscription: { plan: "FREE" } }] }
          : {},
      orderBy: { createdAt: "desc" },
    }),
    prisma.subscription.count({ where: { status: "ACTIVE", plan: { not: "FREE" } } }),
  ]);

  const planBadge = (plan: string) => {
    if (plan === "PRO") return <Badge variant="premium">👑 PRO</Badge>;
    if (plan === "BASIC") return <Badge variant="info">BASIC</Badge>;
    return <Badge variant="default">FREE</Badge>;
  };

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header title="Suscripciones" subtitle={`${withSub} suscripciones activas`} />
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Con suscripción", value: "con_sub", count: withSub },
            {
              label: "Sin suscripción",
              value: "sin_sub",
              count: allUsers.length - withSub,
            },
            { label: "Todos", value: "", count: allUsers.length },
          ].map((opt) => (
            <Link
              key={opt.value}
              href={`/dashboard/suscripciones?filter=${opt.value}`}
              className={`p-4 rounded-xl border transition-all ${
                (filter || "") === opt.value
                  ? "bg-[#E8FF47]/10 border-[#E8FF47]/30 text-[#E8FF47]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              <p className="text-2xl font-bold text-white">{opt.count}</p>
              <p className="text-sm mt-1">{opt.label}</p>
            </Link>
          ))}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase">Usuario</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase">Plan</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase">Estado</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase">Inicio</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase">Vence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {allUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 text-sm">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
              {allUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/usuarios/${user.id}`} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                        {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm group-hover:text-[#E8FF47] transition-colors">
                          {user.name || "—"}
                        </p>
                        <p className="text-zinc-500 text-xs">{user.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {user.subscription ? planBadge(user.subscription.plan) : planBadge("FREE")}
                  </td>
                  <td className="px-4 py-3">
                    {user.subscription ? (
                      <Badge
                        variant={
                          user.subscription.status === "ACTIVE"
                            ? "success"
                            : user.subscription.status === "EXPIRED"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {user.subscription.status === "ACTIVE"
                          ? "Activa"
                          : user.subscription.status === "EXPIRED"
                          ? "Expirada"
                          : "Cancelada"}
                      </Badge>
                    ) : (
                      <Badge variant="default">Sin suscripción</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-sm">
                    {user.subscription ? formatDate(user.subscription.startsAt) : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-sm">
                    {user.subscription?.expiresAt ? formatDate(user.subscription.expiresAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
