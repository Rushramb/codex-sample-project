/**
 * ExpenseOptimizer - Identifies unnecessary expenses and optimization opportunities
 */

import {
  Transaction,
  CategoryType,
  UnnecessaryExpense,
  Recommendation,
  SpendingPattern,
  PatternType
} from '../models/types';
import { CONVENIENCE_PREMIUM_MERCHANTS, BRAND_PREMIUM_CATEGORIES } from '../models/categoryConfig';

export class ExpenseOptimizer {
  private transactions: Transaction[];
  private patterns: SpendingPattern[];
  private totalIncome: number;

  constructor(transactions: Transaction[], patterns: SpendingPattern[], totalIncome: number = 0) {
    this.transactions = transactions;
    this.patterns = patterns;
    this.totalIncome = totalIncome;
  }

  /**
   * Identify all unnecessary expenses
   */
  identifyUnnecessaryExpenses(): UnnecessaryExpense[] {
    const expenses: UnnecessaryExpense[] = [];

    expenses.push(...this.identifySubscriptionWaste());
    expenses.push(...this.identifyConveniencePremiums());
    expenses.push(...this.identifyDuplicateServices());
    expenses.push(...this.identifyImpulseSpending());
    expenses.push(...this.identifyBrandPremiums());

    return expenses.sort((a, b) => b.savingsPotential - a.savingsPotential);
  }

  /**
   * Identify wasted subscription spending
   */
  private identifySubscriptionWaste(): UnnecessaryExpense[] {
    const expenses: UnnecessaryExpense[] = [];
    const subscriptionPattern = this.patterns.find(p => p.type === PatternType.SUBSCRIPTION_CREEP);

    if (!subscriptionPattern) return [];

    // Group subscriptions by merchant
    const merchantGroups = new Map<string, Transaction[]>();
    subscriptionPattern.transactions.forEach(t => {
      const merchant = t.merchant || 'Unknown';
      if (!merchantGroups.has(merchant)) {
        merchantGroups.set(merchant, []);
      }
      merchantGroups.get(merchant)!.push(t);
    });

    // Analyze each subscription
    merchantGroups.forEach((transactions, merchant) => {
      const monthlyAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
      const annualAmount = monthlyAmount * 12;

      // Calculate usage-based value (simplified - could be enhanced with actual usage data)
      const frequency = transactions.length;
      let recommendation = '';
      let savingsPotential = 0;
      let implementationEase: 'easy' | 'moderate' | 'difficult' = 'easy';

      // Streaming services
      if (/netflix|hulu|disney|hbo|apple.?tv|paramount/i.test(merchant)) {
        recommendation = `Consider rotating streaming services monthly instead of maintaining all simultaneously. Keep only 1-2 active at a time.`;
        savingsPotential = monthlyAmount * 0.7; // Could save 70% by rotation
        implementationEase = 'easy';
      }
      // Gym memberships
      else if (/gym|fitness|yoga|workout/i.test(merchant)) {
        recommendation = `Track actual gym visits. If less than 8 visits/month, consider canceling and using home workouts or pay-per-visit options.`;
        savingsPotential = frequency < 8 ? monthlyAmount : monthlyAmount * 0.5;
        implementationEase = 'moderate';
      }
      // Software subscriptions
      else if (/adobe|microsoft|software/i.test(merchant)) {
        recommendation = `Review if you're using all features. Consider switching to free alternatives or one-time purchase options.`;
        savingsPotential = monthlyAmount * 0.5;
        implementationEase = 'moderate';
      }
      // General subscriptions
      else {
        recommendation = `Review usage. If not used weekly, consider canceling.`;
        savingsPotential = monthlyAmount * 0.3;
      }

      expenses.push({
        id: `sub-${merchant}`,
        category: CategoryType.SUBSCRIPTIONS,
        merchant,
        monthlyAmount,
        annualAmount,
        type: 'subscription',
        description: `${merchant} subscription`,
        recommendation,
        savingsPotential,
        implementationEase,
        lifestyleImpact: 'minimal'
      });
    });

    return expenses;
  }

