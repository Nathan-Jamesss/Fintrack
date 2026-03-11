export type TransactionType = 'income' | 'expense';

export type Category = 'Food' | 'Travel' | 'Education' | 'Shopping' | 'Entertainment' | 'Health' | 'Bills' | 'Others';

export interface Transaction {
  id: string;
  uid: string;
  type: TransactionType;
  category: Category;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  monthlyBudget: number;
  createdAt: string;
}

export interface DailyData {
  date: string;
  amount: number;
  categories: { [key in Category]?: number };
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  budgetProgress: number;
  categoryData: { name: string; value: number }[];
  recentTransactions: Transaction[];
  lastMonthExpenses: number;
  thisMonthExpenses: number;
  percentageChange: number;
  biggestCategoryLastMonth: string;
  biggestCategoryThisMonth: string;
  dailySpendingLastMonth: DailyData[];
  dailySpendingThisMonth: DailyData[];
  projectedSpending: number;
  velocity: number;
  heatmapData: { date: string; amount: number }[];
  categoryTrends: { name: string; data: number[] }[];
}
