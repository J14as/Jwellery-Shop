# Deployment Guide - Vercel + PostgreSQL

## 🚀 Quick Deployment (15 minutes)

### Step 1: Prepare Repository
```bash
cd c:\Users\Jayesh\Desktop\Jewellers website
git init
git add .
git commit -m "Initial commit: Premium jewellery e-commerce platform"
```

### Step 2: Push to GitHub
```bash
# Create new repository on GitHub
git remote add origin https://github.com/yourusername/jewels.git
git branch -M main
git push -u origin main
```

### Step 3: Connect to Vercel

**Option A: Using Vercel CLI** (Quickest)
```bash
npm install -g vercel
vercel
# Follow prompts to connect GitHub account and deploy
```

**Option B: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Select your repository
5. Accept defaults (Next.js auto-detected)
6. Click "Deploy"

### Step 4: Configure Database

Create PostgreSQL database (choose one):

**Option A: Neon (Recommended - Free tier)**
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create new project
3. Copy connection string
4. Go to Vercel dashboard → Environment Variables
5. Add `DATABASE_URL` with your Neon connection string

**Option B: Supabase (Free tier)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get PostgreSQL connection string
4. Add to Vercel environment variables

**Option C: Amazon RDS**
1. Create RDS PostgreSQL instance
2. Get connection string
3. Add to environment variables

### Step 5: Set Environment Variables

Go to Vercel dashboard → Project Settings → Environment Variables

Add all variables from `.env.example`:

```
DATABASE_URL = your-postgres-url
NEXTAUTH_SECRET = (generate: openssl rand -base64 32)
NEXTAUTH_URL = https://yourdomain.vercel.app
NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_xxxxx
RAZORPAY_SECRET_KEY = xxxxx
SMTP_HOST = smtp.gmail.com
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-app-password
```

### Step 6: Run Database Migrations

After deployment, run migrations on Vercel:

```bash
# Option 1: Use Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Option 2: Use Prisma Studio
npx prisma studio
```

Then seed data:
```bash
npx prisma db seed
```

### Step 7: Verify Deployment

1. Visit your Vercel URL
2. Test sign-in: customer@jewels.com / customer123
3. Test admin: admin@jewels.com / admin123
4. Test product browsing
5. Test checkout flow

---

## 🔑 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| DATABASE_URL | PostgreSQL connection | postgresql://user:pass@host/db |
| NEXTAUTH_SECRET | Session encryption | (64-char random string) |
| NEXTAUTH_URL | Auth redirect URL | https://jewels.vercel.app |
| NEXT_PUBLIC_RAZORPAY_KEY_ID | Payment key (public) | rzp_live_xxxxx |
| RAZORPAY_SECRET_KEY | Payment key (secret) | xxxxx |
| SMTP_HOST | Email server | smtp.gmail.com |
| SMTP_USER | Email login | email@gmail.com |
| SMTP_PASS | Email password | app-specific-password |

---

## 🛠️ Production Checklist

- [ ] Database URL configured
- [ ] NEXTAUTH_SECRET set (use `openssl rand -base64 32`)
- [ ] Razorpay API keys added
- [ ] SMTP credentials configured
- [ ] Domain connected to Vercel
- [ ] SSL certificate enabled (auto)
- [ ] Database migrations run (`prisma migrate deploy`)
- [ ] Seed data loaded (`prisma db seed`)
- [ ] Test checkout flow with Razorpay
- [ ] Email notifications tested
- [ ] Admin dashboard accessible
- [ ] Analytics configured (optional)
- [ ] Backup strategy implemented
- [ ] Monitoring/logging enabled

---

## 📊 Monitoring & Logs

### Vercel Analytics
- Built into Vercel dashboard
- Monitor Core Web Vitals
- Track deployments

### Database Monitoring
- Neon: Built-in dashboard
- Supabase: Database browser
- RDS: AWS CloudWatch

### Error Tracking (Optional)
```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

---

## 🚨 Troubleshooting Deployment

### Issue: Database Connection Failed
```bash
# Verify connection string format
# Should be: postgresql://user:password@host:port/database

# Test connection locally
psql your-connection-string
```

### Issue: Razorpay Payment Not Working
- Check API keys match webhook configuration
- Verify webhook URL is set in Razorpay dashboard
- Confirm RAZORPAY_SECRET_KEY is correct (not public key)

### Issue: Authentication Not Working
```bash
# Generate new NEXTAUTH_SECRET
openssl rand -base64 32

