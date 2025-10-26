/**
 * Personal Financial Analyst - Main Entry Point
 *
 * A sophisticated personal financial analyst for expense tracking,
 * spending pattern analysis, and budget optimization.
 */

export { FinancialAnalyst } from './FinancialAnalyst';
export { TransactionAnalyzer } from './analyzers/TransactionAnalyzer';
export { ExpenseOptimizer } from './optimizers/ExpenseOptimizer';
export { BudgetStrategyGenerator } from './strategies/BudgetStrategyGenerator';
export { ReportGenerator } from './reports/ReportGenerator';

export * from './models/types';
export * from './models/categoryConfig';

// Utility exports
export { parseCSVTransactions, createTransaction } from './utils/transactionUtils';
