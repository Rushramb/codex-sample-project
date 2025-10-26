/**
 * Category configuration with keywords, patterns, and mappings
 */

import { CategoryType, ExpenseLevel, CategoryMapping } from './types';

export const CATEGORY_MAPPINGS: CategoryMapping[] = [
  // ESSENTIAL - Housing
  {
    category: CategoryType.HOUSING,
    level: ExpenseLevel.ESSENTIAL,
    subCategories: ['Rent', 'Mortgage', 'Property Tax', 'HOA Fees', 'Home Repairs'],
    keywords: ['rent', 'mortgage', 'property management', 'hoa', 'landlord'],
    merchantPatterns: [/property.?management/i, /realty/i, /apartments/i]
  },

  // ESSENTIAL - Utilities
  {
    category: CategoryType.UTILITIES,
    level: ExpenseLevel.ESSENTIAL,
    subCategories: ['Electric', 'Gas', 'Water', 'Internet', 'Phone'],
    keywords: ['electric', 'gas', 'water', 'internet', 'phone', 'utility', 'power', 'energy'],
    merchantPatterns: [/electric/i, /power/i, /gas.?company/i, /water/i, /telecom/i, /at&t/i, /verizon/i, /t-mobile/i, /comcast/i, /spectrum/i]
  },

  // ESSENTIAL - Insurance
  {
    category: CategoryType.INSURANCE,
    level: ExpenseLevel.ESSENTIAL,
    subCategories: ['Health', 'Auto', 'Home', 'Life'],
    keywords: ['insurance', 'premium', 'policy'],
    merchantPatterns: [/insurance/i, /healthplan/i, /aetna/i, /blue.?cross/i, /geico/i, /state.?farm/i, /allstate/i]
  },

  // SEMI-ESSENTIAL - Groceries
  {
    category: CategoryType.GROCERIES,
    level: ExpenseLevel.SEMI_ESSENTIAL,
    subCategories: ['Supermarket', 'Bulk Stores', 'Specialty Stores'],
    keywords: ['grocery', 'supermarket', 'market', 'food'],
    merchantPatterns: [
      /walmart/i, /target/i, /safeway/i, /kroger/i, /whole.?foods/i, /trader.?joe/i,
      /costco/i, /sam.?club/i, /aldi/i, /publix/i, /albertsons/i, /food.?lion/i
    ]
  },

  // SEMI-ESSENTIAL - Transportation
  {
    category: CategoryType.TRANSPORTATION,
    level: ExpenseLevel.SEMI_ESSENTIAL,
    subCategories: ['Gas', 'Public Transit', 'Parking', 'Car Maintenance', 'Ride Share'],
    keywords: ['gas', 'fuel', 'transit', 'parking', 'uber', 'lyft', 'taxi', 'auto repair'],
    merchantPatterns: [
      /shell/i, /chevron/i, /exxon/i, /bp/i, /mobil/i, /gas.?station/i,
      /uber/i, /lyft/i, /transit/i, /parking/i, /auto.?repair/i
    ]
  },

  // SEMI-ESSENTIAL - Healthcare
  {
    category: CategoryType.HEALTHCARE,
    level: ExpenseLevel.SEMI_ESSENTIAL,
    subCategories: ['Pharmacy', 'Doctor', 'Dental', 'Vision'],
    keywords: ['pharmacy', 'cvs', 'walgreens', 'doctor', 'medical', 'dental', 'clinic', 'hospital'],
    merchantPatterns: [
      /cvs/i, /walgreens/i, /pharmacy/i, /medical/i, /clinic/i, /hospital/i,
      /dental/i, /doctor/i, /physician/i, /health.?care/i
    ]
  },

  // DISCRETIONARY - Dining Out
  {
    category: CategoryType.DINING_OUT,
    level: ExpenseLevel.DISCRETIONARY,
    subCategories: ['Restaurants', 'Fast Food', 'Coffee Shops', 'Food Delivery'],
    keywords: ['restaurant', 'cafe', 'coffee', 'diner', 'pizzeria', 'delivery'],
    merchantPatterns: [
      /mcdonald/i, /burger.?king/i, /wendy/i, /starbucks/i, /dunkin/i, /chipotle/i,
      /pizza/i, /restaurant/i, /cafe/i, /doordash/i, /uber.?eats/i, /grubhub/i,
      /postmates/i, /seamless/i, /panera/i, /subway/i, /taco.?bell/i
    ]
  },

  // DISCRETIONARY - Entertainment
  {
    category: CategoryType.ENTERTAINMENT,
    level: ExpenseLevel.DISCRETIONARY,
    subCategories: ['Movies', 'Concerts', 'Sports', 'Hobbies', 'Games'],
    keywords: ['movie', 'cinema', 'theater', 'concert', 'ticket', 'entertainment', 'game'],
    merchantPatterns: [
      /cinema/i, /theater/i, /amc/i, /regal/i, /ticketmaster/i, /stubhub/i,
      /spotify/i, /steam/i, /playstation/i, /xbox/i, /nintendo/i
    ]
  },

  // DISCRETIONARY - Subscriptions
  {
    category: CategoryType.SUBSCRIPTIONS,
    level: ExpenseLevel.DISCRETIONARY,
    subCategories: ['Streaming', 'Software', 'Memberships', 'Magazines'],
    keywords: ['subscription', 'membership', 'monthly', 'premium'],
    merchantPatterns: [
      /netflix/i, /hulu/i, /disney/i, /hbo/i, /amazon.?prime/i, /apple.?tv/i,
      /spotify/i, /youtube.?premium/i, /adobe/i, /microsoft/i, /gym/i, /fitness/i,
      /patreon/i, /onlyfans/i, /substack/i
    ]
  },

  // DISCRETIONARY - Shopping
  {
    category: CategoryType.SHOPPING,
    level: ExpenseLevel.DISCRETIONARY,
    subCategories: ['Clothing', 'Electronics', 'Home Goods', 'Online Shopping'],
    keywords: ['amazon', 'shopping', 'retail', 'store', 'mall'],
    merchantPatterns: [
      /amazon/i, /ebay/i, /etsy/i, /nordstrom/i, /macy/i, /gap/i, /zara/i,
      /h&m/i, /nike/i, /adidas/i, /apple.?store/i, /best.?buy/i, /home.?depot/i,
      /lowes/i, /ikea/i, /wayfair/i
    ]
  }
];

