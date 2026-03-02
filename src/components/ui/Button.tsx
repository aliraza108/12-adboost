"use client";

import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
};

export function Button({
  variant = "primary",
  loading,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-body text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60";

  const styles = {
    primary: "bg-terracotta text-warm-white hover:bg-[#b55522]",
    secondary:
      "border border-transparent bg-sand-100 text-sand-700 hover:border-terracotta hover:text-sand-900",
    ghost: "bg-transparent text-sand-600 hover:bg-sand-100"
  };

  return (
    <button
      className={cn(base, styles[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}
