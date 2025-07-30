# 🚀 Deployment Guide - Crewmate Creator

## Quick Deployment Options

### 🌐 Vercel (Recommended)

**Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

**Step 2: Deploy**

```bash
vercel --prod
```

**Step 3: Set Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:

- `VITE_SUPABASE_URL` = Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

### 🟠 Netlify

**Step 1: Build the project**

```bash
npm run build
```

**Step 2: Deploy the `dist` folder to Netlify**

- Drag and drop the `dist` folder to netlify.com/drop
- Or connect your Git repository

**Step 3: Configure**

- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variables in Site Settings

### 🔷 Railway

**Step 1: Install Railway CLI**

```bash
npm install -g @railway/cli
```

**Step 2: Login and deploy**

```bash
railway login
railway link
railway up
```

## Environment Variables Setup

For all platforms, you need these environment variables:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Production Optimizations

### 🎯 Performance

- ✅ Code splitting enabled via Vite
- ✅ Tree shaking for minimal bundle size
- ✅ CSS optimization with Tailwind purging
- ✅ Image optimization (SVG icons)

### 🔒 Security

- ✅ Environment variables properly configured
- ✅ Supabase RLS policies enabled
- ✅ No sensitive data in client bundle

### 📱 PWA Features

- ✅ Manifest.json configured
- ✅ Mobile-optimized design
- ✅ Offline-ready icons

## Custom Domain Setup

### Vercel

1. Add domain in Vercel Dashboard
2. Update DNS records as instructed
3. SSL automatically configured

### Netlify

1. Add domain in Site Settings
2. Configure DNS settings
3. SSL automatically configured

## Monitoring & Analytics

### Recommended Tools

- **Vercel Analytics** - Built-in performance monitoring
- **Sentry** - Error tracking and performance monitoring
- **Google Analytics** - User behavior tracking

### Setup Sentry (Optional)

```bash
npm install @sentry/react @sentry/tracing
```

Add to your `main.jsx`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## Performance Checklist

- [ ] Bundle size < 500KB gzipped
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Mobile-friendly test passes
- [ ] All images optimized
- [ ] Fonts properly loaded

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Check case sensitivity
- Restart development server after changes

### Supabase Connection Issues

- Verify URL and key are correct
- Check Supabase project status
- Ensure RLS policies allow access

## Production URLs

Once deployed, your app will be available at:

- **Vercel**: `https://your-app.vercel.app`
- **Netlify**: `https://your-app.netlify.app`
- **Custom Domain**: `https://your-domain.com`

## Backup & Maintenance

### Regular Tasks

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Update dependencies monthly
- [ ] Backup Supabase data
- [ ] Review user feedback

### Update Process

```bash
# Update dependencies
npm update

# Test locally
npm run dev
npm run build

# Deploy
vercel --prod
```

---

**🎉 Your Crewmate Creator is now live and ready for users!**
