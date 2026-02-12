/**
 * Rule Engine Configuration
 * Defines all risk scoring thresholds and weights
 */

export const RULE_ENGINE_VERSION = '1.0.0';

// High-risk jurisdictions (FATF grey/black list)
export const HIGH_RISK_COUNTRIES = new Set([
  'KP', // North Korea
  'IR', // Iran
  'MM', // Myanmar
  'KY', // Cayman Islands (for demo purposes)
]);

export const MEDIUM_RISK_COUNTRIES = new Set([
  'PK', // Pakistan
  'YE', // Yemen
  'UG', // Uganda
  'PH', // Philippines
]);

// Transaction thresholds
export const CTR_THRESHOLD = 10000; // Currency Transaction Report threshold
export const STRUCTURING_WINDOW_HOURS = 24;
export const STRUCTURING_COUNT_THRESHOLD = 3;
export const LARGE_TRANSACTION_THRESHOLD = 50000;
export const SIGNIFICANT_TRANSACTION_THRESHOLD = 25000;

// Risk score weights
export const RISK_WEIGHTS = {
  LARGE_AMOUNT: 30,
  SIGNIFICANT_AMOUNT: 20,
  HIGH_RISK_JURISDICTION: 35,
  MEDIUM_RISK_JURISDICTION: 20,
  STRUCTURING_PATTERN: 40,
  VELOCITY_HIGH: 20,
  VELOCITY_MEDIUM: 10,
  ROUND_AMOUNT: 10,
  PROFILE_INCONSISTENCY_HIGH: 15,
  PROFILE_INCONSISTENCY_MEDIUM: 10,
  CASH_TRANSACTION: 15,
};

// Risk level thresholds
export const RISK_LEVELS = {
  CRITICAL: 75,
  HIGH: 50,
  MEDIUM: 25,
  LOW: 0,
};

// Typology classifications
export const TYPOLOGIES = {
  STRUCTURING: 'Structuring / Smurfing',
  TRADE_BASED: 'Trade-Based Money Laundering',
  LAYERING: 'Layering',
  INTEGRATION: 'Integration',
  TERRORIST_FINANCING: 'Potential Terrorist Financing',
  SANCTIONS_EVASION: 'Sanctions Evasion',
  TAX_EVASION: 'Tax Evasion Indicators',
  FRAUD: 'Fraud Indicators',
};

export const ROUND_AMOUNTS = [1000, 5000, 10000, 25000, 50000, 100000];
