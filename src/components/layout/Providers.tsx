"use client";

import { Toaster } from "sonner";
import type { ReactNode } from "react";
import { MobileNav } from "@/components/layout/Sidebar";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
      <MobileNav />
    </>
  );
}
