"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Wand2,
  FlaskConical,
  BarChart3,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/optimize", label: "Optimize", icon: Sparkles }
];

const campaignTabs = [
  { href: "/campaigns", label: "Variants", icon: Wand2 },
  { href: "/campaigns", label: "Experiments", icon: FlaskConical },
  { href: "/campaigns", label: "Analytics", icon: BarChart3 }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-[240px] md:flex-col md:gap-6 md:border-r md:border-sand-200 md:bg-sand-100 md:px-6 md:py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta text-white">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="font-display text-lg">AdBoost</p>
          <p className="text-xs text-sand-600">AI Creative Studio</p>
        </div>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-sand-200 text-sand-900"
                  : "text-sand-700 hover:bg-sand-200/60"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-sand-500">Campaign Views</p>
        <nav className="mt-3 space-y-1">
          {campaignTabs.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-sand-600"
              >
                <Icon size={14} />
                {item.label}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-3 rounded-full border border-sand-200 bg-warm-white/90 px-4 py-2 shadow-soft md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-full px-3 py-2 text-[11px]",
              active ? "text-terracotta" : "text-sand-600"
            )}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
