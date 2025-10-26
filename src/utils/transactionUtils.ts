/**
 * Utility functions for working with transactions
 */

import { Transaction, PaymentMethod } from '../models/types';

/**
 * Create a transaction object
 */
export function createTransaction(
  id: string,
  date: Date,
  description: string,
  amount: number,
  merchant?: string,
  mcc?: string,
  paymentMethod?: PaymentMethod
): Transaction {
  return {
    id,
    date,
    description,
    amount,
    merchant,
    mcc,
    paymentMethod
  };
}

/**
 * Parse CSV data into transactions
 * Expected CSV format: Date,Description,Amount,Merchant,MCC,PaymentMethod
 */
export function parseCSVTransactions(csvData: string): Transaction[] {
  const lines = csvData.trim().split('\n');
  const transactions: Transaction[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (handle quoted fields)
    const fields = parseCSVLine(line);

    if (fields.length < 3) continue;

    const date = new Date(fields[0]);
    const description = fields[1];
    const amount = parseFloat(fields[2]);
    const merchant = fields[3] || undefined;
    const mcc = fields[4] || undefined;
    const paymentMethod = fields[5] as PaymentMethod || undefined;

    transactions.push({
      id: `txn-${i}`,
      date,
      description,
      amount,
      merchant,
      mcc,
      paymentMethod
    });
  }

  return transactions;
}

/**
 * Parse a single CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }

  fields.push(currentField.trim());
  return fields;
}

/**
 * Generate sample transactions for testing
 */
