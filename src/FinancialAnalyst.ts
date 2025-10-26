/**
 * FinancialAnalyst - Main orchestrator class for personal financial analysis
 */

import {
  Transaction,
  AnalysisResult,
  AnalysisSummary,
  CategoryType,
  FinancialMetrics,
  ExpenseLevel
} from './models/types';
import { TransactionAnalyzer } from './analyzers/TransactionAnalyzer';
import { ExpenseOptimizer } from './optimizers/ExpenseOptimizer';
import { BudgetStrategyGenerator } from './strategies/BudgetStrategyGenerator';
import { ReportGenerator } from './reports/ReportGenerator';

export class FinancialAnalyst {
  private transactions: Transaction[];
  private totalIncome: number;
  private analyzer: TransactionAnalyzer;
  private optimizer: ExpenseOptimizer | null = null;
  private budgetGenerator: BudgetStrategyGenerator | null = null;

  constructor(transactions: Transaction[], totalIncome: number = 0) {
    this.transactions = transactions;
    this.totalIncome = totalIncome || this.calculateIncome(transactions);
    this.analyzer = new TransactionAnalyzer(transactions, this.totalIncome);
  }

  /**
   * Perform complete financial analysis
   */
  async analyze(): Promise<AnalysisResult> {
    console.log('🔍 Starting financial analysis...\n');

    // Phase 1: Categorize transactions
    console.log('📊 Phase 1: Categorizing transactions...');
    this.analyzer.categorizeAll();
    console.log(`✓ Categorized ${this.transactions.length} transactions\n`);

    // Mark recurring transactions
    this.transactions.forEach(t => {
      t.isRecurring = this.analyzer.detectRecurring(t);
    });

    // Phase 2: Analyze spending patterns
    console.log('🔍 Phase 2: Detecting spending patterns...');
    const patterns = this.analyzer.detectPatterns();
    console.log(`✓ Identified ${patterns.length} spending patterns\n`);

    // Phase 3: Get category breakdown
    console.log('📈 Phase 3: Analyzing category breakdown...');
    const categoryBreakdown = this.analyzer.getCategoryBreakdown();
    console.log(`✓ Analyzed ${categoryBreakdown.length} categories\n`);

    // Phase 4: Identify unnecessary expenses
    console.log('💸 Phase 4: Identifying optimization opportunities...');
    this.optimizer = new ExpenseOptimizer(this.transactions, patterns, this.totalIncome);
    const unnecessaryExpenses = this.optimizer.identifyUnnecessaryExpenses();
    console.log(`✓ Found ${unnecessaryExpenses.length} optimization opportunities\n`);

    // Phase 5: Generate recommendations
    console.log('💡 Phase 5: Generating recommendations...');
    const recommendations = this.optimizer.generateRecommendations();
    console.log(`✓ Created ${recommendations.length} actionable recommendations\n`);

    // Phase 6: Create budget strategy
    console.log('🎯 Phase 6: Creating budget strategy...');
    this.budgetGenerator = new BudgetStrategyGenerator(
      this.totalIncome,
      categoryBreakdown,
      unnecessaryExpenses,
      this.transactions
    );
    const budget = this.budgetGenerator.createBudget();
    console.log(`✓ Budget strategy created\n`);

    // Calculate metrics
    console.log('📊 Phase 7: Calculating financial metrics...');
    const metrics = this.calculateMetrics(categoryBreakdown, patterns, unnecessaryExpenses);
    console.log(`✓ Metrics calculated\n`);

    // Create summary
    const summary = this.createSummary(categoryBreakdown, unnecessaryExpenses, metrics);

    const result: AnalysisResult = {
      summary,
      categoryBreakdown,
      patterns,
      unnecessaryExpenses,
      recommendations,
      budget,
      metrics
    };

    console.log('✅ Analysis complete!\n');

    return result;
  }

  /**
   * Generate comprehensive report
   */
  generateReport(analysisResult: AnalysisResult): ReportGenerator {
    if (!this.budgetGenerator) {
      throw new Error('Must run analyze() before generating report');
    }

    const budgetStrategy = this.budgetGenerator.generateStrategy();
    return new ReportGenerator(analysisResult, budgetStrategy);
  }