  /**
   * Identify convenience premium costs
   */
  private identifyConveniencePremiums(): UnnecessaryExpense[] {
    const expenses: UnnecessaryExpense[] = [];

    // Food delivery services
    const deliveryTransactions = this.transactions.filter(t => {
      const searchText = `${t.description} ${t.merchant || ''}`;
      return /doordash|uber.?eats|grubhub|postmates|delivery/i.test(searchText) &&
        t.category === CategoryType.DINING_OUT;
    });

    if (deliveryTransactions.length > 0) {
      const totalAmount = deliveryTransactions.reduce((sum, t) => sum + t.amount, 0);
      const monthlyAmount = totalAmount / (this.getDateRange() / 30);
      const annualAmount = monthlyAmount * 12;

      // Estimate that 30% of delivery cost is fees/tips vs restaurant price
      const savingsPotential = monthlyAmount * 0.30;

      expenses.push({
        id: 'conv-food-delivery',
        category: CategoryType.DINING_OUT,
        merchant: 'Food Delivery Services',
        monthlyAmount,
        annualAmount,
        type: 'convenience',
        description: `Food delivery service fees and tips`,
        recommendation: `Use pickup options or cook at home. Batch meal prep on weekends. Save delivery for special occasions only.`,
        savingsPotential,
        implementationEase: 'moderate',
        lifestyleImpact: 'moderate'
      });
    }

    // ATM fees
    const atmFees = this.transactions.filter(t =>
      /atm.?fee|withdrawal.?fee/i.test(t.description)
    );

    if (atmFees.length > 0) {
      const totalAmount = atmFees.reduce((sum, t) => sum + t.amount, 0);
      const monthlyAmount = totalAmount / (this.getDateRange() / 30);

      expenses.push({
        id: 'conv-atm-fees',
        category: CategoryType.UTILITIES,
        merchant: 'ATM Fees',
        monthlyAmount,
        annualAmount: monthlyAmount * 12,
        type: 'convenience',
        description: `ATM withdrawal fees`,
        recommendation: `Use your bank's ATMs exclusively, or switch to a bank with fee reimbursement. Get cash back at grocery stores instead.`,
        savingsPotential: monthlyAmount, // Can eliminate entirely
        implementationEase: 'easy',
        lifestyleImpact: 'minimal'
      });
    }

    // Expedited shipping
    const expeditedShipping = this.transactions.filter(t =>
      /expedited|rush|overnight|express.?shipping/i.test(t.description)
    );

    if (expeditedShipping.length > 0) {
      const totalAmount = expeditedShipping.reduce((sum, t) => sum + t.amount, 0);
      const monthlyAmount = totalAmount / (this.getDateRange() / 30);

      expenses.push({
        id: 'conv-shipping',
        category: CategoryType.SHOPPING,
        merchant: 'Expedited Shipping',
        monthlyAmount,
        annualAmount: monthlyAmount * 12,
        type: 'convenience',
        description: `Expedited shipping charges`,
        recommendation: `Plan purchases in advance to use free standard shipping. Bundle orders to meet free shipping thresholds.`,
        savingsPotential: monthlyAmount * 0.8,
        implementationEase: 'easy',
        lifestyleImpact: 'minimal'
      });
    }

    return expenses;
  }