/**
 * Common merchant category codes and their mappings
 */
export const MCC_MAPPINGS: { [key: string]: CategoryType } = {
  '5411': CategoryType.GROCERIES, // Grocery Stores
  '5541': CategoryType.TRANSPORTATION, // Service Stations
  '5812': CategoryType.DINING_OUT, // Eating Places
  '5814': CategoryType.DINING_OUT, // Fast Food
  '5912': CategoryType.HEALTHCARE, // Drug Stores and Pharmacies
  '7832': CategoryType.ENTERTAINMENT, // Motion Picture Theaters
  '7995': CategoryType.ENTERTAINMENT, // Gambling
  '5310': CategoryType.SHOPPING, // Discount Stores
  '5732': CategoryType.SHOPPING, // Electronics Stores
  '5999': CategoryType.SHOPPING, // Miscellaneous Retail
  '6300': CategoryType.INSURANCE, // Insurance
  '4900': CategoryType.UTILITIES, // Utilities
};

/**
 * Keywords that indicate recurring transactions
 */
export const RECURRING_INDICATORS = [
  'subscription',
  'monthly',
  'recurring',
  'auto-pay',
  'autopay',
  'membership',
  'premium',
  'plan',
  'service'
];

/**
 * Merchants known for convenience premiums
 */
export const CONVENIENCE_PREMIUM_MERCHANTS = [
  /doordash/i,
  /uber.?eats/i,
  /grubhub/i,
  /postmates/i,
  /instacart/i,
  /prime.?now/i,
  /convenience.?store/i,
  /7-eleven/i,
  /circle.?k/i
];

/**
 * Categories that commonly have brand premium opportunities
 */
export const BRAND_PREMIUM_CATEGORIES = [
  CategoryType.GROCERIES,
  CategoryType.HEALTHCARE,
  CategoryType.SHOPPING
];

/**
 * Typical budget allocation percentages (50/30/20 rule baseline)
 */
export const BUDGET_BENCHMARKS = {
  [ExpenseLevel.ESSENTIAL]: 0.50,        // 50% for needs
  [ExpenseLevel.SEMI_ESSENTIAL]: 0.20,   // Part of the 50%
  [ExpenseLevel.DISCRETIONARY]: 0.30,    // 30% for wants
  savings: 0.20                           // 20% for savings
};

/**
 * Average spending benchmarks by income level (monthly)
 */
export const SPENDING_BENCHMARKS: { [income: string]: { [category in CategoryType]?: number } } = {
  low: { // <$30k annual
    [CategoryType.GROCERIES]: 300,
    [CategoryType.DINING_OUT]: 150,
    [CategoryType.ENTERTAINMENT]: 100,
    [CategoryType.SUBSCRIPTIONS]: 50,
    [CategoryType.SHOPPING]: 200
  },
  medium: { // $30k-$75k annual
    [CategoryType.GROCERIES]: 500,
    [CategoryType.DINING_OUT]: 300,
    [CategoryType.ENTERTAINMENT]: 200,
    [CategoryType.SUBSCRIPTIONS]: 100,
    [CategoryType.SHOPPING]: 400
  },
  high: { // >$75k annual
    [CategoryType.GROCERIES]: 700,
    [CategoryType.DINING_OUT]: 500,
    [CategoryType.ENTERTAINMENT]: 400,
    [CategoryType.SUBSCRIPTIONS]: 200,
    [CategoryType.SHOPPING]: 800
  }
};