  /**
   * Quick analysis with immediate report
   */
  async quickAnalysis(): Promise<string> {
    const result = await this.analyze();
    const report = this.generateReport(result);
    return report.generateCompleteReport();
  }

  /**
   * Get specific insights
   */
  async getInsights(): Promise<{
    spendingPersonality: string;
    topSavingsOpportunities: string[];
    criticalActions: string[];
    monthlyProgress: string;
  }> {
    const result = await this.analyze();

    const topSavingsOpportunities = result.unnecessaryExpenses
      .slice(0, 5)
      .map(e => `Save $${e.savingsPotential.toFixed(2)}/month by: ${e.recommendation}`);

    const criticalActions = result.recommendations
      .filter(r => r.priority === 'immediate')
      .slice(0, 3)
      .map(r => r.title);

    const totalSavings = result.unnecessaryExpenses.reduce((sum, e) => sum + e.savingsPotential, 0);
    const monthlyProgress = `Current savings: $${result.summary.totalSavings.toFixed(2)} | ` +
      `Potential: +$${totalSavings.toFixed(2)} | ` +
      `New total: $${(result.summary.totalSavings + totalSavings).toFixed(2)}`;

    return {
      spendingPersonality: result.summary.spendingPersonality,
      topSavingsOpportunities,
      criticalActions,
      monthlyProgress
    };
  }

  /**
   * Export analysis to various formats
   */
  export(analysisResult: AnalysisResult, format: 'json' | 'csv' | 'text' = 'text'): string {
    const report = this.generateReport(analysisResult);

    switch (format) {
      case 'json':
        return report.exportJSON();
      case 'csv':
        return report.exportCSV();
      case 'text':
      default:
        return report.generateCompleteReport();
    }
  }

  /**
   * Get action roadmap
   */
  getRoadmap(): {
    thirtyDay: string[];
    sixtyDay: string[];
    ninetyDay: string[];
  } {
    if (!this.budgetGenerator) {
      throw new Error('Must run analyze() first');
    }

    return this.budgetGenerator.generateRoadmap();
  }

  /**
   * Get negotiation scripts
   */
  getNegotiationScripts(): Array<{
    service: string;
    script: string;
    tips: string[];
  }> {
    if (!this.budgetGenerator) {
      throw new Error('Must run analyze() first');
    }

    return this.budgetGenerator.generateNegotiationScripts();
  }

  /**
   * Calculate total income from transactions
   */
  private calculateIncome(transactions: Transaction[]): number {
    return Math.abs(
      transactions
        .filter(t => t.amount < 0) // Negative amounts are income
        .reduce((sum, t) => sum + t.amount, 0)
    );
  }

  /**
   * Create analysis summary
   */
  private createSummary(
    categoryBreakdown: any[],
    unnecessaryExpenses: any[],
    metrics: FinancialMetrics
  ): AnalysisSummary {
    const totalExpenses = categoryBreakdown
      .filter(c => c.category !== CategoryType.INCOME)
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const savingsCategory = categoryBreakdown.find(c => c.category === CategoryType.SAVINGS);
    const totalSavings = savingsCategory?.totalAmount || 0;

    const savingsRate = this.totalIncome > 0 ? totalSavings / this.totalIncome : 0;

    const totalIdentifiedSavings = unnecessaryExpenses.reduce((sum, e) => sum + e.savingsPotential, 0);

    const dates = this.transactions.map(t => t.date);
    const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;

    const topSavingsOpportunities = unnecessaryExpenses
      .sort((a, b) => b.savingsPotential - a.savingsPotential)
      .slice(0, 10);

    // Generate spending personality
    const spendingPersonality = this.budgetGenerator
      ? this.budgetGenerator.generateSpendingPersonality()
      : 'Analysis in progress';

    return {
      totalIncome: this.totalIncome,
      totalExpenses,
      totalSavings,
      savingsRate,
      totalIdentifiedSavings,
      analyzedPeriod: {
        startDate,
        endDate,
        days
      },
      topSavingsOpportunities,
      spendingPersonality
    };
  }