  /**
   * Identify duplicate services
   */
  private identifyDuplicateServices(): UnnecessaryExpense[] {
    const expenses: UnnecessaryExpense[] = [];

    // Find streaming service duplicates
    const streamingServices = this.transactions.filter(t =>
      /netflix|hulu|disney|hbo|apple.?tv|paramount|peacock|showtime/i.test(t.merchant || t.description)
    );

    const uniqueServices = new Set(streamingServices.map(t => t.merchant));
    if (uniqueServices.size >= 3) {
      const totalAmount = streamingServices.reduce((sum, t) => sum + t.amount, 0);
      const monthlyAmount = totalAmount / (this.getDateRange() / 30);

      expenses.push({
        id: 'dup-streaming',
        category: CategoryType.SUBSCRIPTIONS,
        merchant: 'Multiple Streaming Services',
        monthlyAmount,
        annualAmount: monthlyAmount * 12,
        type: 'duplicate',
        description: `${uniqueServices.size} simultaneous streaming subscriptions`,
        recommendation: `Rotate streaming services monthly. Keep 1-2 active, cancel others. Resubscribe when new content releases.`,
        savingsPotential: monthlyAmount * 0.6,
        implementationEase: 'easy',
        lifestyleImpact: 'minimal'
      });
    }

    // Find music service duplicates
    const musicServices = this.transactions.filter(t =>
      /spotify|apple.?music|youtube.?music|amazon.?music|tidal/i.test(t.merchant || t.description)
    );

    const uniqueMusicServices = new Set(musicServices.map(t => t.merchant));
    if (uniqueMusicServices.size >= 2) {
      const totalAmount = musicServices.reduce((sum, t) => sum + t.amount, 0);
      const monthlyAmount = totalAmount / (this.getDateRange() / 30);

      expenses.push({
        id: 'dup-music',
        category: CategoryType.SUBSCRIPTIONS,
        merchant: 'Multiple Music Services',
        monthlyAmount,
        annualAmount: monthlyAmount * 12,
        type: 'duplicate',
        description: `${uniqueMusicServices.size} music streaming subscriptions`,
        recommendation: `Choose one primary music service and cancel others. Most services have similar content libraries.`,
        savingsPotential: monthlyAmount * 0.5,
        implementationEase: 'easy',
        lifestyleImpact: 'minimal'
      });
    }

    return expenses;
  }

  /**
   * Identify impulse spending
   */
  private identifyImpulseSpending(): UnnecessaryExpense[] {
    const expenses: UnnecessaryExpense[] = [];

    // Small, frequent purchases at convenience stores
    const convenienceStoreSpending = this.transactions.filter(t =>
      /7-eleven|circle.?k|convenience|corner.?store/i.test(t.merchant || t.description) &&
      t.amount < 20
    );

    if (convenienceStoreSpending.length > 10) {
      const totalAmount = convenienceStoreSpending.reduce((sum, t) => sum + t.amount, 0);
      const monthlyAmount = totalAmount / (this.getDateRange() / 30);

      expenses.push({
        id: 'imp-convenience',
        category: CategoryType.SHOPPING,
        merchant: 'Convenience Stores',
        monthlyAmount,
        annualAmount: monthlyAmount * 12,
        type: 'impulse',
        description: `${convenienceStoreSpending.length} small convenience store purchases`,
        recommendation: `Shop at grocery stores instead. Stock up on snacks and drinks at home. Bring lunch and drinks from home.`,
        savingsPotential: monthlyAmount * 0.7, // Significant savings vs grocery prices
        implementationEase: 'moderate',
        lifestyleImpact: 'minimal'
      });
    }

    // Late-night food orders (likely impulse)
    const lateNightOrders = this.transactions.filter(t => {
      const hour = t.date.getHours();
      return hour >= 22 || hour <= 2 && t.category === CategoryType.DINING_OUT;
    });

    if (lateNightOrders.length > 5) {
      const totalAmount = lateNightOrders.reduce((sum, t) => sum + t.amount, 0);
      const monthlyAmount = totalAmount / (this.getDateRange() / 30);

      expenses.push({
        id: 'imp-late-night',
        category: CategoryType.DINING_OUT,
        merchant: 'Late Night Food',
        monthlyAmount,
        annualAmount: monthlyAmount * 12,
        type: 'impulse',
        description: `${lateNightOrders.length} late-night food orders`,
        recommendation: `Keep healthy snacks at home. Eat dinner earlier. Set app timers to prevent late-night ordering.`,
        savingsPotential: monthlyAmount * 0.8,
        implementationEase: 'moderate',
        lifestyleImpact: 'minimal'
      });
    }

    return expenses;
  }

