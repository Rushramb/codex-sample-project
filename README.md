# Personal Financial Analyst & Budget Optimization Expert

A sophisticated TypeScript framework for personal financial analysis, expense tracking, spending pattern detection, and budget optimization. This system conducts forensic analysis of bank transactions to identify unnecessary expenses, reveal hidden spending patterns, and provide actionable strategies for financial improvement.

## Features

### Core Capabilities

**Transaction Analysis & Categorization**
- Automatic categorization using merchant patterns, keywords, and MCCs
- Smart detection of recurring transactions
- Pattern recognition for spending behaviors
- Time-based spending analysis

**Spending Pattern Detection**
- Subscription creep identification
- Convenience premium tracking
- Micro-transaction aggregation ("latte factor")
- Weekend overspending detection
- Payday effect analysis
- Emotional spending patterns
- Duplicate service identification

**Expense Optimization**
- Identifies unnecessary expenses with savings potential
- Prioritizes opportunities by implementation ease and impact
- Generates specific, actionable recommendations
- Calculates monthly and annual savings opportunities

**Budget Strategy Generation**
- Creates personalized budget frameworks
- Implements 50/30/20 rule with customizations
- Generates envelope budgeting systems
- Provides negotiation scripts for common expenses
- Creates 30/60/90-day transformation roadmaps

**Comprehensive Reporting**
- Executive summary dashboards
- Category-by-category breakdowns
- Spending pattern insights
- Unnecessary expense reports
- Prioritized action plans
- Financial health metrics
- Multiple export formats (Text, JSON, CSV)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd codex-sample-project

# Install dependencies
npm install

# Build the project
npm run build
```

## Quick Start

### Basic Usage

```typescript
import { FinancialAnalyst, generateSampleTransactions } from './src';

// Load transactions
const transactions = generateSampleTransactions();
const monthlyIncome = 5000;

// Create analyst
const analyst = new FinancialAnalyst(transactions, monthlyIncome);

// Run complete analysis
const result = await analyst.analyze();

// Generate report
const report = analyst.generateReport(result);
console.log(report.generateCompleteReport());
```

### Import from CSV

```typescript
import { FinancialAnalyst, parseCSVTransactions } from './src';
import * as fs from 'fs';

// Read CSV file
const csvData = fs.readFileSync('transactions.csv', 'utf-8');
const transactions = parseCSVTransactions(csvData);

// Analyze
const analyst = new FinancialAnalyst(transactions, 5000);
const report = await analyst.quickAnalysis();
console.log(report);
```

### Create Custom Transactions

```typescript
import { FinancialAnalyst, createTransaction, PaymentMethod } from './src';

const transactions = [
  createTransaction(
    '1',
    new Date('2024-10-01'),
    'Salary',
    -5000,
    'Employer',
    undefined,
    PaymentMethod.TRANSFER
  ),
  createTransaction(
    '2',
    new Date('2024-10-05'),
    'Rent',
    1500,
    'Property Management',
    '6513',
    PaymentMethod.TRANSFER
  ),
  // ... add more transactions
];

const analyst = new FinancialAnalyst(transactions, 5000);
const result = await analyst.analyze();
```

## Architecture

### Project Structure

```
src/
├── models/
│   ├── types.ts                 # Core type definitions
│   └── categoryConfig.ts        # Category mappings and configurations
├── analyzers/
│   └── TransactionAnalyzer.ts   # Transaction categorization and pattern detection
├── optimizers/
│   └── ExpenseOptimizer.ts      # Expense optimization and recommendation engine
├── strategies/
│   └── BudgetStrategyGenerator.ts # Budget framework and strategy creation
├── reports/
│   └── ReportGenerator.ts       # Comprehensive report generation
├── utils/
│   └── transactionUtils.ts      # Transaction utilities and CSV parsing
└── FinancialAnalyst.ts          # Main orchestrator class
```

### Core Components

#### 1. FinancialAnalyst (Main Orchestrator)

The primary interface for conducting financial analysis.

```typescript
const analyst = new FinancialAnalyst(transactions, monthlyIncome);

// Full analysis
const result = await analyst.analyze();

// Quick insights
const insights = await analyst.getInsights();

// Export reports
const jsonExport = analyst.export(result, 'json');
const csvExport = analyst.export(result, 'csv');

// Get roadmap
const roadmap = analyst.getRoadmap();

// Get negotiation scripts
const scripts = analyst.getNegotiationScripts();
```

#### 2. TransactionAnalyzer

Handles transaction categorization and pattern detection.

```typescript
const analyzer = new TransactionAnalyzer(transactions, monthlyIncome);

// Categorize transactions
analyzer.categorizeAll();

// Detect patterns
const patterns = analyzer.detectPatterns();

// Get category breakdown
const breakdown = analyzer.getCategoryBreakdown();

