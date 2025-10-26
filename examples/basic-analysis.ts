/**
 * Basic Financial Analysis Example
 *
 * This example demonstrates how to use the Personal Financial Analyst
 * to analyze transactions and generate insights.
 */

import { FinancialAnalyst } from '../src/FinancialAnalyst';
import { generateSampleTransactions } from '../src/utils/transactionUtils';

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('  Personal Financial Analyst - Basic Analysis Example');
  console.log('═══════════════════════════════════════════════════════════════════════════\n');

  // Generate sample transactions
  const transactions = generateSampleTransactions();
  const monthlyIncome = 5000;

  console.log(`Loaded ${transactions.length} transactions for analysis\n`);

  // Create financial analyst
  const analyst = new FinancialAnalyst(transactions, monthlyIncome);

  // Perform complete analysis
  const result = await analyst.analyze();

  // Generate and display complete report
  const report = analyst.generateReport(result);
  const completeReport = report.generateCompleteReport();

  console.log(completeReport);

  // Save reports to files (optional)
  const fs = require('fs');
  const path = require('path');

  const outputDir = path.join(__dirname, '../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save text report
  fs.writeFileSync(
    path.join(outputDir, 'financial-analysis-report.txt'),
    completeReport
  );
  console.log('\n✅ Full report saved to: output/financial-analysis-report.txt');

  // Save JSON export
  const jsonExport = analyst.export(result, 'json');
  fs.writeFileSync(
    path.join(outputDir, 'financial-analysis-data.json'),
    jsonExport
  );
  console.log('✅ JSON data saved to: output/financial-analysis-data.json');

  // Save CSV export
  const csvExport = analyst.export(result, 'csv');
  fs.writeFileSync(
    path.join(outputDir, 'financial-analysis-summary.csv'),
    csvExport
  );
  console.log('✅ CSV summary saved to: output/financial-analysis-summary.csv');

  // Display quick insights
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('  Quick Insights');
  console.log('═══════════════════════════════════════════════════════════════════════════\n');

  const insights = await analyst.getInsights();

  console.log('💭 Your Spending Personality:');
  console.log(`   ${insights.spendingPersonality}\n`);

  console.log('🎯 Top 3 Critical Actions:');
  insights.criticalActions.forEach((action, i) => {
    console.log(`   ${i + 1}. ${action}`);
  });

  console.log('\n💰 Monthly Progress Potential:');
  console.log(`   ${insights.monthlyProgress}\n`);

  // Display roadmap
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('  90-Day Transformation Roadmap');
  console.log('═══════════════════════════════════════════════════════════════════════════\n');

  const roadmap = analyst.getRoadmap();

  console.log('📅 Days 1-30 (Quick Wins):');
  roadmap.thirtyDay.forEach((item, i) => {
    console.log(`   ${i + 1}. ${item}`);
  });

  console.log('\n📅 Days 31-60 (Behavioral Changes):');
  roadmap.sixtyDay.forEach((item, i) => {
    console.log(`   ${i + 1}. ${item}`);
  });

  console.log('\n📅 Days 61-90 (Long-term Sustainability):');
  roadmap.ninetyDay.forEach((item, i) => {
    console.log(`   ${i + 1}. ${item}`);
  });

  console.log('\n═══════════════════════════════════════════════════════════════════════════');
  console.log('  Analysis Complete!');
  console.log('═══════════════════════════════════════════════════════════════════════════\n');
}

// Run the example
main().catch(console.error);
