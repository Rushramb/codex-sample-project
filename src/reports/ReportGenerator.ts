/**
 * ReportGenerator - Creates comprehensive financial analysis reports
 */

import {
  AnalysisResult,
  AnalysisSummary,
  Transaction,
  CategoryBreakdown,
  SpendingPattern,
  UnnecessaryExpense,
  Recommendation,
  Budget,
  FinancialMetrics,
  BudgetStrategy,
  CategoryType,
  ExpenseLevel
} from '../models/types';

export class ReportGenerator {
  private analysisResult: AnalysisResult;
  private budgetStrategy: BudgetStrategy;

  constructor(analysisResult: AnalysisResult, budgetStrategy: BudgetStrategy) {
    this.analysisResult = analysisResult;
    this.budgetStrategy = budgetStrategy;
  }

  /**
   * Generate executive summary dashboard
   */
  generateExecutiveSummary(): string {
    const summary = this.analysisResult.summary;
    const savings = summary.totalIdentifiedSavings;

    let report = `
╔════════════════════════════════════════════════════════════════════════════╗
║                    FINANCIAL ANALYSIS EXECUTIVE SUMMARY                    ║
╚════════════════════════════════════════════════════════════════════════════╝

📊 ANALYSIS PERIOD
   ${this.formatDate(summary.analyzedPeriod.startDate)} - ${this.formatDate(summary.analyzedPeriod.endDate)} (${summary.analyzedPeriod.days} days)

💰 FINANCIAL SNAPSHOT
   Total Income:        $${summary.totalIncome.toFixed(2)}
   Total Expenses:      $${summary.totalExpenses.toFixed(2)}
   Current Savings:     $${summary.totalSavings.toFixed(2)}
   Savings Rate:        ${(summary.savingsRate * 100).toFixed(1)}%

🎯 OPTIMIZATION OPPORTUNITY
   Total Identified Savings:    $${savings.toFixed(2)}/month
   Annual Savings Potential:    $${(savings * 12).toFixed(2)}/year
   Improved Savings Rate:       ${(((summary.totalSavings + savings) / summary.totalIncome) * 100).toFixed(1)}%

`;

    // Top 5 Savings Opportunities
    report += `📈 TOP 5 IMMEDIATE ACTIONS\n`;
    summary.topSavingsOpportunities.slice(0, 5).forEach((opp, index) => {
      report += `   ${index + 1}. ${opp.merchant.padEnd(30)} Save $${opp.savingsPotential.toFixed(2)}/month\n`;
      report += `      → ${opp.recommendation}\n\n`;
    });

    // Spending Personality
    report += `🧠 YOUR SPENDING PERSONALITY\n`;
    report += `   ${summary.spendingPersonality}\n\n`;

    // 90-Day Transformation Roadmap
    report += `🗓️  90-DAY TRANSFORMATION ROADMAP\n`;
    report += `   Days 1-30:  Quick wins and habit formation\n`;
    report += `   Days 31-60: Behavioral changes and optimization\n`;
    report += `   Days 61-90: Long-term sustainability and goal achievement\n\n`;

    report += `═══════════════════════════════════════════════════════════════════════════\n`;

    return report;
  }

  /**
   * Generate detailed category analysis
   */
  generateCategoryAnalysis(): string {
    let report = `
╔════════════════════════════════════════════════════════════════════════════╗
║                         CATEGORY-BY-CATEGORY BREAKDOWN                     ║
╚════════════════════════════════════════════════════════════════════════════╝

`;

    const breakdown = this.analysisResult.categoryBreakdown;

    // Group by expense level
    const essential = breakdown.filter(c => c.level === ExpenseLevel.ESSENTIAL);
    const semiEssential = breakdown.filter(c => c.level === ExpenseLevel.SEMI_ESSENTIAL);
    const discretionary = breakdown.filter(c => c.level === ExpenseLevel.DISCRETIONARY);

    report += `🏠 ESSENTIAL EXPENSES (Housing, Insurance, Utilities)\n`;
    report += this.formatCategoryGroup(essential);

    report += `\n🛒 SEMI-ESSENTIAL EXPENSES (Groceries, Healthcare, Transportation)\n`;
    report += this.formatCategoryGroup(semiEssential);

    report += `\n🎭 DISCRETIONARY EXPENSES (Entertainment, Dining, Shopping)\n`;
    report += this.formatCategoryGroup(discretionary);

    return report;
  }

