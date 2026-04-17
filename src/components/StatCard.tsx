import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  positive?: boolean;
  color?: "yellow" | "blue" | "green" | "purple";
}

export function StatCard({ title, value, icon: Icon, change, positive, color = "yellow" }: StatCardProps) {
  const colors = {
    yellow: "bg-[#E8FF47]/10 text-[#E8FF47]",
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-emerald-500/10 text-emerald-400",
    purple: "bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-500 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={cn("text-xs mt-1", positive ? "text-emerald-400" : "text-red-400")}>
              {change}
            </p>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
