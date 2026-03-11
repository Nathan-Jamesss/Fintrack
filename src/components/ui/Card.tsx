import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

type CardProps = ComponentPropsWithoutRef<"div">;

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-card inner-glow overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("p-6 border-b border-white/5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return (
    <h3
      className={cn("text-lg font-bold text-white tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}