  /**
   * Format category group
   */
  private formatCategoryGroup(categories: CategoryBreakdown[]): string {
    let output = '';

    categories.forEach(cat => {
      const budgetAllocation = this.analysisResult.budget.categories[cat.category];
      const varianceSymbol = cat.variance > 0 ? '▲' : cat.variance < 0 ? '▼' : '=';
      const trendSymbol = cat.trend === 'increasing' ? '📈' : cat.trend === 'decreasing' ? '📉' : '➡️';

      output += `\n   ${cat.category.toUpperCase()}\n`;
      output += `   ├─ Total Spent:        $${cat.totalAmount.toFixed(2)} (${cat.percentage.toFixed(1)}% of total)\n`;
      output += `   ├─ Transactions:       ${cat.transactionCount} (avg: $${cat.averageTransaction.toFixed(2)})\n`;
      output += `   ├─ Trend:              ${trendSymbol} ${cat.trend}\n`;
      output += `   ├─ Benchmark:          $${cat.benchmark.toFixed(2)}\n`;
      output += `   ├─ Variance:           ${varianceSymbol} $${Math.abs(cat.variance).toFixed(2)} `;
      output += cat.variance > 0 ? '(over budget)\n' : cat.variance < 0 ? '(under budget)\n' : '\n';

      if (cat.topMerchants.length > 0) {
        output += `   └─ Top Merchants:\n`;
        cat.topMerchants.slice(0, 3).forEach((merchant, idx) => {
          const prefix = idx === cat.topMerchants.slice(0, 3).length - 1 ? '      └─' : '      ├─';
          output += `${prefix} ${merchant.merchant}: $${merchant.totalAmount.toFixed(2)} (${merchant.transactionCount} txns)\n`;
        });
      }
    });

    return output;
  }

  /**
   * Generate spending patterns report
   */
  generatePatternsReport(): string {
    let report = `
╔════════════════════════════════════════════════════════════════════════════╗
║                         SPENDING PATTERNS & INSIGHTS                       ║
╚════════════════════════════════════════════════════════════════════════════╝

`;

    const patterns = this.analysisResult.patterns;

    if (patterns.length === 0) {
      report += `✅ No problematic spending patterns detected. Great job!\n\n`;
      return report;
    }

    patterns.forEach(pattern => {
      const severityEmoji = pattern.severity === 'high' ? '🔴' : pattern.severity === 'medium' ? '🟡' : '🟢';

      report += `${severityEmoji} ${pattern.type.toUpperCase()} [${pattern.severity.toUpperCase()} SEVERITY]\n`;
      report += `   ${pattern.description}\n\n`;
      report += `   📊 Statistics:\n`;
      report += `      • Frequency:       ${pattern.frequency} occurrences\n`;
      report += `      • Average Amount:  $${pattern.averageAmount.toFixed(2)}\n`;
      report += `      • Total Impact:    $${pattern.totalAmount.toFixed(2)}\n\n`;
      report += `   💡 Recommendation:\n`;
      report += `      ${this.wrapText(pattern.recommendation, 6)}\n\n`;
      report += `   ───────────────────────────────────────────────────────────────────────\n\n`;
    });

    return report;
  }