// Get behavioral insights
const insights = analyzer.getBehavioralInsights();
```

#### 3. ExpenseOptimizer

Identifies unnecessary expenses and optimization opportunities.

```typescript
const optimizer = new ExpenseOptimizer(transactions, patterns, monthlyIncome);

// Find unnecessary expenses
const expenses = optimizer.identifyUnnecessaryExpenses();

// Generate recommendations
const recommendations = optimizer.generateRecommendations();

// Get savings opportunity
const savings = optimizer.getTotalSavingsOpportunity();
```

#### 4. BudgetStrategyGenerator

Creates personalized budget strategies and frameworks.

```typescript
const generator = new BudgetStrategyGenerator(
  monthlyIncome,
  categoryBreakdown,
  unnecessaryExpenses,
  transactions
);

// Generate strategy
const strategy = generator.generateStrategy();

// Create budget
const budget = generator.createBudget();

// Get roadmap
const roadmap = generator.generateRoadmap();

// Get spending personality
const personality = generator.generateSpendingPersonality();

// Get negotiation scripts
const scripts = generator.generateNegotiationScripts();
```

#### 5. ReportGenerator

Generates comprehensive analysis reports.

```typescript
const report = new ReportGenerator(analysisResult, budgetStrategy);

// Generate different report sections
const executiveSummary = report.generateExecutiveSummary();
const categoryAnalysis = report.generateCategoryAnalysis();
const patternsReport = report.generatePatternsReport();
const expensesReport = report.generateExpensesReport();
const actionPlan = report.generateActionPlan();
const budgetReport = report.generateBudgetReport();
const metricsReport = report.generateMetricsReport();

// Generate complete report
const completeReport = report.generateCompleteReport();

// Export formats
const jsonExport = report.exportJSON();
const csvExport = report.exportCSV();
```

## Data Models

### Transaction

```typescript
interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  merchant?: string;
  category?: CategoryType;
  subCategory?: string;
  isRecurring?: boolean;
  mcc?: string;
  paymentMethod?: PaymentMethod;
  tags?: string[];
}
```

### Categories

```typescript
enum CategoryType {
  // Essential
  HOUSING = 'Housing',
  UTILITIES = 'Utilities',
  INSURANCE = 'Insurance',

  // Semi-Essential
  GROCERIES = 'Groceries',
  TRANSPORTATION = 'Transportation',
  HEALTHCARE = 'Healthcare',

  // Discretionary
  DINING_OUT = 'Dining Out',
  ENTERTAINMENT = 'Entertainment',
  SUBSCRIPTIONS = 'Subscriptions',
  SHOPPING = 'Shopping',
  // ... more categories
}
```

### Analysis Result

```typescript
interface AnalysisResult {
  summary: AnalysisSummary;
  categoryBreakdown: CategoryBreakdown[];
  patterns: SpendingPattern[];
  unnecessaryExpenses: UnnecessaryExpense[];
  recommendations: Recommendation[];
  budget: Budget;
  metrics: FinancialMetrics;
}
```

## CSV Format

Expected CSV format for importing transactions:

```csv
Date,Description,Amount,Merchant,MCC,PaymentMethod
2024-10-01,Salary Deposit,-5000,Employer,,Bank Transfer
2024-10-05,Rent Payment,1500,Property Management,6513,Bank Transfer
2024-10-07,Grocery Shopping,150,Whole Foods,5411,Debit Card
```

- **Date**: ISO date format (YYYY-MM-DD)
- **Description**: Transaction description
- **Amount**: Positive for expenses, negative for income
- **Merchant**: Merchant/vendor name (optional)
- **MCC**: Merchant Category Code (optional)
- **PaymentMethod**: Payment method used (optional)

## Examples

### Example 1: Basic Analysis

```bash
npm run dev examples/basic-analysis.ts
```

Demonstrates:
- Loading sample transactions
- Running complete analysis
- Generating reports
- Saving to files

### Example 2: Custom Transactions

```bash
npm run dev examples/custom-transactions.ts
```

Demonstrates:
- Creating transactions manually
- Custom analysis
- Getting insights
- Negotiation scripts

### Example 3: CSV Import

```bash
npm run dev examples/csv-import.ts
```

Demonstrates:
- Importing from CSV
- Parsing transactions
- Quick analysis

## Key Features in Detail

### Spending Pattern Detection

The system automatically detects these problematic patterns:

1. **Subscription Creep**: Multiple subscriptions accumulating over time
2. **Convenience Premiums**: Excessive delivery fees, ATM charges, expedited shipping
3. **Micro-Transactions**: Small purchases that compound significantly
4. **Weekend Overspending**: Higher spending on weekends vs. weekdays
5. **Payday Effect**: Overspending immediately after receiving income
6. **Emotional Spending**: Clustering of discretionary purchases
7. **Duplicate Services**: Multiple similar services (e.g., streaming platforms)
8. **Brand Premiums**: Opportunities to switch to generic alternatives

### Budget Strategies

**50/30/20 Rule Implementation**
- 50% for needs (essential + semi-essential)
- 30% for wants (discretionary)
- 20% for savings

**Envelope System**
- Digital envelope budgeting for discretionary categories
- Weekly and monthly limits
- Recommended tracking methods

**Budget Rules**
- Automated savings transfers
- Category spending limits
- Alert thresholds
- No-spend challenges
- Purchase cooling-off periods

### Financial Metrics

Tracks key performance indicators:
- Savings rate
- Essential expense ratio
- Discretionary expense ratio
- Impulse spending ratio
- Emergency fund months
- Spending velocity
- Subscription burden
- Convenience premium cost

### Recommendations

Generates three tiers of recommendations:

1. **Immediate Actions** (Week 1): Quick wins with minimal effort
2. **Short-term Optimizations** (Month 1): Behavioral changes
3. **Long-term Strategies** (Months 2-6): Sustainable financial habits

Each recommendation includes:
- Estimated savings
- Implementation steps
- Timeframe
- Effort level
- Impact rating

### 90-Day Transformation Roadmap

**Days 1-30**: Quick wins and habit formation
- Set up automatic savings
- Cancel unnecessary subscriptions
- Implement purchase waiting periods
- Start meal planning

**Days 31-60**: Behavioral changes and optimization
- Negotiate bills
- Establish no-spend days
- Build emergency fund
- Switch to generic brands

**Days 61-90**: Long-term sustainability
- Achieve emergency fund milestones
- Consolidate services
- Establish meal prep routine
- Review and adjust budget

## API Reference

### FinancialAnalyst

```typescript
class FinancialAnalyst {
  constructor(transactions: Transaction[], totalIncome?: number)

