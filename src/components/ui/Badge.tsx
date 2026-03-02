import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  goal?: "clicks" | "signups" | "sales" | "impressions" | "leads";
  status?: "winner" | "testing" | "active" | "paused" | "draft" | "loser" | "completed" | "running";
};

const goalStyles: Record<string, string> = {
  clicks: "bg-sand-200 text-sand-800",
  signups: "bg-sage-light text-sage",
  sales: "bg-terracotta-light text-terracotta",
  impressions: "bg-sand-100 text-sand-700",
  leads: "bg-sand-300 text-sand-800"
};

const statusStyles: Record<string, string> = {
  winner: "bg-amber-200 text-amber-900",
  testing: "bg-sand-300 text-sand-800",
  active: "bg-sage-light text-sage",
  paused: "bg-sand-100 text-sand-600",
  draft: "bg-sand-100 text-sand-600",
  loser: "bg-sand-200 text-sand-700",
  completed: "bg-sage-light text-sage",
  running: "bg-sage-light text-sage"
};

export function Badge({ className, goal, status, ...props }: BadgeProps) {
  const style = goal ? goalStyles[goal] : status ? statusStyles[status] : "bg-sand-100 text-sand-700";

  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium", style, className)}
      {...props}
    />
  );
}