  /**
   * Generate unnecessary expenses report
   */
  generateExpensesReport(): string {
    let report = `
╔════════════════════════════════════════════════════════════════════════════╗
║                      UNNECESSARY EXPENSE IDENTIFICATION                    ║
╚════════════════════════════════════════════════════════════════════════════╝

`;

    const expenses = this.analysisResult.unnecessaryExpenses;

    // Group by type
    const byType = new Map<string, UnnecessaryExpense[]>();
    expenses.forEach(exp => {
      if (!byType.has(exp.type)) {
        byType.set(exp.type, []);
      }
      byType.get(exp.type)!.push(exp);
    });

    const typeLabels = {
      subscription: '📱 SUBSCRIPTION WASTE',
      convenience: '🚀 CONVENIENCE PREMIUMS',
      duplicate: '👥 DUPLICATE SERVICES',
      impulse: '💸 IMPULSE SPENDING',
      premium: '💎 BRAND PREMIUMS'
    };

    byType.forEach((exps, type) => {
      report += `\n${typeLabels[type as keyof typeof typeLabels] || type.toUpperCase()}\n`;

      exps.forEach(exp => {
        const easeEmoji = exp.implementationEase === 'easy' ? '✅' : exp.implementationEase === 'moderate' ? '⚠️' : '🔧';

        report += `\n   ${easeEmoji} ${exp.merchant}\n`;
        report += `   ├─ Monthly Cost:       $${exp.monthlyAmount.toFixed(2)}\n`;
        report += `   ├─ Annual Cost:        $${exp.annualAmount.toFixed(2)}\n`;
        report += `   ├─ Savings Potential:  $${exp.savingsPotential.toFixed(2)}/month ($${(exp.savingsPotential * 12).toFixed(2)}/year)\n`;
        report += `   ├─ Ease:               ${exp.implementationEase}\n`;
        report += `   ├─ Lifestyle Impact:   ${exp.lifestyleImpact}\n`;
        report += `   └─ Action:\n`;
        report += `      ${this.wrapText(exp.recommendation, 6)}\n`;
      });

      report += `\n`;
    });

    // Total savings summary
    const totalSavings = expenses.reduce((sum, e) => sum + e.savingsPotential, 0);
    report += `\n💰 TOTAL MONTHLY SAVINGS OPPORTUNITY: $${totalSavings.toFixed(2)}\n`;
    report += `💰 TOTAL ANNUAL SAVINGS OPPORTUNITY:  $${(totalSavings * 12).toFixed(2)}\n\n`;

    return report;
  }

  /**
   * Generate recommendations action plan
   */
  generateActionPlan(): string {
    let report = `
╔════════════════════════════════════════════════════════════════════════════╗
║                       PRIORITIZED ACTION PLAN                              ║
╚════════════════════════════════════════════════════════════════════════════╝

`;

    const recommendations = this.analysisResult.recommendations;

    // Group by priority
    const immediate = recommendations.filter(r => r.priority === 'immediate');
    const shortTerm = recommendations.filter(r => r.priority === 'short-term');
    const longTerm = recommendations.filter(r => r.priority === 'long-term');

    report += `🚨 IMMEDIATE ACTIONS (Week 1)\n`;
    report += `   Complete these quick wins to start saving immediately:\n\n`;
    immediate.forEach((rec, idx) => {
      report += this.formatRecommendation(rec, idx + 1);
    });

    report += `\n📅 SHORT-TERM OPTIMIZATIONS (Month 1)\n`;
    report += `   Build on initial momentum with these behavioral changes:\n\n`;
    shortTerm.forEach((rec, idx) => {
      report += this.formatRecommendation(rec, idx + 1);
    });

    report += `\n🎯 LONG-TERM STRATEGIES (Months 2-6)\n`;
    report += `   Establish sustainable financial habits:\n\n`;
    longTerm.forEach((rec, idx) => {
      report += this.formatRecommendation(rec, idx + 1);
    });

    return report;
  }

