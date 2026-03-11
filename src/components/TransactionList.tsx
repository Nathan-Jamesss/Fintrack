import React from "react";
import { 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input, Select } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { formatCurrency, formatDate } from "../lib/utils";
import { Transaction, TransactionType, Category } from "../types";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<TransactionType | "all">("all");
  const [categoryFilter, setCategoryFilter] = React.useState<Category | "all">("all");

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || tx.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const categories: Category[] = ['Food', 'Travel', 'Education', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Others'];

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight font-display text-glow">Transaction Ledger</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Detailed history of all financial movements</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
            <Input
              placeholder="Search ledger..."
              className="pl-12 h-14 bg-white/5 border-white/10 focus:border-blue-500/50 rounded-2xl text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            className="w-full md:w-44 h-14 bg-white/5 border-white/10 rounded-2xl text-slate-300 font-bold"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          <Select
            className="w-full md:w-44 h-14 bg-white/5 border-white/10 rounded-2xl text-slate-300 font-bold"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
          >
            <option value="all">Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>
      </div>

      <Card className="border-white/5 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Description</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Type</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center text-slate-500 font-bold uppercase text-xs tracking-widest">
                      No records found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-all group">
                      <td className="px-8 py-6 text-sm font-mono font-bold text-slate-400 whitespace-nowrap">{formatDate(tx.date)}</td>
                      <td className="px-8 py-6">
                        <Badge variant="neutral" className="text-[10px] px-3 py-1">{tx.category}</Badge>
                      </td>
                      <td className="px-8 py-6 text-base text-white font-bold tracking-tight max-w-[300px] truncate">
                        {tx.description}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center border",
                            tx.type === "income" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          )}>
                            {tx.type === "income" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          </div>
                          <span className={cn(
                            "text-xs font-bold uppercase tracking-widest",
                            tx.type === "income" ? "text-emerald-400" : "text-rose-400"
                          )}>
                            {tx.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "text-lg font-mono font-bold tracking-tighter",
                          tx.type === "income" ? "text-emerald-400" : "text-rose-400"
                        )}>
                          {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-10 h-10 p-0 rounded-xl text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20"
                            onClick={() => onEdit(tx)}
                          >
                            <Edit2 size={18} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-10 h-10 p-0 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
                            onClick={() => onDelete(tx.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