export function generateSampleTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const startDate = new Date('2024-01-01');

  // Income
  transactions.push(
    createTransaction('txn-1', new Date('2024-01-01'), 'Salary Deposit', -5000, 'Employer', undefined, PaymentMethod.TRANSFER)
  );

  // Housing
  transactions.push(
    createTransaction('txn-2', new Date('2024-01-05'), 'Rent Payment', 1500, 'Property Management Co', '6513', PaymentMethod.TRANSFER)
  );

  // Utilities
  transactions.push(
    createTransaction('txn-3', new Date('2024-01-10'), 'Electric Bill', 120, 'City Power Company', '4900', PaymentMethod.CREDIT_CARD),
    createTransaction('txn-4', new Date('2024-01-12'), 'Internet Service', 80, 'Comcast', '4900', PaymentMethod.CREDIT_CARD),
    createTransaction('txn-5', new Date('2024-01-15'), 'Phone Bill', 75, 'Verizon', '4900', PaymentMethod.CREDIT_CARD)
  );

  // Groceries
  transactions.push(
    createTransaction('txn-6', new Date('2024-01-08'), 'Grocery Shopping', 150, 'Whole Foods', '5411', PaymentMethod.DEBIT_CARD),
    createTransaction('txn-7', new Date('2024-01-16'), 'Grocery Shopping', 180, 'Safeway', '5411', PaymentMethod.DEBIT_CARD),
    createTransaction('txn-8', new Date('2024-01-24'), 'Grocery Shopping', 165, 'Whole Foods', '5411', PaymentMethod.DEBIT_CARD)
  );

  // Dining Out (excessive)
  const restaurants = ['Chipotle', 'Starbucks', 'Panera', 'Local Restaurant', 'Pizza Place'];
  for (let day = 5; day < 30; day += 2) {
    const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
    const amount = restaurant === 'Starbucks' ? 6.50 : Math.floor(Math.random() * 30) + 15;
    transactions.push(
      createTransaction(
        `txn-dining-${day}`,
        new Date(2024, 0, day),
        `Dining at ${restaurant}`,
        amount,
        restaurant,
        '5812',
        PaymentMethod.CREDIT_CARD
      )
    );
  }

  // Food Delivery (convenience premium)
  transactions.push(
    createTransaction('txn-100', new Date('2024-01-06'), 'DoorDash Order', 45, 'DoorDash', '5812', PaymentMethod.CREDIT_CARD),
    createTransaction('txn-101', new Date('2024-01-13'), 'Uber Eats Order', 38, 'Uber Eats', '5812', PaymentMethod.CREDIT_CARD),
    createTransaction('txn-102', new Date('2024-01-20'), 'GrubHub Order', 42, 'GrubHub', '5812', PaymentMethod.CREDIT_CARD),
    createTransaction('txn-103', new Date('2024-01-27'), 'Postmates Order', 51, 'Postmates', '5812', PaymentMethod.CREDIT_CARD)
  );

  // Subscriptions (creep)
  transactions.push(
    createTransaction('txn-200', new Date('2024-01-01'), 'Netflix Subscription', 15.99, 'Netflix', undefined, PaymentMethod.CREDIT_CARD),
    createTransaction('txn-201', new Date('2024-01-03'), 'Hulu Subscription', 14.99, 'Hulu', undefined, PaymentMethod.CREDIT_CARD),
    createTransaction('txn-202', new Date('2024-01-05'), 'Disney+ Subscription', 13.99, 'Disney Plus', undefined, PaymentMethod.CREDIT_CARD),
    createTransaction('txn-203', new Date('2024-01-07'), 'HBO Max Subscription', 15.99, 'HBO Max', undefined, PaymentMethod.CREDIT_CARD),
    createTransaction('txn-204', new Date('2024-01-10'), 'Spotify Premium', 10.99, 'Spotify', undefined, PaymentMethod.CREDIT_CARD),
    createTransaction('txn-205', new Date('2024-01-12'), 'Apple Music', 10.99, 'Apple Music', undefined, PaymentMethod.CREDIT_CARD),
    createTransaction('txn-206', new Date('2024-01-15'), 'Gym Membership', 50, 'Planet Fitness', undefined, PaymentMethod.CREDIT_CARD),
    createTransaction('txn-207', new Date('2024-01-18'), 'Adobe Creative Cloud', 54.99, 'Adobe', undefined, PaymentMethod.CREDIT_CARD)
  );

  // Transportation
  transactions.push(
    createTransaction('txn-300', new Date('2024-01-09'), 'Gas', 55, 'Shell', '5541', PaymentMethod.CREDIT_CARD),
    createTransaction('txn-301', new Date('2024-01-17'), 'Gas', 58, 'Chevron', '5541', PaymentMethod.CREDIT_CARD),
    createTransaction('txn-302', new Date('2024-01-25'), 'Gas', 52, 'Shell', '5541', PaymentMethod.CREDIT_CARD),
    createTransaction('txn-303', new Date('2024-01-11'), 'Uber Ride', 18, 'Uber', undefined, PaymentMethod.CREDIT_CARD),
    createTransaction('txn-304', new Date('2024-01-22'), 'Lyft Ride', 22, 'Lyft', undefined, PaymentMethod.CREDIT_CARD)
  );

  // Shopping (impulse)
  transactions.push(
    createTransaction('txn-400', new Date('2024-01-07'), 'Amazon Purchase', 45, 'Amazon', '5999', PaymentMethod.CREDIT_CARD),
    createTransaction('txn-401', new Date('2024-01-14'), 'Amazon Purchase', 67, 'Amazon', '5999', PaymentMethod.CREDIT_CARD),
    createTransaction('txn-402', new Date('2024-01-21'), 'Target Shopping', 89, 'Target', '5310', PaymentMethod.DEBIT_CARD),
    createTransaction('txn-403', new Date('2024-01-28'), 'Amazon Purchase', 34, 'Amazon', '5999', PaymentMethod.CREDIT_CARD)
  );

  // Convenience store micro-transactions
  for (let i = 0; i < 12; i++) {
    const day = 3 + i * 2;
    transactions.push(
      createTransaction(
        `txn-conv-${i}`,
        new Date(2024, 0, day),
        'Convenience Store',
        Math.floor(Math.random() * 8) + 3,
        '7-Eleven',
        '5411',
        PaymentMethod.CASH
      )
    );
  }

  // Entertainment
  transactions.push(
    createTransaction('txn-500', new Date('2024-01-13'), 'Movie Tickets', 32, 'AMC Theaters', '7832', PaymentMethod.CREDIT_CARD),
    createTransaction('txn-501', new Date('2024-01-20'), 'Concert Tickets', 85, 'Ticketmaster', '7995', PaymentMethod.CREDIT_CARD)
  );

  // Healthcare
  transactions.push(
    createTransaction('txn-600', new Date('2024-01-11'), 'Pharmacy', 25, 'CVS', '5912', PaymentMethod.DEBIT_CARD),
    createTransaction('txn-601', new Date('2024-01-23'), 'Doctor Visit Copay', 30, 'Medical Clinic', undefined, PaymentMethod.CREDIT_CARD)
  );

  // Insurance
  transactions.push(
    createTransaction('txn-700', new Date('2024-01-01'), 'Auto Insurance', 150, 'Geico', '6300', PaymentMethod.TRANSFER),
    createTransaction('txn-701', new Date('2024-01-01'), 'Health Insurance', 350, 'Blue Cross', '6300', PaymentMethod.TRANSFER)
  );

  return transactions;
}

/**
 * Format transaction for display
 */
export function formatTransaction(transaction: Transaction): string {
  const date = transaction.date.toLocaleDateString();
  const amount = transaction.amount.toFixed(2);
  return `${date} | ${transaction.description.padEnd(30)} | $${amount.padStart(10)} | ${transaction.merchant || 'N/A'}`;
}

/**
 * Export transactions to CSV
 */
export function exportToCSV(transactions: Transaction[]): string {
  let csv = 'Date,Description,Amount,Merchant,Category,MCC,PaymentMethod\n';

  transactions.forEach(t => {
    const date = t.date.toISOString().split('T')[0];
    const description = `"${t.description}"`;
    const amount = t.amount.toFixed(2);
    const merchant = t.merchant || '';
    const category = t.category || '';
    const mcc = t.mcc || '';
    const paymentMethod = t.paymentMethod || '';

    csv += `${date},${description},${amount},${merchant},${category},${mcc},${paymentMethod}\n`;
  });

  return csv;
}
