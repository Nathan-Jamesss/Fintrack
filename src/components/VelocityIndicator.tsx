import React from 'react';
import { motion } from 'motion/react';

interface VelocityIndicatorProps {
  projected: number;
  budget: number;
  velocity: number;
}

export function VelocityIndicator({ projected, budget, velocity }: VelocityIndicatorProps) {
  const percentage = Math.min((projected / budget) * 100, 100);
  const isOverBudget = projected > budget;

  return (
    <div className="space-y-6">
      <div className="relative h-48 w-full flex items-center justify-center">
        {/* Gauge Background */}
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={440}
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: 440 - (440 * percentage) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={isOverBudget ? "text-rose-500/80" : "text-blue-500/80"}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-mono font-bold text-white tracking-tighter">
            {percentage.toFixed(0)}%
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            of budget
          </span>
        </div>
      </div>

      <div className="glass p-5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Projected Total</span>
          <span className={isOverBudget ? "text-rose-400 font-mono font-bold" : "text-blue-400 font-mono font-bold"}>
            ${projected.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daily Velocity</span>
          <span className="text-white font-mono font-bold">${velocity.toFixed(2)} / day</span>
        </div>
        <div className="pt-3 border-t border-white/5">
          <p className="text-xs font-bold text-slate-300 leading-relaxed">
            At this rate, you'll spend <span className={isOverBudget ? "text-rose-400" : "text-blue-400"}>${projected.toFixed(2)}</span> by the end of the month.
            {isOverBudget ? " You'll exceed your budget by $" + (projected - budget).toFixed(2) + "." : " You'll stay within your budget."}
          </p>
        </div>
      </div>
    </div>
  );
}
