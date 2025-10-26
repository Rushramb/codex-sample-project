/**
 * BudgetStrategyGenerator - Creates personalized budget frameworks and strategies
 */

import {
  Budget,
  BudgetStrategy,
  BudgetRule,
  BudgetAllocation,
  CategoryType,
  Transaction,
  CategoryBreakdown,
  ExpenseLevel,
  UnnecessaryExpense
} from '../models/types';
import { BUDGET_BENCHMARKS } from '../models/categoryConfig';

export class BudgetStrategyGenerator {
  private totalIncome: number;
  private currentSpending: CategoryBreakdown[];
  private unnecessaryExpenses: UnnecessaryExpense[];
  private transactions: Transaction[];

  constructor(
    totalIncome: number,
    currentSpending: CategoryBreakdown[],
    unnecessaryExpenses: UnnecessaryExpense[],
    transactions: Transaction[]
  ) {
    this.totalIncome = totalIncome;
    this.currentSpending = currentSpending;
    this.unnecessaryExpenses = unnecessaryExpenses;
    this.transactions = transactions;
  }

  /**
   * Generate a personalized budget strategy
   */
  generateStrategy(): BudgetStrategy {
    const savingsOpportunity = this.unnecessaryExpenses.reduce((sum, e) => sum + e.savingsPotential, 0);
    const currentSavingsRate = this.calculateCurrentSavingsRate();

    // Target 20% savings rate, or 10% more than current if already saving
    const targetSavingsRate = Math.max(0.20, currentSavingsRate + 0.10);
    const savingsTarget = this.totalIncome * targetSavingsRate;

    const strategy: BudgetStrategy = {
      name: 'Optimized Personal Budget',
      description: this.generateStrategyDescription(targetSavingsRate, savingsOpportunity),
      allocations: this.generateAllocations(savingsTarget),
      rules: this.generateBudgetRules(),
      savingsTarget,
      emergencyFundGoal: this.totalIncome * 6 // 6 months of expenses
    };

    return strategy;
  }

  /**
   * Generate budget allocations based on 50/30/20 rule with optimizations
   */
  private generateAllocations(savingsTarget: number): { [key in CategoryType]?: number } {
    const allocations: { [key in CategoryType]?: number } = {};
    const remainingAfterSavings = this.totalIncome - savingsTarget;

    // Get current spending by expense level
    const essentialSpending = this.currentSpending
      .filter(c => c.level === ExpenseLevel.ESSENTIAL || c.level === ExpenseLevel.SEMI_ESSENTIAL)
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const discretionarySpending = this.currentSpending
      .filter(c => c.level === ExpenseLevel.DISCRETIONARY)
      .reduce((sum, c) => sum + c.totalAmount, 0);

    // Calculate optimal allocations
    // Essentials: try to keep at ~50% of income
    const essentialTarget = this.totalIncome * 0.50;
    const essentialAdjustment = Math.min(essentialSpending, essentialTarget);

    // Discretionary: reduce based on identified savings
    const discretionarySavings = this.unnecessaryExpenses
      .filter(e => {
        const mapping = this.currentSpending.find(c => c.category === e.category);
        return mapping?.level === ExpenseLevel.DISCRETIONARY;
      })
      .reduce((sum, e) => sum + e.savingsPotential, 0);

    const discretionaryTarget = discretionarySpending - discretionarySavings;

    // Allocate to each category
    this.currentSpending.forEach(category => {
      const currentAmount = category.totalAmount;
      const categoryExpenses = this.unnecessaryExpenses.filter(e => e.category === category.category);
      const categorySavings = categoryExpenses.reduce((sum, e) => sum + e.savingsPotential, 0);

      // Reduce by identified savings
      let allocation = currentAmount - categorySavings;

      // Apply additional reductions for discretionary categories if needed
      if (category.level === ExpenseLevel.DISCRETIONARY) {
        // Further reduce by 10-20% for behavioral change
        allocation = allocation * 0.85;
      }

      allocations[category.category] = Math.max(0, allocation);
    });

    // Add savings allocation
    allocations[CategoryType.SAVINGS] = savingsTarget;

    return allocations;
  }

