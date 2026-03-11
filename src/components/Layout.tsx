import React from "react";
import { 
  LayoutDashboard, 
  ReceiptText, 
  PieChart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Wallet
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/Button";
import { Background } from "./ui/Background";
import { motion, AnimatePresence } from "motion/react";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userEmail?: string | null;
}

export function Layout({ children, activeTab, setActiveTab, onLogout, userEmail }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: ReceiptText },
    { id: "reports", label: "Reports", icon: PieChart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-8 px-6">
      <div className="flex items-center gap-4 px-2 mb-12">
        <div className="w-12 h-12 bg-blue-600/80 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 backdrop-blur-xl border border-white/20">
          <Wallet size={28} />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight text-glow">FinTrack</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden",
              activeTab === item.id
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
            )}
          >
            <item.icon size={22} className={cn("transition-transform duration-300 group-hover:scale-110", activeTab === item.id && "text-blue-400")} />
            {item.label}
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 w-1 h-6 bg-blue-500 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>

      <div className="pt-8 border-t border-white/5">
        <div className="px-5 py-4 mb-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Account</p>
          <p className="text-sm font-bold text-white truncate">{userEmail || "Guest User"}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 px-5 py-4 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent hover:border-rose-500/20 rounded-2xl"
          onClick={onLogout}
        >
          <LogOut size={22} />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex relative">
      <Background />
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 sticky top-0 h-screen z-20">
        <div className="h-full glass-dark border-r border-white/5">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 glass-dark border-b border-white/5 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600/80 rounded-xl flex items-center justify-center text-white border border-white/20">
            <Wallet size={22} />
          </div>
          <span className="font-bold text-white text-xl tracking-tight">FinTrack</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2.5 text-slate-400 hover:bg-white/5 rounded-xl border border-white/10 transition-colors"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 w-80 glass-dark z-50 transition-transform duration-500 ease-out transform border-r border-white/10",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="p-6 lg:p-12 pt-28 lg:pt-12 max-w-7xl mx-auto w-full">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
