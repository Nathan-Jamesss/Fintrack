import React from "react";
import { 
  Wallet, 
  TrendingUp, 
  PieChart, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Zap
} from "lucide-react";
import { Button } from "./ui/Button";
import { motion } from "motion/react";
import { Background } from "./ui/Background";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 relative overflow-hidden">
      <Background />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-slate-950/20 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <Wallet size={24} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight font-display">FinTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex text-slate-400 hover:text-white" onClick={onLogin}>Log In</Button>
            <Button onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 relative">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold mb-8 border border-blue-500/20 backdrop-blur-md">
              Smart Finance for Students
            </span>
            <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tight mb-8 font-display leading-[1.1]">
              Master Your Money, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Shape Your Future.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              FinTrack is the all-in-one digital financial management system designed specifically for university students. Track income, manage expenses, and build savings with ease.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-500 h-14 px-8 text-lg" onClick={onGetStarted}>
                Start Tracking Now
                <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-white/10 hover:bg-white/5 backdrop-blur-md">
                Explore Features
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mt-24 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20" />
            <div className="relative bg-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-4 shadow-2xl">
              <img 
                src="https://picsum.photos/seed/finance-dashboard/1200/600" 
                alt="Dashboard Preview" 
                className="rounded-[2rem] w-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">Everything you need to stay on track</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Powerful features to help you manage your finances without the stress.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Income & Expense Tracking",
                description: "Easily log your daily transactions and categorize them for better visibility."
              },
              {
                icon: PieChart,
                title: "Visual Reports",
                description: "Understand your spending habits with intuitive charts and monthly summaries."
              },
              {
                icon: Zap,
                title: "Budget Alerts",
                description: "Set monthly limits and get notified when you're close to exceeding your budget."
              },
              {
                icon: ShieldCheck,
                title: "Secure & Private",
                description: "Your financial data is encrypted and protected with secure authentication."
              },
              {
                icon: Smartphone,
                title: "Mobile Friendly",
                description: "Access your financial dashboard anytime, anywhere, on any device."
              },
              {
                icon: CheckCircle2,
                title: "Smart Categorization",
                description: "Group your expenses into Food, Travel, Education, and more for better analysis."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                className="glass-card p-10 rounded-3xl border border-white/10 group transition-all duration-300"
              >
                <div className="w-14 h-14 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-display">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-30 group-hover:opacity-50 transition duration-1000" />
          <div className="relative bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-12 md:p-24 text-center border border-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent)]" />
            <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10 font-display">Ready to take control of your finances?</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto relative z-10">
              Join thousands of students who are already using FinTrack to build better financial habits.
            </p>
            <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 relative z-10 h-16 px-10 text-xl font-bold rounded-2xl" onClick={onGetStarted}>
              Create Your Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 relative bg-slate-950/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/30">
              <Wallet size={18} />
            </div>
            <span className="font-bold text-white text-xl font-display">FinTrack</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 FinTrack. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
