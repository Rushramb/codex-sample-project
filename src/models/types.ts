/**
 * Core type definitions for the Personal Financial Analyst framework
 */

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  merchant?: string;
  category?: CategoryType;
  subCategory?: string;
  isRecurring?: boolean;
  mcc?: string; // Merchant Category Code
  paymentMethod?: PaymentMethod;
  tags?: string[];
}

export enum CategoryType {
  // Essential expenses
  HOUSING = 'Housing',
  UTILITIES = 'Utilities',
  INSURANCE = 'Insurance',

  // Semi-essential expenses
  GROCERIES = 'Groceries',
  TRANSPORTATION = 'Transportation',
  HEALTHCARE = 'Healthcare',

  // Discretionary expenses
  DINING_OUT = 'Dining Out',
  ENTERTAINMENT = 'Entertainment',
  SUBSCRIPTIONS = 'Subscriptions',
  SHOPPING = 'Shopping',
  IMPULSE = 'Impulse Purchases',
  TRAVEL = 'Travel',

  // Other
  INCOME = 'Income',
  SAVINGS = 'Savings',
  DEBT_PAYMENT = 'Debt Payment',
  UNCATEGORIZED = 'Uncategorized'
}

export enum ExpenseLevel {
  ESSENTIAL = 'Essential',
  SEMI_ESSENTIAL = 'Semi-Essential',
  DISCRETIONARY = 'Discretionary'
}

export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card',
  CASH = 'Cash',
  TRANSFER = 'Bank Transfer',
  CHECK = 'Check',
  MOBILE_PAYMENT = 'Mobile Payment'
}

export interface CategoryMapping {
  category: CategoryType;
  level: ExpenseLevel;
  subCategories: string[];
  keywords: string[];
  merchantPatterns: RegExp[];
}

export interface SpendingPattern {
  type: PatternType;
  description: string;
  frequency: number;
  averageAmount: number;
  totalAmount: number;
  transactions: Transaction[];
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

export enum PatternType {
  SUBSCRIPTION_CREEP = 'Subscription Creep',
  CONVENIENCE_PREMIUM = 'Convenience Premium',
  DUPLICATE_SERVICE = 'Duplicate Service',
  MICRO_TRANSACTION = 'Micro-Transaction Pattern',
  WEEKEND_OVERSPEND = 'Weekend Overspending',
  PAYDAY_EFFECT = 'Payday Effect',
  EMOTIONAL_SPENDING = 'Emotional Spending',
  LIFESTYLE_INFLATION = 'Lifestyle Inflation',
  BRAND_PREMIUM = 'Brand Premium'
}

export interface UnnecessaryExpense {
  id: string;
  category: CategoryType;
  merchant: string;
  monthlyAmount: number;
  annualAmount: number;
  type: 'subscription' | 'convenience' | 'duplicate' | 'impulse' | 'premium';
  description: string;
  recommendation: string;
  savingsPotential: number;
  implementationEase: 'easy' | 'moderate' | 'difficult';
  lifestyleImpact: 'minimal' | 'moderate' | 'significant';
}

export interface Budget {
  totalIncome: number;
  categories: {
    [key in CategoryType]?: BudgetAllocation;
  };
  savingsGoal: number;
  emergencyFundTarget: number;
}

export interface BudgetAllocation {
  planned: number;
  actual: number;
  variance: number;
  variancePercentage: number;
  limit: number;
}

export interface AnalysisResult {
  summary: AnalysisSummary;
  categoryBreakdown: CategoryBreakdown[];
  patterns: SpendingPattern[];
  unnecessaryExpenses: UnnecessaryExpense[];
  recommendations: Recommendation[];
  budget: Budget;
  metrics: FinancialMetrics;
}

export interface AnalysisSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  savingsRate: number;
  totalIdentifiedSavings: number;
  analyzedPeriod: {
    startDate: Date;
    endDate: Date;
    days: number;
  };
  topSavingsOpportunities: UnnecessaryExpense[];
  spendingPersonality: string;
}

export interface CategoryBreakdown {
  category: CategoryType;
  level: ExpenseLevel;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
  averageTransaction: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  benchmark: number; // typical spending for income level
  variance: number;
  topMerchants: MerchantSpending[];
}

export interface MerchantSpending {
  merchant: string;
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
}

export interface Recommendation {
  id: string;
  priority: 'immediate' | 'short-term' | 'long-term';
  category: string;
  title: string;
  description: string;
  estimatedSavings: number;
  implementationSteps: string[];
  timeframe: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export interface FinancialMetrics {
  essentialExpenseRatio: number;
  discretionaryExpenseRatio: number;
  savingsRate: number;
  debtToIncomeRatio: number;
  emergencyFundMonths: number;
  averageMonthlyExpenses: number;
  spendingVelocity: number; // rate of spending acceleration
  impulseSpendingRatio: number;
  subscriptionBurden: number; // total monthly subscriptions
  conveniencePremiumCost: number;
}

export interface BudgetStrategy {
  name: string;
  description: string;
  allocations: {
    [key in CategoryType]?: number; // percentage or dollar amount
  };
  rules: BudgetRule[];
  savingsTarget: number;
  emergencyFundGoal: number;
}

export interface BudgetRule {
  type: 'limit' | 'alert' | 'automate' | 'challenge';
  category?: CategoryType;
  description: string;
  threshold?: number;
  action: string;
}

export interface TimeBasedPattern {
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  pattern: string;
  averageAmount: number;
  frequency: number;
}

export interface BehavioralInsight {
  insight: string;
  triggerType: 'temporal' | 'emotional' | 'social' | 'habitual';
  affectedCategories: CategoryType[];
  impactAmount: number;
  interventionStrategy: string;
}
