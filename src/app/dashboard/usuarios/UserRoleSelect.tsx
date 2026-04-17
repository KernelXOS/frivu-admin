"use client";

import { useState } from "react";

interface UserRoleSelectProps {
  userId: string;
  currentRole: string;
}

export function UserRoleSelect({ userId, currentRole }: UserRoleSelectProps) {
  const [role, setRole] = useState(currentRole);
  const [saving, setSaving] = useState(false);

  async function handleChange(newRole: string) {
    setSaving(true);
    setRole(newRole);
    await fetch(`/api/usuarios/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setSaving(false);
  }

  const colors: Record<string, string> = {
    ADMIN: "text-[#E8FF47]",
    MODERATOR: "text-blue-400",
    PLAYER: "text-zinc-400",
  };

  return (
    <select
      value={role}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className={`bg-transparent border border-zinc-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#E8FF47] transition-colors ${colors[role]}`}
    >
      <option value="ADMIN" className="bg-zinc-900 text-[#E8FF47]">ADMIN</option>
      <option value="MODERATOR" className="bg-zinc-900 text-blue-400">MODERATOR</option>
      <option value="PLAYER" className="bg-zinc-900 text-zinc-400">PLAYER</option>
    </select>
  );
}
