/**
 * TransactionAnalyzer - Core module for transaction categorization and pattern recognition
 */

import {
  Transaction,
  CategoryType,
  SpendingPattern,
  PatternType,
  CategoryBreakdown,
  MerchantSpending,
  TimeBasedPattern,
  BehavioralInsight,
  ExpenseLevel
} from '../models/types';
import { CATEGORY_MAPPINGS, MCC_MAPPINGS, RECURRING_INDICATORS, SPENDING_BENCHMARKS } from '../models/categoryConfig';

export class TransactionAnalyzer {
  private transactions: Transaction[];
  private totalIncome: number;

  constructor(transactions: Transaction[], totalIncome: number = 0) {
    this.transactions = transactions;
    this.totalIncome = totalIncome;
  }

  /**
   * Categorize a single transaction based on merchant, description, and MCC
   */
  categorizeTransaction(transaction: Transaction): Transaction {
    // Check MCC first if available
    if (transaction.mcc && MCC_MAPPINGS[transaction.mcc]) {
      transaction.category = MCC_MAPPINGS[transaction.mcc];
      return transaction;
    }

    const description = transaction.description.toLowerCase();
    const merchant = (transaction.merchant || '').toLowerCase();
    const searchText = `${description} ${merchant}`;

    // Check against category mappings
    for (const mapping of CATEGORY_MAPPINGS) {
      // Check merchant patterns
      for (const pattern of mapping.merchantPatterns) {
        if (pattern.test(searchText)) {
          transaction.category = mapping.category;

          // Determine subcategory
          for (const subCat of mapping.subCategories) {
            if (searchText.includes(subCat.toLowerCase())) {
              transaction.subCategory = subCat;
              break;
            }
          }
          return transaction;
        }
      }

      // Check keywords
      for (const keyword of mapping.keywords) {
        if (searchText.includes(keyword.toLowerCase())) {
          transaction.category = mapping.category;
          return transaction;
        }
      }
    }

    // Check if it's income
    if (transaction.amount < 0) {
      transaction.category = CategoryType.INCOME;
      return transaction;
    }

    // Default to uncategorized
    transaction.category = CategoryType.UNCATEGORIZED;
    return transaction;
  }

  /**
   * Categorize all transactions
   */
  categorizeAll(): Transaction[] {
    this.transactions = this.transactions.map(t => this.categorizeTransaction(t));
    return this.transactions;
  }

  /**
   * Detect if a transaction is recurring
   */
  detectRecurring(transaction: Transaction): boolean {
    const searchText = `${transaction.description} ${transaction.merchant || ''}`.toLowerCase();

    // Check for recurring indicators
    if (RECURRING_INDICATORS.some(indicator => searchText.includes(indicator))) {
      return true;
    }

    // Check if this merchant appears regularly (same amount, similar dates)
    const merchantTransactions = this.transactions.filter(t =>
      t.merchant === transaction.merchant &&
      Math.abs(t.amount - transaction.amount) < 1 // Allow $1 variance
    );

    // If we have 3+ transactions with similar amounts from same merchant, likely recurring
    if (merchantTransactions.length >= 3) {
      const dates = merchantTransactions.map(t => t.date.getDate());
      const avgDate = dates.reduce((a, b) => a + b, 0) / dates.length;

      // Check if transactions happen around the same day of month
      const variance = dates.every(d => Math.abs(d - avgDate) <= 3);
      return variance;
    }

    return false;
  }

