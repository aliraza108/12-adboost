"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const labels: Record<string, string> = {
  "dashboard": "Dashboard",
  "campaigns": "Campaigns",
  "optimize": "Optimize"
};

export function TopBar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="flex flex-col gap-3 border-b border-sand-200 bg-sand-50/80 px-6 py-6 backdrop-blur">
      <div className="text-xs uppercase tracking-[0.3em] text-sand-500">AdBoost Studio</div>
      <div className="flex items-center gap-2 text-sm text-sand-600">
        {segments.length === 0 && <span>Home</span>}
        {segments.map((segment, index) => (
          <span key={`${segment}-${index}`} className="flex items-center gap-2">
            {index > 0 && <ChevronRight size={14} className="text-sand-400" />}
            <span className="capitalize text-sand-700">
              {labels[segment] ?? segment.replace(/-/g, " ")}
            </span>
          </span>
        ))}
      </div>
    </header>
  );
}