  analyze(): Promise<AnalysisResult>
  generateReport(result: AnalysisResult): ReportGenerator
  quickAnalysis(): Promise<string>
  getInsights(): Promise<Insights>
  export(result: AnalysisResult, format: 'json' | 'csv' | 'text'): string
  getRoadmap(): Roadmap
  getNegotiationScripts(): NegotiationScript[]

  // Helpers
  addTransactions(transactions: Transaction[]): void
  updateIncome(income: number): void
  getTransactionCount(): number
  getTransactionsByCategory(category: CategoryType): Transaction[]
  getTransactionsByDateRange(start: Date, end: Date): Transaction[]
}
```

### Utility Functions

```typescript
// Transaction creation
createTransaction(
  id: string,
  date: Date,
  description: string,
  amount: number,
  merchant?: string,
  mcc?: string,
  paymentMethod?: PaymentMethod
): Transaction

// CSV parsing
parseCSVTransactions(csvData: string): Transaction[]

// Sample data
generateSampleTransactions(): Transaction[]

// Formatting
formatTransaction(transaction: Transaction): string
exportToCSV(transactions: Transaction[]): string
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run example
npm run dev examples/basic-analysis.ts

# Lint
npm run lint

# Format
npm run format
```

## Use Cases

1. **Personal Finance Management**: Track and optimize personal spending
2. **Budget Planning**: Create data-driven budgets based on actual spending
3. **Financial Goal Setting**: Identify savings opportunities to fund goals
4. **Spending Habit Analysis**: Understand psychological spending triggers
5. **Debt Reduction**: Find extra money to accelerate debt payoff
6. **Financial Health Assessment**: Get comprehensive financial metrics
7. **Expense Reporting**: Generate reports for tax purposes or financial planning

## Principles

This framework is built on key principles:

1. **Judgment-Free Analysis**: Direct about patterns without shame
2. **Actionable Insights**: Every recommendation includes specific steps
3. **Sustainable Changes**: Focus on long-term habits over extreme restrictions
4. **Quality of Life**: Balance financial optimization with lifestyle satisfaction
5. **Behavioral Economics**: Incorporate psychological insights into recommendations
6. **Data-Driven Decisions**: Base strategies on actual spending patterns
7. **Privacy-First**: All analysis happens locally, no data sharing

## Limitations

- Categorization accuracy depends on merchant name clarity
- Behavioral insights are estimates based on transaction patterns
- Savings estimates assume full implementation of recommendations
- Some patterns require longer transaction history for accuracy
- Manual transaction entry may be tedious for large datasets

## Future Enhancements

- Machine learning for improved categorization
- Integration with bank APIs for automatic transaction import
- Goal tracking and progress monitoring
- Investment analysis integration
- Bill negotiation automation
- Personalized financial coaching
- Mobile app interface
- Multi-user household budgeting
- Predictive spending forecasts

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit issues and pull requests.

## Support

For questions or issues, please open an issue on GitHub.

---

**Disclaimer**: This tool provides analysis and recommendations based on transaction data. It is not a substitute for professional financial advice. Always consult with a qualified financial advisor for personalized guidance.
