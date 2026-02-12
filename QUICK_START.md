# 🚀 Quick Start Guide - AutoSAR AI

## Get Running in 5 Minutes!

### Step 1: Install Dependencies (1 minute)
```bash
cd C:\Users\91901\Desktop\HOH
npm install
```

### Step 2: Add Your API Keys (2 minutes)

Open `.env.local` and add your keys:

```env
# Get from: https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Get from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSy...

# Leave these as-is
GEMINI_MODEL=gemini-2.0-flash-exp
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 3: Start the App (1 minute)
```bash
npm run dev
```

### Step 4: Open Your Browser (30 seconds)
Visit: **http://localhost:3000**

You'll see the dashboard immediately!

### Step 5: Explore the Demo (30 seconds)
Click **"View Demo Case"** to see:
- ✅ Transaction data
- ✅ AI-generated SAR narrative  
- ✅ Complete audit trail
- ✅ Risk scoring in action

---

## 🎯 That's It!

The app works immediately with demo data - no database setup needed to start exploring!

## 📌 Next Steps

### To Use Real Data:
1. Set up Supabase database
2. Run `database/schema.sql` in Supabase SQL Editor
3. Configure authentication

### To Deploy:
```bash
npm run build
# Deploy to Vercel, AWS, or any Node.js host
```

---

## 🆘 Troubleshooting

**"Module not found" errors?**
```bash
npm install
```

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**API errors?**
- Check `.env.local` has all required keys
- Verify Gemini API key is valid
- Check Supabase credentials

---

## 📚 Learn More

- **Full Setup**: See `SETUP_COMPLETE.md`
- **Architecture**: See `PROJECT_SUMMARY.md`
- **Documentation**: See `autosar_ai_all_documentation.md`

---

**Ready to automate SAR generation! 🎉**
