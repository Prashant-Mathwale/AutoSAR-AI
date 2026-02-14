/**
 * Rule Engine Configuration - Indian Banking (RBI/FIU-IND Compliance)
 */

export const RULE_ENGINE_VERSION = '2.0.0-INR';

// Indian Reporting Thresholds (in INR Lakhs)
export const INR_CRITICAL_THRESHOLD = 4500000; // ₹45 Lakhs - CTR threshold
export const INR_STRUCTURING_UPPER = 990000; // ₹9.9 Lakhs
export const INR_STRUCTURING_LOWER = 850000; // ₹8.5 Lakhs
export const INR_PAN_THRESHOLD = 50000; // ₹50K - PAN reporting
export const INR_CASH_THRESHOLD = 1000000; // ₹10 Lakhs - Cash Transaction Report

// High-risk jurisdictions (FATF Black/Grey Lists + Tax Havens)
export const HIGH_RISK_COUNTRIES = new Set([
  'KP', // North Korea
  'IR', // Iran
  'MM', // Myanmar
  'KY', // Cayman Islands
  'BM', // Bermuda
  'VG', // British Virgin Islands
  'PA', // Panama
  'CH', // Switzerland (banking secrecy)
  'LI', // Liechtenstein
  'MC', // Monaco
]);

export const MEDIUM_RISK_COUNTRIES = new Set([
  'PK', // Pakistan
  'AF', // Afghanistan
  'YE', // Yemen
  'SY', // Syria
  'SD', // Sudan
  'UG', // Uganda
  'HK', // Hong Kong (for certain activities)
]);

// Structuring detection window
export const STRUCTURING_WINDOW_DAYS = 30; // Look for patterns over 30 days
export const STRUCTURING_COUNT_THRESHOLD = 10; // 10+ transactions indicate structuring

// Risk score weights (Indian context)
export const RISK_WEIGHTS = {
  CRITICAL_AMOUNT: 40,        // Single transaction > ₹45L
  LARGE_AMOUNT: 30,           // Transaction > ₹10L
  SIGNIFICANT_AMOUNT: 20,     // Transaction > ₹5L
  STRUCTURING_PATTERN: 45,    // Multiple transactions near ₹10L limit
  SMURFING_PATTERN: 40,       // Many small transactions below PAN limit
  HIGH_RISK_JURISDICTION: 35,
  MEDIUM_RISK_JURISDICTION: 20,
  VELOCITY_EXTREME: 25,       // Rapid transaction velocity
  VELOCITY_HIGH: 15,
  ROUND_AMOUNT: 10,
  PROFILE_INCONSISTENCY_HIGH: 20,
  PROFILE_INCONSISTENCY_MEDIUM: 10,
  CASH_TRANSACTION: 15,
  UNEXPLAINED_WEALTH: 30,
};

// Risk level thresholds
export const RISK_LEVELS = {
  CRITICAL: 80,
  HIGH: 60,
  MEDIUM: 40,
  LOW: 0,
};

// Typology classifications (Indian context)
export const TYPOLOGIES = {
  STRUCTURING: 'Structuring / CTR Evasion',
  SMURFING: 'Smurfing / PAN Evasion',
  LAYERING: 'Layering',
  HAWALA: 'Potential Hawala Transaction',
  TAX_EVASION: 'Tax Evasion Indicators',
  BLACK_MONEY: 'Unexplained Cash Sources',
  BENAMI: 'Potential Benami Transaction',
  TRADE_BASED: 'Trade-Based Money Laundering',
  TERRORIST_FINANCING: 'Potential Terrorist Financing',
};

export const ROUND_AMOUNTS_INR = [
  50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000
];
