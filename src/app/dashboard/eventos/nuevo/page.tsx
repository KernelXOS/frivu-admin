"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Link from "next/link";

export default function NuevoEventoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "FREE",
    status: "DRAFT",
    startDate: "",
    endDate: "",
    maxPlayers: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        maxPlayers: form.maxPlayers ? parseInt(form.maxPlayers) : null,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Error al crear evento");
      return;
    }

    const data = await res.json();
    router.push(`/dashboard/eventos/${data.id}`);
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <Header title="Crear evento" subtitle="Nuevo torneo o evento" />
      <div className="p-8 max-w-2xl space-y-6">
        <Link href="/dashboard/eventos" className="text-xs text-zinc-500 hover:text-[#E8FF47]">
          ← Volver a eventos
        </Link>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Nombre del evento *</label>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Ej: Torneo de verano 2025" required />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descripción del evento..."
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8FF47] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Tipo</label>
              <Select name="type" value={form.type} onChange={handleChange}>
                <option value="FREE">🆓 Gratuito</option>
                <option value="PREMIUM">👑 Premium</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Estado inicial</label>
              <Select name="status" value={form.status} onChange={handleChange}>
                <option value="DRAFT">Borrador</option>
                <option value="ACTIVE">Activo</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Fecha de inicio *</label>
              <Input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Fecha de fin</label>
              <Input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Máximo de jugadores</label>
            <Input type="number" name="maxPlayers" value={form.maxPlayers} onChange={handleChange} placeholder="Sin límite" min={2} />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Creando..." : "Crear evento"}
            </Button>
            <Link href="/dashboard/eventos">
              <Button type="button" variant="ghost">Cancelar</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
