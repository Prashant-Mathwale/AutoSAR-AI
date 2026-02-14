# 🔧 Implementation Notes for Developers

## Production Checklist

### Before Deploying to Production

#### 1. Environment Variables
```env
# Required for full functionality
GEMINI_API_KEY=your_actual_key
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Security
NEXTAUTH_SECRET=generate_random_64_char_string
NEXTAUTH_URL=https://your-production-url.com

# Optional
NEXT_PUBLIC_APP_URL=https://your-production-url.com
NODE_ENV=production
```

#### 2. Database Setup
- Run `database/schema.sql` in Supabase SQL Editor
- Enable Row Level Security (RLS) policies
- Create indexes for performance:
  ```sql
  CREATE INDEX idx_cases_status ON cases(status);
  CREATE INDEX idx_cases_created_at ON cases(created_at DESC);
  CREATE INDEX idx_audit_logs_case_id ON audit_trail_logs(case_id);
  ```

#### 3. Authentication
- Set up Supabase Auth providers
- Configure OAuth if needed
- Set up email templates
- Test sign-up/sign-in flow

#### 4. API Rate Limiting
Consider adding rate limiting to API routes:
```typescript
// Example using upstash/ratelimit
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

// In your API route
const { success } = await ratelimit.limit(identifier);
if (!success) return NextResponse.json({ error: "Rate limit exceeded" });
```

---

## Integration Guide

### Connecting to Supabase

#### Step 1: Update Database Client
Replace mock data in `src/lib/db/index.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### Step 2: Update API Routes
In `src/app/api/cases/route.ts`:

```typescript
// Replace mock data
export async function GET(request: NextRequest) {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data, count: data.length });
}
```

#### Step 3: Add Real-time Updates (Optional)
```typescript
const channel = supabase
  .channel('cases-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'cases' }, 
    (payload) => {
      console.log('Change received!', payload);
      fetchCases(); // Refresh data
    }
  )
  .subscribe();
```

---

### Adding Authentication

#### Step 1: Create Auth Provider
`src/lib/providers/AuthProvider.tsx`:

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/db';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

#### Step 2: Protect Routes
`src/middleware.ts`:

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}
```

---

### Implementing PDF Export

#### Using jsPDF and html2canvas

```typescript
// src/lib/pdf-export.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportCaseToPDF(caseId: string, narrative: string) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Add header
  pdf.setFontSize(16);
  pdf.text('Suspicious Activity Report', 105, 15, { align: 'center' });
  
  // Add case ID
  pdf.setFontSize(12);
  pdf.text(`Case ID: ${caseId}`, 20, 25);
  
  // Add narrative
  pdf.setFontSize(10);
  const splitText = pdf.splitTextToSize(narrative, 170);
  pdf.text(splitText, 20, 35);
  
  // Save
  pdf.save(`SAR_${caseId}_${new Date().toISOString().split('T')[0]}.pdf`);
}
```

#### In your component:
```typescript
const handleExportPDF = async () => {
  await exportCaseToPDF(caseData.case_id, caseData.sar_draft);
};
```

---

## Feature Extensions

### Adding Email Notifications

Use Resend or SendGrid:

```typescript
// src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReviewNotification(
  reviewerEmail: string,
  caseId: string
) {
  await resend.emails.send({
    from: 'AutoSAR <noreply@autosar.com>',
    to: reviewerEmail,
    subject: `SAR ${caseId} Ready for Review`,
    html: `<p>A new SAR is ready for your review: ${caseId}</p>`
  });
}
```

### Adding Batch Operations

```typescript
// Process multiple cases at once
export async function POST(request: NextRequest) {
  const { caseIds } = await request.json();
  
  const results = await Promise.all(
    caseIds.map(id => generateSARNarrative({ case_id: id, ... }))
  );
  
  return NextResponse.json({ success: true, results });
}
```

### Adding Advanced Search

```typescript
// Full-text search in Supabase
const { data } = await supabase
  .from('cases')
  .select()
  .textSearch('customer_name', searchQuery, {
    type: 'websearch',
    config: 'english'
  });
```

---

## Performance Optimization

### 1. Enable Caching
```typescript
// In API routes
export const revalidate = 60; // ISR: revalidate every 60 seconds
```

### 2. Add Loading Skeletons
```typescript
// loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Loading...</div>;
}
```

### 3. Optimize Images
```typescript
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={50}
  priority
/>
```

### 4. Code Splitting
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

---

## Security Best Practices

### 1. Input Validation
```typescript
import { z } from 'zod';

const caseSchema = z.object({
  customer_id: z.string().min(1),
  risk_score: z.number().min(0).max(100),
});

// In API route
const validated = caseSchema.parse(body);
```

### 2. CSRF Protection
```typescript
// Already handled by Next.js
// Use POST for mutations, GET for reads only
```

### 3. SQL Injection Prevention
```typescript
// Supabase automatically handles this
// Always use parameterized queries
const { data } = await supabase
  .from('cases')
  .select()
  .eq('case_id', userInput); // Safe
```

### 4. XSS Prevention
```typescript
// React automatically escapes content
// For raw HTML, sanitize:
import DOMPurify from 'isomorphic-dompurify';

const clean = DOMPurify.sanitize(userInput);
```

---

## Monitoring & Logging

### Set Up Error Tracking
```typescript
// Sentry integration
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Add Analytics
```typescript
// Google Analytics
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Testing

### Unit Tests (Jest)
```typescript
// __tests__/risk-engine.test.ts
import { evaluateCase } from '@/core/rules/engine';

describe('Risk Engine', () => {
  it('calculates risk score correctly', () => {
    const result = evaluateCase(mockCaseData);
    expect(result.aggregated_risk_score).toBeGreaterThan(0);
  });
});
```

### E2E Tests (Playwright)
```typescript
// e2e/case-workflow.spec.ts
import { test, expect } from '@playwright/test';

test('complete SAR workflow', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('text=View Demo Case');
  await page.click('text=Draft');
  await page.click('text=Edit');
  // ... more assertions
});
```

---

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup
```bash
# In Vercel dashboard
# Settings → Environment Variables
# Add all vars from .env.local
```

---

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly: `npm update`
- [ ] Review Gemini API usage and costs
- [ ] Monitor Supabase database size
- [ ] Check audit logs for anomalies
- [ ] Update FATF country lists quarterly
- [ ] Review and update SAR templates
- [ ] Test all critical workflows monthly

### Backup Strategy
- Supabase automatic backups (if on paid plan)
- Export audit logs weekly
- Download case data monthly
- Store backups securely

---

## Support Contacts

### Services
- Supabase: https://supabase.com/docs
- Gemini API: https://ai.google.dev/docs
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs

---

## Quick Reference

### Common Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Check code quality
npm run type-check   # TypeScript validation
```

### Important Paths
```
/dashboard           - Main dashboard
/cases/[id]          - Case detail page
/api/cases           - Cases API
/api/sar-generation  - SAR generation API
```

### Key Files to Monitor
```
.env.local           - Environment variables
src/core/rules/      - Risk scoring logic
src/core/llm/        - AI integration
src/app/api/         - API endpoints
```

---

**Happy coding! 🚀**