  /**
   * Format a single recommendation
   */
  private formatRecommendation(rec: Recommendation, index: number): string {
    let output = `   ${index}. ${rec.title}\n`;
    output += `      💰 Potential Savings: $${rec.estimatedSavings.toFixed(2)}/month\n`;
    output += `      ⏱️  Timeframe: ${rec.timeframe}\n`;
    output += `      🎯 Effort: ${rec.effort} | Impact: ${rec.impact}\n\n`;
    output += `      ${this.wrapText(rec.description, 6)}\n\n`;

    if (rec.implementationSteps.length > 0) {
      output += `      Implementation Steps:\n`;
      rec.implementationSteps.forEach(step => {
        output += `      • ${step}\n`;
      });
      output += `\n`;
    }

    output += `      ───────────────────────────────────────────────────────────────\n\n`;
    return output;
  }

  /**
   * Generate budget framework report
   */
  generateBudgetReport(): string {
    let report = `
╔════════════════════════════════════════════════════════════════════════════╗
║                          OPTIMIZED BUDGET FRAMEWORK                        ║
╚════════════════════════════════════════════════════════════════════════════╝

${this.budgetStrategy.description}

📊 BUDGET ALLOCATIONS
   Monthly Income: $${this.analysisResult.summary.totalIncome.toFixed(2)}

`;

    // Show allocations
    Object.entries(this.budgetStrategy.allocations).forEach(([category, amount]) => {
      const percentage = (amount / this.analysisResult.summary.totalIncome) * 100;
      const current = this.analysisResult.budget.categories[category as CategoryType];

      report += `   ${category.padEnd(20)} $${amount.toFixed(2).padStart(10)} (${percentage.toFixed(1)}%)`;

      if (current) {
        const change = amount - current.actual;
        if (change < 0) {
          report += ` ↓ Reduce by $${Math.abs(change).toFixed(2)}`;
        } else if (change > 0) {
          report += ` ↑ Increase by $${change.toFixed(2)}`;
        }
      }
      report += `\n`;
    });

    report += `\n🎯 SAVINGS TARGET\n`;
    report += `   Monthly:     $${this.budgetStrategy.savingsTarget.toFixed(2)}\n`;
    report += `   Annual:      $${(this.budgetStrategy.savingsTarget * 12).toFixed(2)}\n`;
    report += `   Emergency:   $${this.budgetStrategy.emergencyFundGoal.toFixed(2)} (6 months)\n\n`;

    report += `📋 BUDGET RULES\n`;
    this.budgetStrategy.rules.forEach((rule, idx) => {
      const typeEmoji = {
        limit: '🚫',
        alert: '⚠️',
        automate: '🤖',
        challenge: '🏆'
      };

      report += `\n   ${typeEmoji[rule.type]} ${rule.description}\n`;
      report += `      ${this.wrapText(rule.action, 6)}\n`;

      if (rule.threshold) {
        report += `      Threshold: $${rule.threshold.toFixed(2)}\n`;
      }
    });

    return report;
  }

