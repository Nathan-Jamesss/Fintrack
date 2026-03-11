import React from 'react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer 
} from 'recharts';

interface CategoryTrendsProps {
  trends: { name: string; data: number[] }[];
}

export function CategoryTrends({ trends }: CategoryTrendsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {trends.map((trend) => {
        const chartData = trend.data.map((val, i) => ({ val, i }));
        const isGrowing = trend.data[trend.data.length - 1] > trend.data[0];

        return (
          <div key={trend.name} className="glass p-5 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors uppercase tracking-widest">{trend.name}</h4>
              <span className={isGrowing ? "text-rose-400 text-xs font-bold" : "text-emerald-400 text-xs font-bold"}>
                {isGrowing ? '↑' : '↓'}
              </span>
            </div>
            <div className="h-16 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line 
                    type="monotone" 
                    dataKey="val" 
                    stroke={isGrowing ? "#f43f5e" : "#10b981"} 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last 30 Days</span>
              <span className="text-xs font-mono font-bold text-white">
                ${trend.data[trend.data.length - 1].toFixed(0)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
