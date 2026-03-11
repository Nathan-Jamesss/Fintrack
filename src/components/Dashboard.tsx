import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  AlertCircle,
  Plus,
  ArrowRight,
  Activity,
  Calendar,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ReceiptText
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { formatCurrency, formatDate, cn } from "../lib/utils";
import { DashboardStats } from "../types";
import { DailyChart } from "./DailyChart";
import { SpendingHeatmap } from "./SpendingHeatmap";
import { VelocityIndicator } from "./VelocityIndicator";
import { CategoryTrends } from "./CategoryTrends";
import { motion } from "motion/react";

interface DashboardProps {
  stats: DashboardStats;
  onAddTransaction: () => void;
  onViewAllTransactions: () => void;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#8b5cf6", "#ec4899"];

export function Dashboard({ stats, onAddTransaction, onViewAllTransactions }: DashboardProps) {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-5xl font-bold text-white tracking-tight font-display text-glow">Executive Overview</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3 ml-1">Real-time financial intelligence & projections</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Period</span>
            <span className="text-white font-mono font-bold">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          </div>
          <Button 
            onClick={onAddTransaction} 
            size="lg" 
            className="gap-3 rounded-2xl px-10 h-16 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            <Plus size={24} />
            New Entry
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Liquidity"
          value={stats.balance}
          icon={<Wallet size={24} />}
          variant="primary"
          trend={+12.4}
        />
        <StatCard
          title="Monthly Inflow"
          value={stats.totalIncome}
          icon={<TrendingUp size={24} />}
          variant="emerald"
          trend={+8.2}
        />
        <StatCard
          title="Monthly Outflow"
          value={stats.totalExpenses}
          icon={<TrendingDown size={24} />}
          variant="rose"
          trend={-5.4}
        />
      </div>

      {/* MoM Comparison & Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-white/5 bg-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <CardHeader className="flex flex-row items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <Activity className="text-blue-400" size={20} />
              <CardTitle>Performance Analytics</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border",
                stats.percentageChange > 0 ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              )}>
                {stats.percentageChange > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(stats.percentageChange).toFixed(1)}% MoM
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all group/item">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Previous Period</p>
                <p className="text-3xl font-mono font-bold text-white tracking-tighter">{formatCurrency(stats.lastMonthExpenses)}</p>
                <div className="mt-6 flex items-center gap-3">
                  <Badge variant="neutral" className="text-[10px] px-3 py-1 bg-white/5 border-white/10">{stats.biggestCategoryLastMonth}</Badge>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Primary Outflow</span>
                </div>
              </div>
              <div className="p-8 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all group/item">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Current Period</p>
                <p className="text-3xl font-mono font-bold text-white tracking-tighter">{formatCurrency(stats.thisMonthExpenses)}</p>
                <div className="mt-6 flex items-center gap-3">
                  <Badge variant="info" className="text-[10px] px-3 py-1 bg-blue-500/20 border-blue-500/30">{stats.biggestCategoryThisMonth}</Badge>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Primary Outflow</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <CardTitle className="text-sm">Budget Utilization</CardTitle>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Monthly target tracking</p>
                  </div>
                  <span className="text-xl font-mono font-bold text-white tracking-tighter">{stats.budgetProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.budgetProgress, 100)}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={cn(
                      "h-full rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-colors duration-500",
                      stats.budgetProgress > 90 ? "bg-rose-500" : stats.budgetProgress > 70 ? "bg-amber-500" : "bg-blue-500"
                    )}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>{formatCurrency(stats.totalExpenses)} Spent</span>
                  <span>{formatCurrency(stats.totalIncome)} Limit</span>
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                    <AlertCircle size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-300">Projected EOM Spend</span>
                </div>
                <span className="text-lg font-mono font-bold text-white tracking-tighter">{formatCurrency(stats.projectedSpending)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Zap className="text-amber-400" size={20} />
              <CardTitle>Spending Velocity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <VelocityIndicator 
              projected={stats.projectedSpending} 
              budget={stats.totalIncome} 
              velocity={stats.velocity} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Day-by-Day Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calendar className="text-slate-400" size={20} />
              <CardTitle>Historical Daily Spend</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <DailyChart data={stats.dailySpendingLastMonth} title="Last Month" />
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Activity className="text-blue-400" size={20} />
              <CardTitle>Comparative Daily Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <DailyChart 
              data={stats.dailySpendingThisMonth} 
              title="This Month" 
              compareData={stats.dailySpendingLastMonth}
              showToday
            />
          </CardContent>
        </Card>
      </div>

      {/* Category Trends */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-emerald-400" size={20} />
            <h3 className="text-2xl font-bold text-white tracking-tight font-display">Category Intelligence</h3>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last 30 days trend</p>
        </div>
        <CategoryTrends trends={stats.categoryTrends} />
      </div>

      {/* Heatmap & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-white/5 bg-white/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-400" size={20} />
              <CardTitle>Activity Heatmap</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <SpendingHeatmap data={stats.heatmapData} transactions={stats.recentTransactions} />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-8 text-center">60-day financial footprint</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-white/5 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <ReceiptText className="text-slate-400" size={20} />
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-400 hover:text-blue-300 font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 px-4 rounded-xl" 
              onClick={onViewAllTransactions}
            >
              View Ledger
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {stats.recentTransactions.length === 0 ? (
                <div className="p-24 text-center text-slate-500 font-bold uppercase text-xs tracking-widest">
                  No recent activity detected
                </div>
              ) : (
                stats.recentTransactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "w-14 h-14 rounded-[1.25rem] flex items-center justify-center border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                        tx.type === "income" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/10" 
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-lg shadow-rose-500/10"
                      )}>
                        {tx.type === "income" ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-white tracking-tight text-lg">{tx.category}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{formatDate(tx.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-xl font-mono font-bold tracking-tighter",
                        tx.type === "income" ? "text-emerald-400" : "text-rose-400"
                      )}>
                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[200px] mt-1">{tx.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, variant = "primary" }: any) {
  const variants: any = {
    primary: "bg-blue-600/10 border-blue-500/20 text-blue-400",
    emerald: "bg-emerald-600/10 border-emerald-500/20 text-emerald-400",
    rose: "bg-rose-600/10 border-rose-500/20 text-rose-400",
  };

  return (
    <Card className={cn("relative overflow-hidden group border-white/5 transition-all duration-500 hover:translate-y-[-4px]", variants[variant])}>
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
        {icon}
      </div>
      <CardContent className="p-10 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500", 
            variant === "primary" ? "bg-blue-500/20 border-blue-500/30" : 
            variant === "emerald" ? "bg-emerald-500/20 border-emerald-500/30" : 
            "bg-rose-500/20 border-rose-500/30"
          )}>
            {icon}
          </div>
          {trend && (
            <Badge variant={trend > 0 ? "success" : "danger"} className="bg-white/5 border-white/10 text-[10px] font-mono">
              {trend > 0 ? "+" : ""}{trend}%
            </Badge>
          )}
        </div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">{title}</p>
        <h3 className="text-4xl font-mono font-bold text-white tracking-tighter">{formatCurrency(value)}</h3>
      </CardContent>
    </Card>
  );
}
