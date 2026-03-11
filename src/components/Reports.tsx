import React from "react";
import { 
  Download, 
  FileText, 
  Calendar, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  TrendingDown, 
  Wallet 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { formatCurrency } from "../lib/utils";
import { Transaction } from "../types";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface ReportsProps {
  transactions: Transaction[];
}

export function Reports({ transactions }: ReportsProps) {
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().toISOString().slice(0, 7));

  const monthlyTransactions = transactions.filter(tx => tx.date.startsWith(selectedMonth));
  
  const monthlyStats = monthlyTransactions.reduce((acc, tx) => {
    if (tx.type === "income") acc.income += tx.amount;
    else acc.expense += tx.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const categoryData = monthlyTransactions
    .filter(tx => tx.type === "expense")
    .reduce((acc: any[], tx) => {
      const existing = acc.find(item => item.name === tx.category);
      if (existing) existing.value += tx.amount;
      else acc.push({ name: tx.category, value: tx.amount });
      return acc;
    }, []);

  const downloadPDF = () => {
    const doc = new jsPDF() as any;
    doc.setFontSize(20);
    doc.text("FinTrack - Monthly Financial Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Report for: ${selectedMonth}`, 14, 32);
    doc.text(`Total Income: ${formatCurrency(monthlyStats.income)}`, 14, 42);
    doc.text(`Total Expenses: ${formatCurrency(monthlyStats.expense)}`, 14, 52);
    doc.text(`Net Balance: ${formatCurrency(monthlyStats.income - monthlyStats.expense)}`, 14, 62);

    const tableData = monthlyTransactions.map(tx => [
      tx.date,
      tx.category,
      tx.description,
      tx.type.toUpperCase(),
      formatCurrency(tx.amount)
    ]);

    doc.autoTable({
      startY: 72,
      head: [["Date", "Category", "Description", "Type", "Amount"]],
      body: tableData,
    });

    doc.save(`FinTrack_Report_${selectedMonth}.pdf`);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight font-display text-glow">Financial Intelligence</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Deep dive into your monthly spending patterns</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="month"
            className="h-14 px-6 rounded-2xl border border-white/10 bg-white/5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 backdrop-blur-md"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <Button variant="outline" className="h-14 px-8 rounded-2xl gap-3 font-bold border-white/10 hover:bg-white/5" onClick={downloadPDF}>
            <Download size={22} />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Monthly Inflow</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <TrendingUp size={16} />
              </div>
            </div>
            <h3 className="text-3xl font-mono font-bold text-emerald-400 tracking-tighter">{formatCurrency(monthlyStats.income)}</h3>
          </CardContent>
        </Card>
        <Card className="bg-rose-500/10 border-rose-500/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Monthly Outflow</p>
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
                <TrendingDown size={16} />
              </div>
            </div>
            <h3 className="text-3xl font-mono font-bold text-rose-400 tracking-tighter">{formatCurrency(monthlyStats.expense)}</h3>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Net Retention</p>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Wallet size={16} />
              </div>
            </div>
            <h3 className="text-3xl font-mono font-bold text-blue-400 tracking-tighter">{formatCurrency(monthlyStats.income - monthlyStats.expense)}</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <PieChartIcon className="text-blue-400" size={20} />
            <CardTitle>Expense Distribution</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-[450px] p-8">
          {categoryData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                <PieChartIcon size={40} className="opacity-20" />
              </div>
              <p className="font-bold uppercase text-[10px] tracking-widest">No data available for this period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(2, 6, 23, 0.8)', 
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)'
                  }}
                  itemStyle={{ color: '#fff', fontWeight: 700, fontSize: '12px' }}
                  labelStyle={{ color: '#64748b', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
