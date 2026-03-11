/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "./lib/firebase";
import { LandingPage } from "./components/LandingPage";
import { Auth } from "./components/Auth";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { TransactionList } from "./components/TransactionList";
import { TransactionForm } from "./components/TransactionForm";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Transaction, UserProfile, DashboardStats } from "./types";

export default function App() {
  const [view, setView] = React.useState<"landing" | "auth" | "app">("landing");
  const [authMode, setAuthMode] = React.useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Auth state listener
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as UserProfile);
          } else {
            // Create a default profile if it doesn't exist (e.g., after Google login)
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "User",
              monthlyBudget: 1000,
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
            setUser(newProfile);
          }
          setView("app");
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
        if (view === "app") setView("landing");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Transactions listener
  React.useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    const q = query(
      collection(db, "transactions"), 
      where("uid", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs: Transaction[] = [];
      snapshot.forEach((doc) => {
        txs.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      setTransactions(txs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "transactions");
    });

    return () => unsubscribe();
  }, [user]);

  const stats: DashboardStats = React.useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastMonthYear = lastMonthDate.getFullYear();

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

    // Filter transactions
    const expenses = transactions.filter(t => t.type === "expense");
    const income = transactions.filter(t => t.type === "income");

    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    // This Month Stats
    const thisMonthTxs = expenses.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const thisMonthExpenses = thisMonthTxs.reduce((sum, t) => sum + t.amount, 0);

    // Last Month Stats
    const lastMonthTxs = expenses.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });
    const lastMonthExpenses = lastMonthTxs.reduce((sum, t) => sum + t.amount, 0);

    // Percentage Change
    const percentageChange = lastMonthExpenses === 0 ? 0 : ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

    // Categories
    const getTopCategory = (txs: Transaction[]) => {
      const map = txs.reduce((acc: any, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
      const top = Object.entries(map).sort((a: any, b: any) => b[1] - a[1])[0];
      return top ? top[0] : "None";
    };

    const biggestCategoryThisMonth = getTopCategory(thisMonthTxs);
    const biggestCategoryLastMonth = getTopCategory(lastMonthTxs);

    // Daily Data Helper
    const getDailyData = (year: number, month: number, txs: Transaction[]) => {
      const days = getDaysInMonth(year, month);
      return Array.from({ length: days }).map((_, i) => {
        const day = i + 1;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayTxs = txs.filter(t => t.date === dateStr);
        const amount = dayTxs.reduce((sum, t) => sum + t.amount, 0);
        const categories = dayTxs.reduce((acc: any, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {});
        return { date: dateStr, amount, categories };
      });
    };

    const dailySpendingThisMonth = getDailyData(currentYear, currentMonth, thisMonthTxs);
    const dailySpendingLastMonth = getDailyData(lastMonthYear, lastMonth, lastMonthTxs);

    // Velocity & Projection
    const dayOfMonth = now.getDate();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const velocity = thisMonthExpenses / dayOfMonth;
    const projectedSpending = velocity * daysInMonth;

    // Heatmap (Last 60 days)
    const heatmapData = Array.from({ length: 60 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (59 - i));
      const dateStr = d.toISOString().split('T')[0];
      const amount = expenses
        .filter(t => t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      return { date: dateStr, amount };
    });

    // Category Trends (Last 30 days)
    const categories: any[] = ['Food', 'Travel', 'Education', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Others'];
    const categoryTrends = categories.map(cat => {
      const data = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        const dateStr = d.toISOString().split('T')[0];
        return expenses
          .filter(t => t.date === dateStr && t.category === cat)
          .reduce((sum, t) => sum + t.amount, 0);
      });
      return { name: cat, data };
    });

    const categoryMap = expenses.reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ 
      name, 
      value: value as number 
    }));

    const budget = user?.monthlyBudget || 1000;
    const budgetProgress = (thisMonthExpenses / budget) * 100;

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      budgetProgress,
      categoryData,
      recentTransactions: transactions.slice(0, 10),
      lastMonthExpenses,
      thisMonthExpenses,
      percentageChange,
      biggestCategoryLastMonth,
      biggestCategoryThisMonth,
      dailySpendingLastMonth,
      dailySpendingThisMonth,
      projectedSpending,
      velocity,
      heatmapData,
      categoryTrends
    };
  }, [transactions, user]);

  const handleLogin = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleRegister = async (email: string, pass: string, name: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: name,
        monthlyBudget: 1000,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
      setUser(newProfile);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView("landing");
    } catch (error: any) {
      console.error("Logout error:", error);
    }
  };

  const handleAddTransaction = async (data: Partial<Transaction>) => {
    if (!user) return;
    try {
      const docRef = doc(collection(db, "transactions"));
      await setDoc(docRef, {
        ...data,
        id: docRef.id,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });
      setIsFormOpen(false);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, "transactions");
    }
  };

  const handleUpdateTransaction = async (data: Partial<Transaction>) => {
    if (!editingTransaction) return;
    try {
      await updateDoc(doc(db, "transactions", editingTransaction.id), data);
      setEditingTransaction(null);
      setIsFormOpen(false);
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `transactions/${editingTransaction.id}`);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
    } catch (error: any) {
      handleFirestoreError(error, OperationType.DELETE, `transactions/${id}`);
    }
  };

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), data);
      setUser({ ...user, ...data });
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (view === "landing") {
    return (
      <LandingPage 
        onGetStarted={() => { setAuthMode("register"); setView("auth"); }} 
        onLogin={() => { setAuthMode("login"); setView("auth"); }} 
      />
    );
  }

  if (view === "auth") {
    return (
      <Auth 
        mode={authMode} 
        onToggleMode={() => setAuthMode(authMode === "login" ? "register" : "login")}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGoogleLogin={handleGoogleLogin}
      />
    );
  }

  return (
    <ErrorBoundary>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        userEmail={user?.email}
      >
        {activeTab === "dashboard" && (
          <Dashboard 
            stats={stats} 
            onAddTransaction={() => { setEditingTransaction(null); setIsFormOpen(true); }}
            onViewAllTransactions={() => setActiveTab("transactions")}
          />
        )}
        {activeTab === "transactions" && (
          <TransactionList 
            transactions={transactions} 
            onEdit={(tx) => { setEditingTransaction(tx); setIsFormOpen(true); }}
            onDelete={handleDeleteTransaction}
          />
        )}
        {activeTab === "reports" && (
          <Reports transactions={transactions} />
        )}
        {activeTab === "settings" && user && (
          <Settings 
            userProfile={user} 
            onUpdateProfile={handleUpdateProfile} 
          />
        )}

        {isFormOpen && (
          <TransactionForm 
            transaction={editingTransaction}
            onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
            onCancel={() => { setIsFormOpen(false); setEditingTransaction(null); }}
          />
        )}
      </Layout>
    </ErrorBoundary>
  );
}

