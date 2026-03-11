import React from "react";
import { Wallet, Mail, Lock, User, ArrowRight, Chrome } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { CardContent } from "./ui/Card";
import { motion } from "motion/react";
import { Background } from "./ui/Background";

interface AuthProps {
  mode: "login" | "register";
  onToggleMode: () => void;
  onLogin: (email: string, pass: string) => void;
  onRegister: (email: string, pass: string, name: string) => void;
  onGoogleLogin: () => void;
}

export function Auth({ mode, onToggleMode, onLogin, onRegister, onGoogleLogin }: AuthProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      onLogin(email, password);
    } else {
      onRegister(email, password, name);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      <Background />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            <Wallet size={32} />
          </motion.div>
          <h1 className="text-4xl font-bold text-white tracking-tight font-display">FinTrack</h1>
          <p className="text-slate-400 mt-3 text-center px-4">
            {mode === "login" ? "Welcome back! Sign in to continue." : "Create an account to get started."}
          </p>
        </div>

        <div className="glass-card border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "register" && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                  <Input
                    placeholder="Full Name"
                    className="pl-12 h-14 bg-white/5 border-white/10 focus:border-blue-500/50 rounded-2xl text-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="pl-12 h-14 bg-white/5 border-white/10 focus:border-blue-500/50 rounded-2xl text-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-12 h-14 bg-white/5 border-white/10 focus:border-blue-500/50 rounded-2xl text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full h-14 gap-3 text-lg font-bold bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight size={22} />
              </Button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#020617]/50 backdrop-blur-xl px-4 text-slate-500 font-bold tracking-widest">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Button variant="outline" className="h-14 gap-4 border-white/10 hover:bg-white/5 rounded-2xl text-lg" onClick={onGoogleLogin}>
                <Chrome size={24} className="text-blue-400" />
                Google
              </Button>
            </div>

            <p className="text-center text-slate-400 mt-10">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={onToggleMode}
                className="text-blue-400 font-bold hover:text-blue-300 transition-colors ml-1"
              >
                {mode === "login" ? "Sign Up" : "Log In"}
              </button>
            </p>
          </CardContent>
        </div>
      </motion.div>
    </div>
  );
}