  /**
   * Get category breakdown with statistics
   */
  getCategoryBreakdown(): CategoryBreakdown[] {
    const categoryMap = new Map<CategoryType, Transaction[]>();

    // Group transactions by category
    this.transactions.forEach(t => {
      if (!t.category) return;
      if (!categoryMap.has(t.category)) {
        categoryMap.set(t.category, []);
      }
      categoryMap.get(t.category)!.push(t);
    });

    const totalExpenses = this.transactions
      .filter(t => t.amount > 0 && t.category !== CategoryType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const breakdown: CategoryBreakdown[] = [];

    categoryMap.forEach((transactions, category) => {
      const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
      const merchants = this.getMerchantBreakdown(transactions);

      // Determine expense level
      const mapping = CATEGORY_MAPPINGS.find(m => m.category === category);
      const level = mapping?.level || ExpenseLevel.DISCRETIONARY;

      // Get benchmark based on income
      const incomeLevel = this.getIncomeLevel();
      const benchmark = SPENDING_BENCHMARKS[incomeLevel]?.[category] || 0;

      breakdown.push({
        category,
        level,
        totalAmount,
        percentage: (totalAmount / totalExpenses) * 100,
        transactionCount: transactions.length,
        averageTransaction: totalAmount / transactions.length,
        trend: this.calculateTrend(transactions),
        benchmark,
        variance: totalAmount - benchmark,
        topMerchants: merchants.slice(0, 5)
      });
    });

    return breakdown.sort((a, b) => b.totalAmount - a.totalAmount);
  }

  /**
   * Get merchant breakdown for transactions
   */
  private getMerchantBreakdown(transactions: Transaction[]): MerchantSpending[] {
    const merchantMap = new Map<string, Transaction[]>();

    transactions.forEach(t => {
      const merchant = t.merchant || 'Unknown';
      if (!merchantMap.has(merchant)) {
        merchantMap.set(merchant, []);
      }
      merchantMap.get(merchant)!.push(t);
    });

    const breakdown: MerchantSpending[] = [];

    merchantMap.forEach((txns, merchant) => {
      const totalAmount = txns.reduce((sum, t) => sum + t.amount, 0);
      const count = txns.length;

      // Determine frequency
      const days = this.getDateRange();
      let frequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
      if (count / days > 0.5) frequency = 'daily';
      else if (count / (days / 7) > 0.5) frequency = 'weekly';
      else if (count / (days / 30) > 0.5) frequency = 'monthly';
      else frequency = 'occasional';

      breakdown.push({
        merchant,
        totalAmount,
        transactionCount: count,
        averageAmount: totalAmount / count,
        frequency
      });
    });

    return breakdown.sort((a, b) => b.totalAmount - a.totalAmount);
  }

  /**
   * Calculate spending trend for category
   */
  private calculateTrend(transactions: Transaction[]): 'increasing' | 'stable' | 'decreasing' {
    if (transactions.length < 4) return 'stable';

    // Sort by date
    const sorted = transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Split into two halves
    const midpoint = Math.floor(sorted.length / 2);
    const firstHalf = sorted.slice(0, midpoint);
    const secondHalf = sorted.slice(midpoint);

    const firstAvg = firstHalf.reduce((sum, t) => sum + t.amount, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, t) => sum + t.amount, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (change > 10) return 'increasing';
    if (change < -10) return 'decreasing';
    return 'stable';
  }

  /**
   * Detect spending patterns
   */
  detectPatterns(): SpendingPattern[] {
    const patterns: SpendingPattern[] = [];

    patterns.push(...this.detectSubscriptionCreep());
    patterns.push(...this.detectConveniencePremiums());
    patterns.push(...this.detectMicroTransactions());
    patterns.push(...this.detectWeekendOverspending());
    patterns.push(...this.detectPaydayEffect());
    patterns.push(...this.detectEmotionalSpending());

    return patterns;
  }

  /**
   * Detect subscription creep pattern
   */
  private detectSubscriptionCreep(): SpendingPattern[] {
    const subscriptions = this.transactions.filter(t =>
      t.category === CategoryType.SUBSCRIPTIONS ||
      this.detectRecurring(t)
    );

    if (subscriptions.length === 0) return [];

    const totalAmount = subscriptions.reduce((sum, t) => sum + t.amount, 0);
    const monthlyAmount = totalAmount / (this.getDateRange() / 30);

    // Group by merchant
    const merchantGroups = new Map<string, Transaction[]>();
    subscriptions.forEach(t => {
      const merchant = t.merchant || 'Unknown';
      if (!merchantGroups.has(merchant)) {
        merchantGroups.set(merchant, []);
      }
      merchantGroups.get(merchant)!.push(t);
    });

    const severity = monthlyAmount > 200 ? 'high' : monthlyAmount > 100 ? 'medium' : 'low';

    return [{
      type: PatternType.SUBSCRIPTION_CREEP,
      description: `${merchantGroups.size} active subscriptions costing $${monthlyAmount.toFixed(2)}/month`,
      frequency: subscriptions.length,
      averageAmount: totalAmount / subscriptions.length,
      totalAmount,
      transactions: subscriptions,
      severity,
      recommendation: `Review all subscriptions. Cancel unused services. Consider rotating streaming services instead of maintaining all simultaneously.`
    }];
  }

  /**
   * Detect convenience premium patterns
   */
  private detectConveniencePremiums(): SpendingPattern[] {
    const convenienceTransactions = this.transactions.filter(t => {
      const searchText = `${t.description} ${t.merchant || ''}`;
      return /delivery|convenience|expedited|rush|premium/i.test(searchText);
    });

    if (convenienceTransactions.length === 0) return [];

    const totalAmount = convenienceTransactions.reduce((sum, t) => sum + t.amount, 0);
    const severity = totalAmount > 200 ? 'high' : totalAmount > 100 ? 'medium' : 'low';

    return [{
      type: PatternType.CONVENIENCE_PREMIUM,
      description: `Spending $${totalAmount.toFixed(2)} on convenience fees and delivery charges`,
      frequency: convenienceTransactions.length,
      averageAmount: totalAmount / convenienceTransactions.length,
      totalAmount,
      transactions: convenienceTransactions,
      severity,
      recommendation: `Batch errands to reduce delivery fees. Cook meals in advance. Use free pickup options instead of delivery.`
    }];
  }

  /**
   * Detect micro-transaction patterns
   */
  private detectMicroTransactions(): SpendingPattern[] {
    const microTransactions = this.transactions.filter(t =>
      t.amount > 0 && t.amount < 10 &&
      t.category === CategoryType.DISCRETIONARY
    );

    if (microTransactions.length < 10) return [];

    const totalAmount = microTransactions.reduce((sum, t) => sum + t.amount, 0);
    const severity = totalAmount > 200 ? 'high' : totalAmount > 100 ? 'medium' : 'low';

    return [{
      type: PatternType.MICRO_TRANSACTION,
      description: `${microTransactions.length} small purchases totaling $${totalAmount.toFixed(2)} ("latte factor")`,
      frequency: microTransactions.length,
      averageAmount: totalAmount / microTransactions.length,
      totalAmount,
      transactions: microTransactions,
      severity,
      recommendation: `These small purchases add up significantly. Implement a 24-hour rule for non-essential purchases under $10.`
    }];
  }

  /**
   * Detect weekend overspending pattern
   */
  private detectWeekendOverspending(): SpendingPattern[] {
    const weekendTxns = this.transactions.filter(t => {
      const day = t.date.getDay();
      return day === 0 || day === 6; // Sunday or Saturday
    });

    const weekdayTxns = this.transactions.filter(t => {
      const day = t.date.getDay();
      return day >= 1 && day <= 5;
    });

    if (weekendTxns.length === 0) return [];

    const weekendAvg = weekendTxns.reduce((sum, t) => sum + t.amount, 0) / weekendTxns.length;
    const weekdayAvg = weekdayTxns.reduce((sum, t) => sum + t.amount, 0) / weekdayTxns.length;

    // Check if weekend spending is significantly higher
    if (weekendAvg <= weekdayAvg * 1.3) return [];

    const totalAmount = weekendTxns.reduce((sum, t) => sum + t.amount, 0);
    const severity = weekendAvg > weekdayAvg * 2 ? 'high' : 'medium';

    return [{
      type: PatternType.WEEKEND_OVERSPEND,
      description: `Weekend spending averages $${weekendAvg.toFixed(2)} vs $${weekdayAvg.toFixed(2)} on weekdays`,
      frequency: weekendTxns.length,
      averageAmount: weekendAvg,
      totalAmount,
      transactions: weekendTxns,
      severity,
      recommendation: `Plan free or low-cost weekend activities. Set a weekend spending limit. Avoid impulse shopping trips.`
    }];
  }

  /**
   * Detect payday effect (overspending right after income)
   */
  private detectPaydayEffect(): SpendingPattern[] {
    const incomeTransactions = this.transactions
      .filter(t => t.category === CategoryType.INCOME)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (incomeTransactions.length === 0) return [];

    const paydaySpending: Transaction[] = [];

    incomeTransactions.forEach(income => {
      // Get transactions in 3 days after payday
      const paydayDate = income.date.getTime();
      const threeDaysLater = paydayDate + (3 * 24 * 60 * 60 * 1000);

      const postPaydayTxns = this.transactions.filter(t =>
        t.date.getTime() > paydayDate &&
        t.date.getTime() <= threeDaysLater &&
        t.amount > 0
      );

      paydaySpending.push(...postPaydayTxns);
    });

    if (paydaySpending.length === 0) return [];

    const totalAmount = paydaySpending.reduce((sum, t) => sum + t.amount, 0);
    const avgPerPayday = totalAmount / incomeTransactions.length;
    const severity = avgPerPayday > 500 ? 'high' : avgPerPayday > 200 ? 'medium' : 'low';

    return [{
      type: PatternType.PAYDAY_EFFECT,
      description: `Averaging $${avgPerPayday.toFixed(2)} in spending within 3 days of each payday`,
      frequency: paydaySpending.length,
      averageAmount: totalAmount / paydaySpending.length,
      totalAmount,
      transactions: paydaySpending,
      severity,
      recommendation: `Automate savings immediately upon receiving income. Create a cooling-off period before discretionary purchases.`
    }];
  }

  /**
   * Detect emotional spending patterns (clustering of purchases)
   */
  private detectEmotionalSpending(): SpendingPattern[] {
    // Look for days with unusually high transaction counts in discretionary categories
    const discretionaryTxns = this.transactions.filter(t =>
      t.category === CategoryType.SHOPPING ||
      t.category === CategoryType.DINING_OUT ||
      t.category === CategoryType.ENTERTAINMENT
    );

    // Group by date
    const dailyGroups = new Map<string, Transaction[]>();
    discretionaryTxns.forEach(t => {
      const dateKey = t.date.toISOString().split('T')[0];
      if (!dailyGroups.has(dateKey)) {
        dailyGroups.set(dateKey, []);
      }
      dailyGroups.get(dateKey)!.push(t);
    });

    // Find days with 4+ discretionary transactions
    const emotionalSpendingDays: Transaction[] = [];
    dailyGroups.forEach(txns => {
      if (txns.length >= 4) {
        emotionalSpendingDays.push(...txns);
      }
    });

    if (emotionalSpendingDays.length === 0) return [];

    const totalAmount = emotionalSpendingDays.reduce((sum, t) => sum + t.amount, 0);
    const severity = emotionalSpendingDays.length > 20 ? 'high' : 'medium';

    return [{
      type: PatternType.EMOTIONAL_SPENDING,
      description: `${dailyGroups.size} days with clustering of discretionary purchases, totaling $${totalAmount.toFixed(2)}`,
      frequency: emotionalSpendingDays.length,
      averageAmount: totalAmount / emotionalSpendingDays.length,
      totalAmount,
      transactions: emotionalSpendingDays,
      severity,
      recommendation: `Identify emotional triggers for spending. Implement a 24-48 hour waiting period. Find alternative coping mechanisms.`
    }];
  }

  /**
   * Get time-based spending patterns
   */
  getTimeBasedPatterns(): TimeBasedPattern[] {
    const patterns: TimeBasedPattern[] = [];

    // Day of week patterns
    for (let day = 0; day < 7; day++) {
      const dayTransactions = this.transactions.filter(t => t.date.getDay() === day);
      if (dayTransactions.length > 0) {
        const totalAmount = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
        patterns.push({
          dayOfWeek: day,
          pattern: `${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]} spending`,
          averageAmount: totalAmount / dayTransactions.length,
          frequency: dayTransactions.length
        });
      }
    }

    return patterns;
  }

  /**
   * Generate behavioral insights
   */
  getBehavioralInsights(): BehavioralInsight[] {
    const insights: BehavioralInsight[] = [];
    const patterns = this.detectPatterns();

    patterns.forEach(pattern => {
      let triggerType: 'temporal' | 'emotional' | 'social' | 'habitual';

      if (pattern.type === PatternType.WEEKEND_OVERSPEND || pattern.type === PatternType.PAYDAY_EFFECT) {
        triggerType = 'temporal';
      } else if (pattern.type === PatternType.EMOTIONAL_SPENDING) {
        triggerType = 'emotional';
      } else if (pattern.type === PatternType.SUBSCRIPTION_CREEP || pattern.type === PatternType.MICRO_TRANSACTION) {
        triggerType = 'habitual';
      } else {
        triggerType = 'social';
      }

      insights.push({
        insight: pattern.description,
        triggerType,
        affectedCategories: [...new Set(pattern.transactions.map(t => t.category!))],
        impactAmount: pattern.totalAmount,
        interventionStrategy: pattern.recommendation
      });
    });

    return insights;
  }

  /**
   * Helper: Get date range in days
   */
  private getDateRange(): number {
    if (this.transactions.length === 0) return 0;

    const dates = this.transactions.map(t => t.date.getTime());
    const min = Math.min(...dates);
    const max = Math.max(...dates);

    return (max - min) / (1000 * 60 * 60 * 24) || 1;
  }

  /**
   * Helper: Determine income level
   */
  private getIncomeLevel(): 'low' | 'medium' | 'high' {
    if (this.totalIncome === 0) return 'medium';
    const annualIncome = this.totalIncome * 12;

    if (annualIncome < 30000) return 'low';
    if (annualIncome < 75000) return 'medium';
    return 'high';
  }
}
