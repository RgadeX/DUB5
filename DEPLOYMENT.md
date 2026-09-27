# Deployment Guide for DUB5

## Quick Start to Vercel Deployment

### Step 1: Prepare Your Repository

```bash
# Navigate to your project
cd "C:\Users\Mohammed\Documents\Projects\Side Projects\DUB5-rcd"

# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial DUB5 PWA deployment"

# Create GitHub repository (do this on github.com first)
# Then add remote
git remote add origin https://github.com/YOUR_USERNAME/dub5.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel Website (Easiest)**
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a static site
5. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### Step 3: Verify Deployment

1. **Check PWA Installation**: Open your deployed site and look for the install prompt in the address bar
2. **Test Offline Mode**: Use DevTools Network tab, set to "Offline", and refresh
3. **Test Service Worker**: Check DevTools Application tab for registered service worker
4. **Run Lighthouse**: Run Lighthouse audit to check PWA criteria

## Important Configuration Details

### Vercel Configuration (`vercel.json`)

The `vercel.json` file handles:
- **Service Worker Headers**: Critical for SW updates (no-cache on sw.js)
- **Security Headers**: XSS protection, frame options
- **Routing**: Ensures all routes work correctly

### Service Worker Caching Strategy

The service worker uses:
- **App Shell**: Cache-first (instant loading)
- **Games**: Cache on first play
- **API**: Network-first (when implemented)
- **Fallback**: Offline page when network fails

### Build Versioning

To force cache updates:
1. Update `CACHE_VERSION` in `sw.js` (currently `1.0.0`)
2. Update `CACHE_BUILD` in `sw.js` (currently `001`)
3. Deploy to Vercel
4. Users will see "Nieuwe versie beschikbaar" toast

## School WiFi Deployment

For school deployment, the key is that students need to:

1. **First Visit at Home**: Open the site at home or on mobile data
2. **Download All Content**: Click "Alles offline opslaan" button
3. **Install as PWA**: Click "Installeren" in browser
4. **Use at School**: Open the installed app - works completely offline

## Troubleshooting Deployment Issues

### Service Worker Not Registering
- Ensure HTTPS is enabled (automatic on Vercel)
- Check browser console for errors
- Verify sw.js path is correct in sw-register.js

### Icons Not Showing
- Ensure PNG files exist in `assets/icons/`
- Check manifest paths are correct
- Icons should be 192x192 and 512x512

### Offline Mode Not Working
- Verify service worker is active in DevTools
- Check cache storage in Application tab
- Test with DevTools Network set to "Offline"

### Build Process Issues
- This is a static site - no build step required
- If you add a build step, update `vercel.json`
- Ensure all paths are relative (no absolute paths)

## Performance Optimization

### Before Deployment
- Test with Lighthouse (target: 90+ performance)
- Check bundle sizes (keep < 60KB app shell)
- Test on slow 3G connection
- Verify 60 FPS gameplay

### After Deployment
- Monitor Core Web Vitals in Vercel Analytics
- Check service worker update frequency
- Test on real devices (Chromebooks for school use)

## Domain Configuration (Optional)

### Custom Domain on Vercel
1. Go to Vercel project settings
2. Add custom domain
3. Update DNS records as instructed
4. Update manifest domain if needed

### SSL Certificates
- Vercel provides automatic SSL
- No additional configuration needed
- Essential for service workers

## Monitoring and Analytics

### Vercel Analytics
- Automatic on Vercel
- Monitor page loads, geography, devices
- Track performance metrics

### Error Tracking
- Check Vercel logs for deployment errors
- Monitor browser console for runtime errors
- Log service worker failures

## Continuous Deployment

### Automatic Deployments
- Connect GitHub repository to Vercel
- Enable automatic deployments on push to main
- Configure preview deployments for pull requests

### Manual Deployment
```bash
# Make changes
git add .
git commit -m "Update description"
git push

# Vercel will auto-deploy if configured
# Or manually: vercel --prod
```

## Rollback Procedure

If something goes wrong:

```bash
# Revert to previous commit
git revert HEAD
git push

# Vercel will auto-deploy the rollback
# Or manually: vercel --prod --prebuilt-url <previous-deployment-url>
```

## Cost and Limits

### Vercel Free Tier
- ✅ Unlimited static sites
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ 100GB bandwidth/month
- ✅ Perfect for DUB5

### Scaling
- If you exceed free tier limits, upgrade to Pro
- For educational use, consider Vercel for Teams
- Alternatively, use Netlify or GitHub Pages (free)

## Alternative Deployment Platforms

### GitHub Pages
```bash
# Create gh-pages branch
git checkout -b gh-pages
git push origin gh-pages

# Enable GitHub Pages in repo settings
# Source: gh-pages branch
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## Maintenance Checklist

### Regular Tasks
- [ ] Update cache version after major changes
- [ ] Test offline functionality monthly
- [ ] Check Lighthouse scores quarterly
- [ ] Update dependencies annually
- [ ] Review security headers periodically

### Security
- [ ] Keep dependencies updated
- [ ] Monitor for vulnerabilities
- [ ] Review user content policies
- [ ] Test on various browsers

## Support and Documentation

### User Documentation
- Keep README.md updated
- Include installation instructions
- Document offline usage
- Provide troubleshooting guide

### Developer Documentation
- Comment complex code sections
- Update architecture diagrams
- Document API contracts
- Maintain changelog

---

**Next Steps:**
1. Test locally at http://localhost:3000
2. Create GitHub repository
3. Deploy to Vercel
4. Test PWA installation
5. Share with users!
