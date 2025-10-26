/**
 * CSV Import Example
 *
 * This example demonstrates how to import transactions from a CSV file.
 */

import { FinancialAnalyst } from '../src/FinancialAnalyst';
import { parseCSVTransactions } from '../src/utils/transactionUtils';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('CSV Import Example\n');

  // Sample CSV data
  const sampleCSV = `Date,Description,Amount,Merchant,MCC,PaymentMethod
2024-10-01,Salary Deposit,-5000,Employer,,Bank Transfer
2024-10-05,Rent Payment,1500,Property Management,6513,Bank Transfer
2024-10-07,Grocery Shopping,150,Whole Foods,5411,Debit Card
2024-10-08,Coffee,6.50,Starbucks,5812,Credit Card
2024-10-10,Electric Bill,120,Power Company,4900,Credit Card
2024-10-12,Netflix Subscription,15.99,Netflix,,Credit Card
2024-10-13,Dinner Out,45,Restaurant,5812,Credit Card
2024-10-15,Gas,55,Shell,5541,Credit Card
2024-10-18,Amazon Purchase,67,Amazon,5999,Credit Card
2024-10-20,Gym Membership,50,Planet Fitness,,Credit Card`;

  // Save sample CSV for demo
  const csvPath = path.join(__dirname, '../output/sample-transactions.csv');
  const outputDir = path.dirname(csvPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(csvPath, sampleCSV);
  console.log(`Sample CSV created at: ${csvPath}\n`);

  // Read and parse CSV
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const transactions = parseCSVTransactions(csvData);

  console.log(`Parsed ${transactions.length} transactions from CSV\n`);

  // Analyze
  const analyst = new FinancialAnalyst(transactions, 5000);
  const report = await analyst.quickAnalysis();

  console.log(report);

  console.log('\n\n📝 To use with your own CSV:');
  console.log('1. Export transactions from your bank as CSV');
  console.log('2. Ensure format: Date,Description,Amount,Merchant,MCC,PaymentMethod');
  console.log('3. Load the file and pass to parseCSVTransactions()');
  console.log('4. Create FinancialAnalyst with parsed transactions');
  console.log('5. Run analyze() and generate reports!');
}

main().catch(console.error);