# Add to Vercel environment variables
# Redeploy
```

### Issue: Images Not Loading
- Configure image domains in `next.config.js`
- Add Cloudinary/Unsplash to remotePatterns
- Test with absolute URLs

---

## 🔐 Security Checklist

### Before Going Live
- [ ] HTTPS enabled (auto on Vercel)
- [ ] Database backups enabled
- [ ] Secrets not in repository
- [ ] Rate limiting configured
- [ ] CORS configured
- [ ] Input validation enabled (Zod)
- [ ] SQL injection prevention (Prisma)
- [ ] Payment verification implemented
- [ ] Admin routes protected
- [ ] Logs monitoring enabled

### Ongoing
- [ ] Regular backups (daily)
- [ ] Dependency updates (weekly)
- [ ] Security patches (as released)
- [ ] Access logs review
- [ ] Performance monitoring
- [ ] Error tracking review

---

## 🎯 Custom Domain Setup

1. **Buy domain** from:
   - GoDaddy
   - Namecheap
   - Google Domains

2. **Connect to Vercel**:
   - Go to Vercel → Project Settings → Domains
   - Enter custom domain
   - Update DNS records (follow Vercel prompts)
   - Wait 24-48 hours for propagation

3. **SSL Certificate** (automatic)
   - Vercel auto-issues free SSL
   - No action needed

---

## 📈 Scaling & Performance

### Database Optimization
```bash
# Create indexes for common queries
npx prisma migrate dev --name add-indexes
```

### API Caching
```typescript
// In API routes
export const revalidate = 60; // Revalidate every 60s
```

### Image Optimization
- Use Next.js Image component (already implemented)
- Configure Cloudinary for transforms
- Enable WebP format

### Monitoring Query Performance
```bash
npm run build  # Check build size
npm run analyze  # Analyze bundle
```

---

## 💳 Razorpay Setup

### 1. Create Razorpay Account
- Go to [razorpay.com](https://razorpay.com)
- Sign up
- Complete KYC verification

### 2. Get API Keys
- Go to Settings → API Keys
- Copy Key ID (public) and Secret Key (private)
- Add to environment variables

### 3. Setup Webhook
1. Go to Settings → Webhooks
2. Create new webhook
3. URL: `https://yourdomain.com/api/webhooks/razorpay`
4. Events: 
   - payment.authorized
   - payment.failed
   - order.paid
5. Secret: Generate and add to RAZORPAY_WEBHOOK_SECRET

### 4. Test Payment
- Use Razorpay test cards:
  - Number: 4111111111111111
  - CVV: 123
  - Expiry: Any future date

---

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate app password: myaccount.google.com/apppasswords
3. Use app password in `SMTP_PASS`
4. Set `SMTP_USER` to your email

### SendGrid (Alternative)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### AWS SES (Production)
```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
```

---

## 🚀 Continuous Deployment

Vercel auto-deploys on push to main:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys
# Check progress at vercel.com dashboard
```

---

## 📊 Analytics & Monitoring

### Enable Vercel Analytics
```bash
npm install web-vitals
```

### Track Custom Events
```typescript
import { reportWebVitals } from 'web-vitals';

export function reportWebVitals(metric) {
  console.log(metric);
}
```

### Database Monitoring
- Check Neon dashboard for query analytics
- Set up alerts for slow queries
- Enable connection pooling

---

## 🔄 Backup & Recovery

### Database Backups
- Neon: Automatic daily backups (7-day retention)
- Supabase: Automatic backups included
- RDS: Enable automated backups (35-day)

### Code Backups
- GitHub: Automatic (all commits)
- Vercel: Automatic (all deployments)

### Manual Backup
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## 🎓 Helpful Resources

- [Vercel Docs](https://vercel.com/docs)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Razorpay Docs](https://razorpay.com/docs)
- [Neon Documentation](https://neon.tech/docs)

---

## 📞 Support

- Vercel: support@vercel.com
- Neon: support@neon.tech
- Razorpay: contact form at razorpay.com

---

**You're ready to launch! 🚀**

Need help? Check the main README.md or BUILD_SUMMARY.md
