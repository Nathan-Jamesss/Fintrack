import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: "success" | "danger" | "warning" | "info" | "neutral";
};

export function Badge({
  variant = "neutral",
  className,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    danger: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    neutral: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-md",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