  /**
   * Identify brand premium opportunities
   */
  private identifyBrandPremiums(): UnnecessaryExpense[] {
    const expenses: UnnecessaryExpense[] = [];

    // Grocery brand premiums
    const grocerySpending = this.transactions.filter(t => t.category === CategoryType.GROCERIES);
    const totalGroceryAmount = grocerySpending.reduce((sum, t) => sum + t.amount, 0);
    const monthlyGroceryAmount = totalGroceryAmount / (this.getDateRange() / 30);

    if (monthlyGroceryAmount > 400) {
      // Estimate 20% savings potential by switching to store brands
      const savingsPotential = monthlyGroceryAmount * 0.20;

      expenses.push({
        id: 'brand-grocery',
        category: CategoryType.GROCERIES,
        merchant: 'Grocery Shopping',
        monthlyAmount: monthlyGroceryAmount,
        annualAmount: monthlyGroceryAmount * 12,
        type: 'premium',
        description: `Potential brand premium in grocery spending`,
        recommendation: `Try store/generic brands for staples (milk, bread, canned goods, cleaning supplies). Most are identical quality at 20-40% lower cost.`,
        savingsPotential,
        implementationEase: 'easy',
        lifestyleImpact: 'minimal'
      });
    }

    // Coffee shop spending (vs making at home)
    const coffeeShops = this.transactions.filter(t =>
      /starbucks|dunkin|coffee|cafe/i.test(t.merchant || t.description) &&
      t.amount < 15
    );

    if (coffeeShops.length > 10) {
      const totalAmount = coffeeShops.reduce((sum, t) => sum + t.amount, 0);
      const monthlyAmount = totalAmount / (this.getDateRange() / 30);

      // Coffee at home costs ~$0.50 vs $5 at shop
      const savingsPotential = monthlyAmount * 0.85;

      expenses.push({
        id: 'brand-coffee',
        category: CategoryType.DINING_OUT,
        merchant: 'Coffee Shops',
        monthlyAmount,
        annualAmount: monthlyAmount * 12,
        type: 'premium',
        description: `${coffeeShops.length} coffee shop purchases (classic "latte factor")`,
        recommendation: `Invest in a quality coffee maker ($50-200) and make coffee at home. Brings cost to ~$0.50 per cup vs $5+. Save coffee shops for social occasions.`,
        savingsPotential,
        implementationEase: 'easy',
        lifestyleImpact: 'minimal'
      });
    }

    return expenses;
  }

  /**
   * Generate prioritized recommendations
   */
  generateRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const expenses = this.identifyUnnecessaryExpenses();

    // Immediate actions (quick wins)
    const immediateExpenses = expenses
      .filter(e => e.implementationEase === 'easy' && e.savingsPotential > 20)
      .slice(0, 5);

    immediateExpenses.forEach((expense, index) => {
      recommendations.push({
        id: `imm-${index}`,
        priority: 'immediate',
        category: 'Quick Wins',
        title: `Cancel/Reduce: ${expense.merchant}`,
        description: expense.recommendation,
        estimatedSavings: expense.savingsPotential,
        implementationSteps: this.getImplementationSteps(expense),
        timeframe: '1 week',
        effort: 'low',
        impact: expense.savingsPotential > 100 ? 'high' : 'medium'
      });
    });

    // Short-term optimizations
    const shortTermExpenses = expenses
      .filter(e => e.implementationEase === 'moderate')
      .slice(0, 5);

    shortTermExpenses.forEach((expense, index) => {
      recommendations.push({
        id: `short-${index}`,
        priority: 'short-term',
        category: 'Behavioral Changes',
        title: `Optimize: ${expense.merchant}`,
        description: expense.recommendation,
        estimatedSavings: expense.savingsPotential,
        implementationSteps: this.getImplementationSteps(expense),
        timeframe: '1 month',
        effort: 'medium',
        impact: expense.savingsPotential > 150 ? 'high' : 'medium'
      });
    });

