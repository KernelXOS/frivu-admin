"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StandingForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ playerName: "", position: "", points: "", wins: "", draws: "", losses: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/eventos/${eventId}/standings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName: form.playerName,
        position: parseInt(form.position),
        points: parseInt(form.points) || 0,
        wins: parseInt(form.wins) || 0,
        draws: parseInt(form.draws) || 0,
        losses: parseInt(form.losses) || 0,
      }),
    });
    setLoading(false);
    setOpen(false);
    setForm({ playerName: "", position: "", points: "", wins: "", draws: "", losses: "" });
    router.refresh();
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="w-3.5 h-3.5" />
        Agregar posición
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div>
        <p className="text-xs text-zinc-500 mb-1">Jugador</p>
        <Input
          placeholder="Nombre"
          value={form.playerName}
          onChange={(e) => setForm((f) => ({ ...f, playerName: e.target.value }))}
          className="w-32 text-xs py-1"
          required
        />
      </div>
      <div>
        <p className="text-xs text-zinc-500 mb-1">Pos</p>
        <Input
          type="number"
          placeholder="#"
          value={form.position}
          onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
          className="w-14 text-xs py-1"
          min={1}
          required
        />
      </div>
      <div>
        <p className="text-xs text-zinc-500 mb-1">Pts</p>
        <Input
          type="number"
          placeholder="0"
          value={form.points}
          onChange={(e) => setForm((f) => ({ ...f, points: e.target.value }))}
          className="w-14 text-xs py-1"
        />
      </div>
      <div>
        <p className="text-xs text-zinc-500 mb-1">G/E/P</p>
        <div className="flex gap-1">
          <Input type="number" placeholder="G" value={form.wins} onChange={(e) => setForm((f) => ({ ...f, wins: e.target.value }))} className="w-12 text-xs py-1" />
          <Input type="number" placeholder="E" value={form.draws} onChange={(e) => setForm((f) => ({ ...f, draws: e.target.value }))} className="w-12 text-xs py-1" />
          <Input type="number" placeholder="P" value={form.losses} onChange={(e) => setForm((f) => ({ ...f, losses: e.target.value }))} className="w-12 text-xs py-1" />
        </div>
      </div>
      <Button type="submit" variant="primary" size="sm" disabled={loading}>
        {loading ? "..." : "Guardar"}
      </Button>
      <button type="button" onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white p-1">
        <X className="w-4 h-4" />
      </button>
    </form>
  );
}
