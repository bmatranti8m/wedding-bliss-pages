# Deployment Guide

This guide will help you deploy your wedding website to a real domain.

## Quick Deploy to GitHub Pages

Your site is now configured for automatic deployment via GitHub Actions!

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/bmatranti8m/wedding-bliss-pages
2. Click **Settings** (top right)
3. Click **Pages** in the left sidebar
4. Under **Build and deployment**:
   - Source: Select **GitHub Actions**
5. Click **Save**

### Step 2: Push Your Code

```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Step 3: Wait for Deployment

- Go to the **Actions** tab in your GitHub repo
- Watch the deployment workflow run (takes 2-3 minutes)
- Once complete, your site will be live at:

  **https://bmatranti8m.github.io/wedding-bliss-pages/**

---

## Using a Custom Domain

To use your own domain (e.g., `bogdanandcorina.com`), follow these steps:

### Option A: Apex Domain (e.g., `bogdanandcorina.com`)

1. **Create CNAME file** in your project:
   ```bash
   echo "your-domain.com" > public/CNAME
   ```

2. **Configure DNS at your domain registrar** (GoDaddy, Namecheap, etc.):
   Add these **A Records**:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

3. **Update GitHub Pages settings**:
   - Go to repository Settings → Pages
   - In "Custom domain", enter: `your-domain.com`
   - Check "Enforce HTTPS"

### Option B: Subdomain (e.g., `www.bogdanandcorina.com`)

1. **Create CNAME file**:
   ```bash
   echo "www.your-domain.com" > public/CNAME
   ```

2. **Add CNAME record at your domain registrar**:
   ```
   Type: CNAME
   Name: www
   Value: bmatranti8m.github.io
   ```

3. **Update GitHub Pages settings** (same as above)

### Option C: Update Vite Config for Custom Domain

If using a custom domain, update `vite.config.ts`:

```typescript
base: mode === "production" ? "/" : "/",
```

(Remove the `/wedding-bliss-pages/` path)

---

## Alternative: Deploy to Netlify or Vercel

### Netlify (Easiest)

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy"
6. Add custom domain in site settings

### Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Framework preset: Vite
5. Click "Deploy"
6. Add custom domain in project settings

**Note:** For Netlify/Vercel, update `vite.config.ts`:
```typescript
base: mode === "production" ? "/" : "/",
```

---

## Environment Variables

If you need to add environment variables (API keys, etc.):

**GitHub Pages:**
- Go to Settings → Secrets and variables → Actions
- Add your secrets

**Netlify/Vercel:**
- Add them in the project dashboard under Environment Variables

---

## Testing Before Deploy

Test the production build locally:

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` to see your site as it will appear in production.

---

## Troubleshooting

### Site not loading after deployment
- Check GitHub Actions logs for errors
- Verify base path in `vite.config.ts` matches your deployment
- Check browser console for 404 errors

### Custom domain not working
- Wait 24-48 hours for DNS propagation
- Verify DNS records with `dig your-domain.com`
- Check GitHub Pages settings show your domain

### Assets not loading (404 errors)
- Ensure `base` in `vite.config.ts` is correct
- Check that assets are in `public/` or properly imported

---

## Quick Commands

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Deploy (build and reminder to push)
npm run deploy

# Push to trigger deployment
git add . && git commit -m "Deploy" && git push
```

---

Need help? Check the GitHub Actions logs or open an issue in your repository.
