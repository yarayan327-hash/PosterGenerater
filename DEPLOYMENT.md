# Vercel Deployment Instructions

This project is now ready for Vercel deployment. Since the repository is already pushed to GitHub, you have two options:

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New Project"
3. Import the GitHub repository: `yarayan327-hash/PosterGenerater`
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: Your actual Gemini API key
6. Click "Deploy"

## Option 2: Deploy via Vercel CLI

```bash
# 1. Login to Vercel (will open browser)
vercel login

# 2. Deploy to production
vercel --prod

# 3. When prompted, add the VITE_GEMINI_API_KEY environment variable
```

## Post-Deployment Configuration

After deployment, you'll need to:

1. **Add Environment Variable in Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add `VITE_GEMINI_API_KEY` with your actual API key
   - Redeploy the application

2. **Verify the deployment**:
   - Check that the site loads correctly
   - Test generating a poster with real data
   - Verify the download functionality works

## Expected Production URL

Once deployed, your site will be available at:
```
https://poster-generater.vercel.app
```

Or a custom URL if you've configured one.

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Check that all dependencies are installed: `npm install`
2. Verify the build locally: `npm run build`
3. Check the Vercel deployment logs

### API Key Issues

If the AI generation doesn't work:

1. Verify `VITE_GEMINI_API_KEY` is set in Vercel environment variables
2. Ensure the API key is valid and active
3. Check the Gemini API quota

### CORS Issues

If you encounter CORS errors with images:

1. The current configuration uses `crossOrigin="anonymous"`
2. Verify that image sources support CORS
3. Check Vercel's edge network configuration

## Monitoring

- Monitor deployment logs in Vercel Dashboard
- Check Vercel Analytics for performance metrics
- Set up error tracking (e.g., Sentry) for production