  /**
   * Calculate financial metrics
   */
  private calculateMetrics(
    categoryBreakdown: any[],
    patterns: any[],
    unnecessaryExpenses: any[]
  ): FinancialMetrics {
    const totalExpenses = categoryBreakdown
      .filter(c => c.category !== CategoryType.INCOME)
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const essentialExpenses = categoryBreakdown
      .filter(c => c.level === ExpenseLevel.ESSENTIAL || c.level === ExpenseLevel.SEMI_ESSENTIAL)
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const discretionaryExpenses = categoryBreakdown
      .filter(c => c.level === ExpenseLevel.DISCRETIONARY)
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const savingsCategory = categoryBreakdown.find(c => c.category === CategoryType.SAVINGS);
    const totalSavings = savingsCategory?.totalAmount || 0;
    const savingsRate = this.totalIncome > 0 ? totalSavings / this.totalIncome : 0;

    const debtPaymentCategory = categoryBreakdown.find(c => c.category === CategoryType.DEBT_PAYMENT);
    const debtPayment = debtPaymentCategory?.totalAmount || 0;
    const debtToIncomeRatio = this.totalIncome > 0 ? debtPayment / this.totalIncome : 0;

    // Emergency fund calculation (simplified)
    const monthlyExpenses = totalExpenses / (this.getDateRange() / 30);
    const emergencyFundMonths = totalSavings > 0 ? totalSavings / monthlyExpenses : 0;

    // Impulse spending
    const impulsePattern = patterns.find(p => p.type === 'Micro-Transaction Pattern' || p.type === 'Emotional Spending');
    const impulseTotal = impulsePattern?.totalAmount || 0;
    const impulseSpendingRatio = totalExpenses > 0 ? impulseTotal / totalExpenses : 0;

    // Subscription burden
    const subscriptionCategory = categoryBreakdown.find(c => c.category === CategoryType.SUBSCRIPTIONS);
    const subscriptionBurden = subscriptionCategory?.totalAmount || 0;

    // Convenience premium
    const convenienceExpenses = unnecessaryExpenses.filter(e => e.type === 'convenience');
    const conveniencePremiumCost = convenienceExpenses.reduce((sum, e) => sum + e.savingsPotential, 0);

    // Spending velocity (simplified)
    const spendingVelocity = this.calculateSpendingVelocity();

    return {
      essentialExpenseRatio: totalExpenses > 0 ? essentialExpenses / totalExpenses : 0,
      discretionaryExpenseRatio: totalExpenses > 0 ? discretionaryExpenses / totalExpenses : 0,
      savingsRate,
      debtToIncomeRatio,
      emergencyFundMonths,
      averageMonthlyExpenses: monthlyExpenses,
      spendingVelocity,
      impulseSpendingRatio,
      subscriptionBurden,
      conveniencePremiumCost
    };
  }

  /**
   * Calculate spending velocity (rate of change)
   */
  private calculateSpendingVelocity(): number {
    if (this.transactions.length < 10) return 1.0;

    const sorted = this.transactions
      .filter(t => t.amount > 0)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const midpoint = Math.floor(sorted.length / 2);
    const firstHalf = sorted.slice(0, midpoint);
    const secondHalf = sorted.slice(midpoint);

    const firstAvg = firstHalf.reduce((sum, t) => sum + t.amount, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, t) => sum + t.amount, 0) / secondHalf.length;

    return secondAvg / firstAvg;
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
   * Add new transactions for ongoing analysis
   */
  addTransactions(newTransactions: Transaction[]): void {
    this.transactions.push(...newTransactions);
    this.analyzer = new TransactionAnalyzer(this.transactions, this.totalIncome);
  }

  /**
   * Update income
   */
  updateIncome(income: number): void {
    this.totalIncome = income;
    this.analyzer = new TransactionAnalyzer(this.transactions, this.totalIncome);
  }

  /**
   * Get current transaction count
   */
  getTransactionCount(): number {
    return this.transactions.length;
  }

  /**
   * Get transactions by category
   */
  getTransactionsByCategory(category: CategoryType): Transaction[] {
    return this.transactions.filter(t => t.category === category);
  }

  /**
   * Get transactions by date range
   */
  getTransactionsByDateRange(startDate: Date, endDate: Date): Transaction[] {
    return this.transactions.filter(
      t => t.date >= startDate && t.date <= endDate
    );
  }
}
