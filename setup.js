#!/usr/bin/env node
/**
 * AutoSAR AI - Complete Project Setup Script
 * This script generates all necessary files for the AutoSAR AI application
 */

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

// Create directory structure
const directories = [
  'src/app/(main)/dashboard',
  'src/app/(main)/cases/[caseId]',
  'src/app/api/cases',
  'src/app/api/sar-generation',
  'src/app/api/data',
  'src/components/ui',
  'src/components/case',
  'src/components/layout',
  'src/core/ingestion/adapters',
  'src/core/llm/prompts',
  'src/core/audit',
  'src/core/governance',
  'src/lib/hooks',
  'src/lib/providers',
  'src/lib/validation',
  'public'
];

console.log('Creating directory structure...');
directories.forEach(dir => {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created: ${dir}`);
  }
});

console.log('\n✅ Directory structure created successfully!');
console.log('\nNext steps:');
console.log('1. Update your .env.local file with your Supabase and Gemini API credentials');
console.log('2. Run: npm run dev');
console.log('3. Open http://localhost:3000 in your browser\n');
