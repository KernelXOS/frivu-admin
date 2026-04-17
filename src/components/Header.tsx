"use client";

import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur">
      <div>
        <h1 className="text-white font-semibold text-lg">{title}</h1>
        {subtitle && <p className="text-zinc-500 text-xs">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button className="text-zinc-500 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E8FF47] flex items-center justify-center text-black text-xs font-bold">
            {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-sm font-medium">{session?.user?.name || "Admin"}</p>
            <p className="text-zinc-500 text-xs">{(session?.user as any)?.role || "ADMIN"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