  /**
   * Generate metrics report
   */
  generateMetricsReport(): string {
    const metrics = this.analysisResult.metrics;

    let report = `
╔════════════════════════════════════════════════════════════════════════════╗
║                           FINANCIAL HEALTH METRICS                         ║
╚════════════════════════════════════════════════════════════════════════════╝

📊 KEY PERFORMANCE INDICATORS

   Savings Rate:                 ${(metrics.savingsRate * 100).toFixed(1)}% `;
    report += this.getRatingEmoji(metrics.savingsRate * 100, 20, 10) + `\n`;

    report += `   Essential Expense Ratio:      ${(metrics.essentialExpenseRatio * 100).toFixed(1)}% `;
    report += this.getRatingEmoji(100 - metrics.essentialExpenseRatio * 100, 50, 30) + `\n`;

    report += `   Discretionary Expense Ratio:  ${(metrics.discretionaryExpenseRatio * 100).toFixed(1)}% `;
    report += this.getRatingEmoji(100 - metrics.discretionaryExpenseRatio * 100, 70, 50) + `\n`;

    report += `   Impulse Spending Ratio:       ${(metrics.impulseSpendingRatio * 100).toFixed(1)}% `;
    report += this.getRatingEmoji(100 - metrics.impulseSpendingRatio * 100, 95, 85) + `\n`;

    report += `\n💰 MONTHLY AVERAGES\n`;
    report += `   Average Monthly Expenses:     $${metrics.averageMonthlyExpenses.toFixed(2)}\n`;
    report += `   Subscription Burden:          $${metrics.subscriptionBurden.toFixed(2)}\n`;
    report += `   Convenience Premium Cost:     $${metrics.conveniencePremiumCost.toFixed(2)}\n`;

    report += `\n📈 FINANCIAL HEALTH\n`;
    report += `   Emergency Fund:               ${metrics.emergencyFundMonths.toFixed(1)} months `;
    report += this.getRatingEmoji(metrics.emergencyFundMonths, 6, 3) + `\n`;

    report += `   Spending Velocity:            ${metrics.spendingVelocity.toFixed(2)} `;
    report += metrics.spendingVelocity > 1.1 ? '⚠️ (accelerating)' : '✅ (stable)';
    report += `\n\n`;

    return report;
  }

  /**
   * Generate complete comprehensive report
   */
  generateCompleteReport(): string {
    let report = '';

    report += this.generateExecutiveSummary();
    report += `\n\n`;
    report += this.generateCategoryAnalysis();
    report += `\n\n`;
    report += this.generatePatternsReport();
    report += `\n\n`;
    report += this.generateExpensesReport();
    report += `\n\n`;
    report += this.generateActionPlan();
    report += `\n\n`;
    report += this.generateBudgetReport();
    report += `\n\n`;
    report += this.generateMetricsReport();

    report += `\n\n`;
    report += `═══════════════════════════════════════════════════════════════════════════\n`;
    report += `              End of Financial Analysis Report\n`;
    report += `              Generated: ${new Date().toLocaleString()}\n`;
    report += `═══════════════════════════════════════════════════════════════════════════\n`;

    return report;
  }

  /**
   * Helper: Format date
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /**
   * Helper: Wrap text with indentation
   */
  private wrapText(text: string, indent: number): string {
    const maxWidth = 70;
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    const indentStr = ' '.repeat(indent);

    words.forEach(word => {
      if (currentLine.length + word.length + 1 <= maxWidth) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);

    return lines.map((line, idx) => (idx === 0 ? line : indentStr + line)).join('\n');
  }

  /**
   * Helper: Get rating emoji based on value
   */
  private getRatingEmoji(value: number, goodThreshold: number, okThreshold: number): string {
    if (value >= goodThreshold) return '✅ Excellent';
    if (value >= okThreshold) return '⚠️ Good';
    return '🔴 Needs Improvement';
  }

  /**
   * Export report to JSON
   */
  exportJSON(): string {
    return JSON.stringify({
      summary: this.analysisResult.summary,
      categoryBreakdown: this.analysisResult.categoryBreakdown,
      patterns: this.analysisResult.patterns,
      unnecessaryExpenses: this.analysisResult.unnecessaryExpenses,
      recommendations: this.analysisResult.recommendations,
      budget: this.analysisResult.budget,
      budgetStrategy: this.budgetStrategy,
      metrics: this.analysisResult.metrics,
      generatedAt: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Export report to CSV (simplified)
   */
  exportCSV(): string {
    let csv = 'Category,Amount,Percentage,Transactions,Trend,Variance\n';

    this.analysisResult.categoryBreakdown.forEach(cat => {
      csv += `"${cat.category}",${cat.totalAmount},${cat.percentage},${cat.transactionCount},"${cat.trend}",${cat.variance}\n`;
    });

    return csv;
  }
}