  /**
   * Generate budget rules and guidelines
   */
  private generateBudgetRules(): BudgetRule[] {
    const rules: BudgetRule[] = [];

    // Essential rule: Automate savings
    rules.push({
      type: 'automate',
      description: 'Automatically transfer savings on payday before spending',
      action: 'Set up automatic transfer to savings account for the day after payday',
      threshold: this.totalIncome * 0.20
    });

    // Spending limits for problematic categories
    const problematicCategories = this.currentSpending
      .filter(c => c.variance > 0 && c.level === ExpenseLevel.DISCRETIONARY)
      .sort((a, b) => b.variance - a.variance)
      .slice(0, 3);

    problematicCategories.forEach(category => {
      const categoryExpenses = this.unnecessaryExpenses.filter(e => e.category === category.category);
      const savings = categoryExpenses.reduce((sum, e) => sum + e.savingsPotential, 0);
      const newLimit = category.totalAmount - savings;

      rules.push({
        type: 'limit',
        category: category.category,
        description: `Hard limit for ${category.category}`,
        action: `Stop spending in this category when limit is reached`,
        threshold: newLimit
      });
    });

    // Alert rules for high-spending categories
    const highSpendingCategories = this.currentSpending
      .filter(c => c.percentage > 15 && c.level === ExpenseLevel.DISCRETIONARY)
      .slice(0, 2);

    highSpendingCategories.forEach(category => {
      rules.push({
        type: 'alert',
        category: category.category,
        description: `Alert when ${category.category} reaches 75% of budget`,
        action: 'Review recent transactions and consider alternatives',
        threshold: category.totalAmount * 0.75
      });
    });

    // No-spend challenges
    const challengeCategories = [
      CategoryType.DINING_OUT,
      CategoryType.SHOPPING,
      CategoryType.ENTERTAINMENT
    ];

    challengeCategories.forEach(category => {
      const hasCategory = this.currentSpending.find(c => c.category === category);
      if (hasCategory) {
        rules.push({
          type: 'challenge',
          category,
          description: `Weekly no-spend day for ${category}`,
          action: 'Choose one day per week with zero spending in this category'
        });
      }
    });

    // Impulse spending prevention
    rules.push({
      type: 'limit',
      description: '24-hour waiting period for non-essential purchases over $25',
      action: 'Add to wishlist and wait 24 hours before purchasing',
      threshold: 25
    });

    return rules;
  }

  /**
   * Create detailed budget with actual vs planned tracking
   */
  createBudget(): Budget {
    const strategy = this.generateStrategy();
    const budget: Budget = {
      totalIncome: this.totalIncome,
      categories: {},
      savingsGoal: strategy.savingsTarget,
      emergencyFundTarget: strategy.emergencyFundGoal
    };

    // Create allocations for each category
    Object.entries(strategy.allocations).forEach(([category, planned]) => {
      const categoryType = category as CategoryType;
      const current = this.currentSpending.find(c => c.category === categoryType);
      const actual = current?.totalAmount || 0;

      const allocation: BudgetAllocation = {
        planned: planned || 0,
        actual,
        variance: actual - (planned || 0),
        variancePercentage: planned ? ((actual - planned) / planned) * 100 : 0,
        limit: planned || 0
      };

      budget.categories[categoryType] = allocation;
    });

    return budget;
  }

  /**
   * Generate implementation roadmap (30/60/90 days)
   */
  generate Roadmap(): {
    thirtyDay: string[];
    sixtyDay: string[];
    ninetyDay: string[];
  } {
    return {
      thirtyDay: [
        'Set up automatic savings transfer',
        'Cancel identified unnecessary subscriptions',
        'Implement 24-hour purchase waiting period',
        'Remove saved payment methods from impulse shopping sites',
        'Start meal planning to reduce food delivery',
        'Create envelope budget for top 3 problem categories',
        'Download and set up budget tracking app'
      ],
      sixtyDay: [
        'Negotiate bills (insurance, phone, internet)',
        'Establish weekly no-spend days',
        'Build emergency fund to $1,000',
        'Switch to generic brands for groceries',
        'Find free alternatives for paid entertainment',
        'Review and adjust category limits based on first month',
        'Increase savings rate by 2%'
      ],
      ninetyDay: [
        'Emergency fund to 1 month of expenses',
        'Consolidate or eliminate duplicate services',
        'Establish consistent meal prep routine',
        'Reward yourself (non-monetarily) for progress',
        'Review all spending patterns and adjust budget',
        'Increase savings rate to 15-20%',
        'Plan next quarter\'s financial goals'
      ]
    };
  }

  /**
   * Generate envelope system for digital budgeting
   */
  generateEnvelopeSystem(): {
    category: CategoryType;
    weeklyLimit: number;
    monthlyLimit: number;
    trackingMethod: string;
  }[] {
    const envelopes: {
      category: CategoryType;
      weeklyLimit: number;
      monthlyLimit: number;
      trackingMethod: string;
    }[] = [];

    const strategy = this.generateStrategy();

    // Create envelopes for discretionary categories
    const discretionaryCategories = this.currentSpending.filter(
      c => c.level === ExpenseLevel.DISCRETIONARY
    );

    discretionaryCategories.forEach(category => {
      const monthlyLimit = strategy.allocations[category.category] || category.totalAmount;
      const weeklyLimit = monthlyLimit / 4;

      envelopes.push({
        category: category.category,
        weeklyLimit,
        monthlyLimit,
        trackingMethod: this.getTrackingMethod(category.category)
      });
    });

    return envelopes;
  }

