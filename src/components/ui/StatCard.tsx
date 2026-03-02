import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  trend?: number;
  badge?: string;
};

export function StatCard({ label, value, trend, badge }: StatCardProps) {
  const isPositive = typeof trend === "number" && trend >= 0;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.25em] text-sand-500">{label}</p>
        {badge && (
          <span className="rounded-full bg-sand-200 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-sand-700">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className="font-display text-3xl text-sand-900">{value}</p>
        {typeof trend === "number" && (
          <div className={cn("flex items-center gap-1 text-xs", isPositive ? "text-sage" : "text-terracotta")}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </Card>
  );
}
