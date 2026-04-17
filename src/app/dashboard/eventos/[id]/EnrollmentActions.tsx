"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export function EnrollmentActions({ enrollmentId }: { enrollmentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);

  async function handle(action: "accept" | "reject") {
    setLoading(action);
    await fetch(`/api/enrollments/${enrollmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action === "accept" ? "ACCEPTED" : "REJECTED" }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handle("accept")}
        disabled={loading !== null}
        className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
      >
        <Check className="w-3.5 h-3.5" />
        {loading === "accept" ? "..." : "Aceptar"}
      </button>
      <button
        onClick={() => handle("reject")}
        disabled={loading !== null}
        className="flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/20 transition-colors disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" />
        {loading === "reject" ? "..." : "Rechazar"}
      </button>
    </div>
  );
}
