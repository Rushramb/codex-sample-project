/**
 * Custom Transactions Example
 *
 * This example shows how to create and analyze your own transaction data.
 */

import { FinancialAnalyst } from '../src/FinancialAnalyst';
import { createTransaction, PaymentMethod } from '../src/utils/transactionUtils';

async function main() {
  console.log('Creating custom transaction set...\n');

  // Create transactions manually
  const transactions = [
    // Income
    createTransaction('1', new Date('2024-10-01'), 'Salary', -6000, 'Employer', undefined, PaymentMethod.TRANSFER),

    // Essential expenses
    createTransaction('2', new Date('2024-10-05'), 'Rent', 1800, 'Landlord', undefined, PaymentMethod.TRANSFER),
    createTransaction('3', new Date('2024-10-10'), 'Electric Bill', 95, 'Power Company', undefined, PaymentMethod.CREDIT_CARD),
    createTransaction('4', new Date('2024-10-12'), 'Internet', 70, 'ISP', undefined, PaymentMethod.CREDIT_CARD),

    // Groceries
    createTransaction('5', new Date('2024-10-07'), 'Weekly Groceries', 200, 'Whole Foods', '5411', PaymentMethod.DEBIT_CARD),
    createTransaction('6', new Date('2024-10-14'), 'Weekly Groceries', 180, 'Trader Joes', '5411', PaymentMethod.DEBIT_CARD),
    createTransaction('7', new Date('2024-10-21'), 'Weekly Groceries', 210, 'Whole Foods', '5411', PaymentMethod.DEBIT_CARD),

    // Dining out (problem area)
    createTransaction('8', new Date('2024-10-03'), 'Lunch', 25, 'Restaurant', '5812', PaymentMethod.CREDIT_CARD),
    createTransaction('9', new Date('2024-10-06'), 'Dinner', 45, 'Nice Restaurant', '5812', PaymentMethod.CREDIT_CARD),
    createTransaction('10', new Date('2024-10-08'), 'Coffee', 6, 'Starbucks', '5812', PaymentMethod.CREDIT_CARD),
    createTransaction('11', new Date('2024-10-10'), 'Lunch', 22, 'Fast Food', '5814', PaymentMethod.CREDIT_CARD),
    createTransaction('12', new Date('2024-10-13'), 'Dinner', 38, 'Restaurant', '5812', PaymentMethod.CREDIT_CARD),

    // Subscriptions
    createTransaction('13', new Date('2024-10-01'), 'Netflix', 15.99, 'Netflix', undefined, PaymentMethod.CREDIT_CARD),
    createTransaction('14', new Date('2024-10-01'), 'Spotify', 10.99, 'Spotify', undefined, PaymentMethod.CREDIT_CARD),
    createTransaction('15', new Date('2024-10-05'), 'Gym', 60, 'Gym Membership', undefined, PaymentMethod.CREDIT_CARD),

    // Shopping
    createTransaction('16', new Date('2024-10-15'), 'Online Shopping', 120, 'Amazon', '5999', PaymentMethod.CREDIT_CARD),
    createTransaction('17', new Date('2024-10-20'), 'Clothing', 85, 'Retail Store', '5310', PaymentMethod.CREDIT_CARD),
  ];

  const monthlyIncome = 6000;

  // Analyze
  const analyst = new FinancialAnalyst(transactions, monthlyIncome);
  const result = await analyst.analyze();

  // Generate insights
  const insights = await analyst.getInsights();

  console.log('\n🎯 Quick Insights:\n');
  console.log(`Spending Personality: ${insights.spendingPersonality}\n`);

  console.log('Top Savings Opportunities:');
  insights.topSavingsOpportunities.forEach((opp, i) => {
    console.log(`${i + 1}. ${opp}`);
  });

  console.log('\n💰 Progress Potential:');
  console.log(insights.monthlyProgress);

  // Get negotiation scripts
  console.log('\n\n📞 Negotiation Scripts:');
  const scripts = analyst.getNegotiationScripts();
  scripts.forEach(script => {
    console.log(`\n${script.service}:`);
    console.log(`Script: ${script.script}`);
    console.log('Tips:');
    script.tips.forEach(tip => console.log(`  • ${tip}`));
  });
}

main().catch(console.error);
