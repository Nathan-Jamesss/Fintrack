import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeatmapProps {
  data: { date: string; amount: number }[];
  transactions: Transaction[];
}

export function SpendingHeatmap({ data, transactions }: HeatmapProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const maxAmount = Math.max(...data.map(d => d.amount), 1);

  const getColor = (amount: number) => {
    if (amount === 0) return 'bg-white/5';
    const intensity = Math.min(Math.floor((amount / maxAmount) * 4) + 1, 4);
    switch (intensity) {
      case 1: return 'bg-blue-900/40';
      case 2: return 'bg-blue-700/50';
      case 3: return 'bg-blue-500/60';
      case 4: return 'bg-blue-400/80';
      default: return 'bg-white/5';
    }
  };

  const selectedTransactions = selectedDate 
    ? transactions.filter(t => t.date === selectedDate && t.type === 'expense')
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {data.map((day) => (
          <button
            key={day.date}
            onClick={() => setSelectedDate(selectedDate === day.date ? null : day.date)}
            className={cn(
              "w-4 h-4 rounded-sm transition-all duration-300 hover:scale-125 hover:ring-2 hover:ring-white/30",
              getColor(day.amount),
              selectedDate === day.date && "ring-2 ring-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            )}
            title={`${day.date}: $${day.amount.toFixed(2)}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">{selectedDate}</h4>
                <span className="text-xs font-mono font-bold text-blue-400">
                  Total: ${data.find(d => d.date === selectedDate)?.amount.toFixed(2)}
                </span>
              </div>
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedTransactions.length > 0 ? (
                  selectedTransactions.map((t) => (
                    <div key={t.id} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white/5">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{t.description}</span>
                        <span className="text-[10px] text-slate-500">{t.category}</span>
                      </div>
                      <span className="text-white font-mono font-bold">-${t.amount.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 text-xs py-4">No transactions on this day</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