  /**
   * Get recommended tracking method for category
   */
  private getTrackingMethod(category: CategoryType): string {
    switch (category) {
      case CategoryType.DINING_OUT:
        return 'Use cash or separate debit card. When envelope is empty, cook at home.';
      case CategoryType.SHOPPING:
        return 'Wishlist system with 48-hour waiting period. Track in app or spreadsheet.';
      case CategoryType.ENTERTAINMENT:
        return 'Pre-plan activities and allocate budget. Look for free alternatives when limit reached.';
      case CategoryType.SUBSCRIPTIONS:
        return 'Review monthly. Use subscription tracking app. Cancel before auto-renew if not used.';
      default:
        return 'Track spending in budget app with weekly check-ins.';
    }
  }

  /**
   * Generate spending personality profile
   */
  generateSpendingPersonality(): string {
    const totalSpending = this.currentSpending.reduce((sum, c) => sum + c.totalAmount, 0);
    const discretionarySpending = this.currentSpending
      .filter(c => c.level === ExpenseLevel.DISCRETIONARY)
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const discretionaryRatio = discretionarySpending / totalSpending;

    // Analyze spending patterns
    const hasSubscriptionIssue = this.unnecessaryExpenses.some(e => e.type === 'subscription');
    const hasConvenienceIssue = this.unnecessaryExpenses.some(e => e.type === 'convenience');
    const hasImpulseIssue = this.unnecessaryExpenses.some(e => e.type === 'impulse');

    let personality = '';

    if (discretionaryRatio > 0.40) {
      personality += 'High Discretionary Spender - ';
      if (hasImpulseIssue) {
        personality += 'You tend toward impulse purchases and emotional spending. ';
      }
      if (hasConvenienceIssue) {
        personality += 'You frequently pay for convenience, valuing time over money. ';
      }
    } else if (discretionaryRatio > 0.25) {
      personality += 'Moderate Spender - ';
    } else {
      personality += 'Frugal Spender - ';
    }

    if (hasSubscriptionIssue) {
      personality += 'You have subscription creep, accumulating services without regular review. ';
    }

    const savingsRate = this.calculateCurrentSavingsRate();
    if (savingsRate < 0.05) {
      personality += 'Low saver - you struggle to set aside money for future goals.';
    } else if (savingsRate < 0.15) {
      personality += 'Moderate saver - you save some but have room for improvement.';
    } else {
      personality += 'Strong saver - you prioritize future security.';
    }

    return personality;
  }

  /**
   * Calculate current savings rate
   */
  private calculateCurrentSavingsRate(): number {
    const savingsCategory = this.currentSpending.find(c => c.category === CategoryType.SAVINGS);
    const savings = savingsCategory?.totalAmount || 0;
    return this.totalIncome > 0 ? savings / this.totalIncome : 0;
  }

  /**
   * Generate strategy description
   */
  private generateStrategyDescription(targetSavingsRate: number, savingsOpportunity: number): string {
    return `Personalized budget strategy targeting ${(targetSavingsRate * 100).toFixed(0)}% savings rate. ` +
      `Identified $${savingsOpportunity.toFixed(2)}/month in optimization opportunities. ` +
      `Combines 50/30/20 rule baseline with behavioral interventions and automated systems.`;
  }

  /**
   * Generate negotiation scripts for common expenses
   */
  generateNegotiationScripts(): {
    service: string;
    script: string;
    tips: string[];
  }[] {
    return [
      {
        service: 'Cable/Internet',
        script: `"Hi, I'm a long-time customer and I'm reviewing my expenses. I see new customers get [specific promo rate]. ` +
          `I'd like to stay with your company, but I need a better rate. What promotions or discounts can you offer me?"`,
        tips: [
          'Call during business hours (better deals)',
          'Be polite but firm',
          'Mention competitor prices specifically',
          'Ask for retention department',
          'Be willing to actually switch if needed'
        ]
      },
      {
        service: 'Insurance (Auto/Home)',
        script: `"I'm shopping around for insurance and got quotes that are $X less than my current policy. ` +
          `I prefer to stay with you - can you match or beat this rate while maintaining my coverage?"`,
        tips: [
          'Get 3 competing quotes first',
          'Call annually to re-negotiate',
          'Ask about all available discounts',
          'Bundle policies for better rates',
          'Maintain good credit score (affects rates)'
        ]
      },
      {
        service: 'Phone Plan',
        script: `"I'm paying $X/month but barely use Y feature. Can we review my plan and find something that better fits my usage? ` +
          `I saw you offer a $Z plan - can I switch to that or something similar?"`,
        tips: [
          'Review your actual usage first',
          'Ask about prepaid or MVNO options',
          'Negotiate removal of unused features',
          'Mention switching to competitor',
          'Time for end of contract period'
        ]
      },
      {
        service: 'Gym Membership',
        script: `"I love this gym but the $X/month is straining my budget. Do you offer any discounted rates, ` +
          `corporate partnerships, or alternative payment plans I could use?"`,
        tips: [
          'Ask about off-peak memberships',
          'Look for annual payment discounts',
          'Check if employer offers discounts',
          'Consider downgrading tier',
          'Propose referring friends for discount'
        ]
      }
    ];
  }
}
