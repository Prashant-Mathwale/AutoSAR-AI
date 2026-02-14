# 🔧 Quick Fix: UUID Error

## Problem
Your Supabase `cases` table uses UUID type for `case_id`, but we're generating string IDs like "SAR-2026-373033".

## ✅ Solution (Choose ONE)

### Option 1: Update Database Schema (RECOMMENDED)

**This is the cleanest solution.**

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire content from: `/database/schema_fixed.sql`
3. Click "Run"
4. This will recreate all tables with TEXT case_id instead of UUID

**After running the SQL:**
```bash
# Your existing upload API will now work perfectly
# No code changes needed
```

---

### Option 2: Update Code to Use UUID (If you want to keep current schema)

1. Rename the current upload route:
```bash
cd C:\Users\91901\Desktop\HOH\src\app\api\cases\upload
mv route.ts route_old.ts
mv route_uuid.ts route.ts
```

2. Restart the dev server:
```bash
npm run dev
```

**This approach:**
- Uses UUID in database (like your current schema)
- Stores readable "SAR-2026-XXXXX" ID in metadata
- Navigation uses UUID

---

## 🎯 Recommended Approach: Option 1

**Why?**
- Simpler code
- Readable case IDs in URLs
- Easier debugging
- Better user experience

**Steps:**
```sql
-- 1. Go to Supabase SQL Editor
-- 2. Paste this entire content from schema_fixed.sql
-- 3. Run it
-- 4. Done!
```

---

## ⚡ Quick Test After Fix

```bash
# 1. Restart dev server
npm run dev

# 2. Upload test data
# Go to http://localhost:3000/dashboard
# Click "Upload Data"
# Select transaction_data.json

# 3. Should work without UUID errors!
```

---

## 📋 What Changed

### Before (UUID):
```sql
CREATE TABLE cases (
  case_id UUID PRIMARY KEY  -- ❌ Causes error
)
```

### After (TEXT):
```sql
CREATE TABLE cases (
  case_id TEXT PRIMARY KEY  -- ✅ Works with "SAR-2026-XXXXX"
)
```

---

## 🔍 Verify Fix Worked

After running schema_fixed.sql:

1. Upload transaction_data.json
2. Check terminal - should see:
```
✓ Cases inserted successfully
✓ No UUID errors
✓ Auto-redirect working
```

3. Check Supabase dashboard:
```
cases table → case_id column → should show "SAR-2026-XXXXX"
```

---

## 💡 Why This Happened

Supabase's default schema template uses UUID for primary keys. Our application uses human-readable case IDs like "SAR-2026-373033" for:
- Better UX (easier to reference)
- Compliance (standard SAR numbering)
- Readability in URLs

The fix aligns the database schema with our application design.

---

**Run the SQL from `schema_fixed.sql` and you're done!** ✅
