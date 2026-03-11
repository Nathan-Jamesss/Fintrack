import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-blue-600/80 text-white hover:bg-blue-500/90 shadow-lg shadow-blue-500/20 active:scale-95",
    secondary: "bg-slate-800/50 text-slate-100 hover:bg-slate-700/60 backdrop-blur-md border border-white/10 active:scale-95",
    outline: "bg-transparent border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm active:scale-95",
    ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white active:scale-95",
    danger: "bg-rose-500/80 text-white hover:bg-rose-400/90 shadow-lg shadow-rose-500/20 active:scale-95",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
