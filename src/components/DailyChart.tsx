import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { DailyData } from '../types';

interface DailyChartProps {
  data: DailyData[];
  title: string;
  compareData?: DailyData[];
  showToday?: boolean;
}

export function DailyChart({ data, title, compareData, showToday }: DailyChartProps) {
  const average = data.length > 0 
    ? data.reduce((acc, curr) => acc + curr.amount, 0) / data.length 
    : 0;

  const today = new Date().toISOString().split('T')[0];

  // Prepare cumulative data for comparison
  const chartData = data.map((d, i) => {
    let cumulativeThis = 0;
    for (let j = 0; j <= i; j++) cumulativeThis += data[j].amount;

    let cumulativeLast = 0;
    if (compareData) {
      for (let j = 0; j <= i && j < compareData.length; j++) {
        cumulativeLast += compareData[j].amount;
      }
    }

    return {
      ...d,
      day: d.date.split('-')[2],
      cumulativeThis,
      cumulativeLast: compareData ? cumulativeLast : undefined,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-2xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{data.date}</p>
          <p className="text-lg font-mono font-bold text-white mb-3">${data.amount.toFixed(2)}</p>
          <div className="space-y-1">
            {Object.entries(data.categories || {}).map(([cat, val]) => (
              <div key={cat} className="flex justify-between gap-4 text-[10px]">
                <span className="text-slate-400 font-bold">{cat}</span>
                <span className="text-white font-mono">${(val as number).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#64748b', fontWeight: 700 }}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#64748b', fontWeight: 700 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {compareData ? (
            <>
              <Area 
                type="monotone" 
                dataKey="cumulativeLast" 
                stroke="#64748b" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1} 
                fill="url(#colorLast)" 
              />
              <Area 
                type="monotone" 
                dataKey="cumulativeThis" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAmount)" 
              />
            </>
          ) : (
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
            />
          )}

          <ReferenceLine y={average} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'right', value: 'Avg', fill: '#f43f5e', fontSize: 10, fontWeight: 700 }} />
          {showToday && <ReferenceLine x={today.split('-')[2]} stroke="#3b82f6" strokeWidth={2} />}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
