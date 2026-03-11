import React from "react";
import { User, Bell, Shield, Wallet, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { UserProfile } from "../types";

interface SettingsProps {
  userProfile: UserProfile;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
}

export function Settings({ userProfile, onUpdateProfile }: SettingsProps) {
  const [displayName, setDisplayName] = React.useState(userProfile.displayName || "");
  const [monthlyBudget, setMonthlyBudget] = React.useState(userProfile.monthlyBudget?.toString() || "0");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateProfile({
        displayName,
        monthlyBudget: parseFloat(monthlyBudget),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-bold text-white tracking-tight font-display text-glow">Account Configuration</h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Manage your profile and financial targets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-white/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="text-blue-400" size={20} />
                <CardTitle>Personal Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Display Name</label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                      className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-blue-500/50 text-lg"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <Input
                      value={userProfile.email}
                      disabled
                      className="h-14 bg-white/5 border-white/5 rounded-2xl text-slate-500 cursor-not-allowed text-lg"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Monthly Spending Target</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors font-mono font-bold">$</span>
                    <Input
                      type="number"
                      value={monthlyBudget}
                      onChange={(e) => setMonthlyBudget(e.target.value)}
                      placeholder="0.00"
                      className="h-14 pl-10 bg-white/5 border-white/10 rounded-2xl focus:border-blue-500/50 text-lg font-mono"
                    />
                  </div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">We'll notify you when you approach this limit</p>
                </div>
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] gap-3"
                    disabled={isSaving}
                  >
                    <Save size={20} />
                    {isSaving ? "Synchronizing..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-white/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="text-amber-400" size={20} />
                <CardTitle>Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                <div>
                  <p className="font-bold text-white tracking-tight">Budget Alerts</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Notify me when I reach 80% of my budget</p>
                </div>
                <div className="w-14 h-7 bg-blue-600 rounded-full relative cursor-pointer shadow-inner shadow-black/20">
                  <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-lg" />
                </div>
              </div>
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                <div>
                  <p className="font-bold text-white tracking-tight">Weekly Intelligence</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Receive a weekly report of your spending</p>
                </div>
                <div className="w-14 h-7 bg-white/10 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white/20 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-blue-600/10 border-blue-500/20 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-8 text-center relative z-10">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                <Shield size={40} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Security First</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Your financial data is encrypted and stored securely. We never share your personal information with third parties.
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-white/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Wallet className="text-emerald-400" size={20} />
                <CardTitle>Account Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-emerald-500/20">
                  Active Plan
                </div>
                <h4 className="text-2xl font-bold text-white font-display">Premium Tier</h4>
                <p className="text-slate-500 text-xs mt-3 font-bold uppercase tracking-widest">Unlimited tracking & insights</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
