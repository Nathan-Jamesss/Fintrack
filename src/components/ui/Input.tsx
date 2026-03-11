import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-bold text-slate-300 ml-1">{label}</label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all backdrop-blur-md",
          error && "border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs font-bold text-rose-400 ml-1">{error}</p>}
    </div>
  );
}

type SelectProps = ComponentPropsWithoutRef<"select"> & {
  label?: string;
  error?: string;
};

export function Select({
  label,
  error,
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-bold text-slate-300 ml-1">{label}</label>
      )}
      <select
        className={cn(
          "w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all appearance-none cursor-pointer backdrop-blur-md",
          error && "border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs font-bold text-rose-400 ml-1">{error}</p>}
    </div>
  );
}
