import React from "react";
import { X, Plus, Save, TrendingUp, TrendingDown } from "lucide-react";
import { CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input, Select } from "./ui/Input";
import { Transaction, TransactionType, Category } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSubmit: (data: Partial<Transaction>) => void;
  onCancel: () => void;
}

export function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const [type, setType] = React.useState<TransactionType>(transaction?.type || "expense");
  const [category, setCategory] = React.useState<Category>(transaction?.category || "Food");
  const [amount, setAmount] = React.useState<string>(transaction?.amount?.toString() || "");
  const [description, setDescription] = React.useState<string>(transaction?.description || "");
  const [date, setDate] = React.useState<string>(transaction?.date || new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      category,
      amount: parseFloat(amount),
      description,
      date,
    });
  };

  const categories: Category[] = ['Food', 'Travel', 'Education', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Others'];

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="w-full max-w-xl glass-card rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="p-10 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white font-display tracking-tight">
              {transaction ? "Modify Record" : "New Entry"}
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
              {transaction ? "Update existing financial data" : "Document a new financial movement"}
            </p>
          </div>
          <button 
            onClick={onCancel} 
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <X size={24} />
          </button>
        </div>
        
        <CardContent className="p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-4 p-1.5 bg-white/5 rounded-[2rem] border border-white/5">
              <button
                type="button"
                className={`h-14 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                  type === "income" 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setType("income")}
              >
                <TrendingUp size={16} />
                Income
              </button>
              <button
                type="button"
                className={`h-14 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                  type === "expense" 
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setType("expense")}
              >
                <TrendingDown size={16} />
                Expense
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Category</label>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  required
                  className="bg-white/5 border-white/10 rounded-2xl h-16 text-lg font-bold text-slate-300"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Amount</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors font-mono font-bold">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="bg-white/5 border-white/10 rounded-2xl h-16 pl-10 text-xl font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 rounded-2xl h-16 text-lg font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Description</label>
                <Input
                  placeholder="What was this for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 rounded-2xl h-16 text-lg"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-16 rounded-2xl border-white/10 hover:bg-white/5 text-white font-bold" 
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-[2] h-16 rounded-2xl gap-3 font-bold text-lg shadow-lg bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 active:scale-[0.98] transition-all"
              >
                {transaction ? <Save size={22} /> : <Plus size={22} />}
                {transaction ? "Synchronize" : "Commit Entry"}
              </Button>
            </div>
          </form>
        </CardContent>
      </motion.div>
    </div>
  );
}
