export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { UserRoleSelect } from "./UserRoleSelect";

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const params = await searchParams;
  const filter = params.filter;
  const q = params.q;

  const users = await prisma.user.findMany({
    include: { subscription: true },
    where: {
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {}),
      ...(filter === "con_sub"
        ? { subscription: { status: "ACTIVE", plan: { not: "FREE" } } }
        : filter === "sin_sub"
        ? { OR: [{ subscription: null }, { subscription: { plan: "FREE" } }] }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header title="Usuarios" subtitle={`${users.length} usuarios encontrados`} />
      <div className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <form className="flex gap-2 flex-1">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Buscar por nombre o email..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8FF47]"
            />
            <button type="submit" className="bg-[#E8FF47] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d4eb3a]">
              Buscar
            </button>
          </form>
          <div className="flex gap-2">
            {[
              { label: "Todos", value: "" },
              { label: "Con suscripción", value: "con_sub" },
              { label: "Sin suscripción", value: "sin_sub" },
            ].map((opt) => (
              <Link
                key={opt.value}
                href={`/dashboard/usuarios?filter=${opt.value}`}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  (filter || "") === opt.value
                    ? "bg-[#E8FF47]/10 text-[#E8FF47] border border-[#E8FF47]/20"
                    : "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700"
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Usuario</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Rol</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Suscripción</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Registrado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 text-sm">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
              {users.map((user) => {
                const hasSub = user.subscription && user.subscription.plan !== "FREE" && user.subscription.status === "ACTIVE";
                return (
                  <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                          {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{user.name || "—"}</p>
                          <p className="text-zinc-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <UserRoleSelect userId={user.id} currentRole={user.role} />
                    </td>
                    <td className="px-4 py-3">
                      {hasSub ? (
                        <Badge variant="premium">
                          👑 {user.subscription!.plan}
                        </Badge>
                      ) : (
                        <Badge variant="default">Sin suscripción</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-sm">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/usuarios/${user.id}`}
                        className="text-xs text-zinc-400 hover:text-[#E8FF47] transition-colors"
                      >
                        Ver detalle →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