    // Long-term strategies
    recommendations.push({
      id: 'long-1',
      priority: 'long-term',
      category: 'Financial Structure',
      title: 'Automate Savings',
      description: 'Set up automatic transfers to savings account immediately after receiving income, before spending opportunities arise.',
      estimatedSavings: this.totalIncome * 0.10, // 10% of income
      implementationSteps: [
        'Calculate target savings rate (aim for 20% of income)',
        'Set up automatic transfer on payday to separate savings account',
        'Start with 5-10% if 20% feels overwhelming',
        'Increase by 1% each month until you reach target'
      ],
      timeframe: '3-6 months',
      effort: 'low',
      impact: 'high'
    });

    recommendations.push({
      id: 'long-2',
      priority: 'long-term',
      category: 'Spending Psychology',
      title: 'Implement Purchase Cooling-Off Periods',
      description: 'Create friction for impulse purchases by requiring a waiting period before non-essential purchases.',
      estimatedSavings: this.calculateImpulseSpendingTotal() * 0.50,
      implementationSteps: [
        '24-hour rule for purchases under $50',
        '48-hour rule for purchases $50-200',
        '1-week rule for purchases over $200',
        'Keep a "want list" and review monthly',
        'Remove saved payment methods from frequent impulse sites'
      ],
      timeframe: '2-3 months to establish habit',
      effort: 'medium',
      impact: 'high'
    });

    return recommendations;
  }

  /**
   * Get implementation steps for an expense
   */
  private getImplementationSteps(expense: UnnecessaryExpense): string[] {
    const steps: string[] = [];

    switch (expense.type) {
      case 'subscription':
        steps.push(`Log into ${expense.merchant} account or call customer service`);
        steps.push('Navigate to billing/subscription settings');
        steps.push('Cancel subscription or downgrade to lower tier');
        steps.push('Confirm cancellation email received');
        steps.push('Check bank statement next month to verify cancellation');
        break;

      case 'convenience':
        steps.push('Identify your top convenience spending triggers');
        steps.push('Create alternative solutions (meal prep, plan ahead, etc.)');
        steps.push('Set weekly/monthly limits for convenience spending');
        steps.push('Track progress and adjust as needed');
        break;

      case 'duplicate':
        steps.push('List all similar services you currently pay for');
        steps.push('Compare features and choose the best one');
        steps.push('Cancel duplicates following subscription cancellation steps');
        steps.push('Set calendar reminder to review in 3 months');
        break;

      case 'impulse':
        steps.push('Delete shopping apps from phone');
        steps.push('Unsubscribe from promotional emails');
        steps.push('Implement 24-hour waiting period for purchases');
        steps.push('Keep list of alternatives (free activities, home options)');
        break;

      case 'premium':
        steps.push('Research lower-cost alternatives');
        steps.push('Try alternatives for 2-4 weeks');
        steps.push('Evaluate if quality/satisfaction is comparable');
        steps.push('Fully switch if satisfied, or try next alternative');
        break;
    }

    return steps;
  }

  /**
   * Calculate total impulse spending
   */
  private calculateImpulseSpendingTotal(): number {
    const impulsePattern = this.patterns.find(p =>
      p.type === PatternType.MICRO_TRANSACTION ||
      p.type === PatternType.EMOTIONAL_SPENDING
    );

    return impulsePattern ? impulsePattern.totalAmount : 0;
  }

  /**
   * Helper: Get date range in days
   */
  private getDateRange(): number {
    if (this.transactions.length === 0) return 30;

    const dates = this.transactions.map(t => t.date.getTime());
    const min = Math.min(...dates);
    const max = Math.max(...dates);

    return (max - min) / (1000 * 60 * 60 * 24) || 30;
  }

  /**
   * Calculate total savings opportunity
   */
  getTotalSavingsOpportunity(): {
    monthly: number;
    annual: number;
    byCategory: { [key: string]: number };
  } {
    const expenses = this.identifyUnnecessaryExpenses();
    const monthly = expenses.reduce((sum, e) => sum + e.savingsPotential, 0);

    const byCategory: { [key: string]: number } = {};
    expenses.forEach(e => {
      const cat = e.category;
      byCategory[cat] = (byCategory[cat] || 0) + e.savingsPotential;
    });

    return {
      monthly,
      annual: monthly * 12,
      byCategory
    };
  }
}
