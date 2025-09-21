# Vercel Deployment Guide

Your e-commerce application is now ready for deployment on Vercel! Follow these steps:

## Prerequisites
1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`

## Deployment Steps

### Option 1: Deploy via GitHub (Recommended)
1. Push your code to a GitHub repository
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the configuration from `vercel.json`
6. Click "Deploy"

### Option 2: Deploy via CLI
1. Open terminal in your project directory
2. Run: `vercel`
3. Follow the prompts to link/create a project
4. Vercel will build and deploy automatically

## Configuration Details

✅ **vercel.json** - Configured for:
- Static build with Vite
- Serverless functions for API routes
- Proper routing for SPA and API calls
- Static asset serving

✅ **API Routes** - Converted to Vercel serverless functions:
- `/api/products` - Get all products with filters
- `/api/products/[id]` - Get single product
- `/api/filters` - Get available filters

✅ **Static Assets** - Images copied to public directory for serving

## Environment Variables
No additional environment variables needed for this deployment.

## Post-Deployment
- Your app will be available at: `https://your-project-name.vercel.app`
- API endpoints will work automatically
- All images and static assets will be served correctly

## Troubleshooting
- If images don't load, check that `attached_assets` are properly copied to `public/`
- If API calls fail, verify the routes in `vercel.json` match your API structure
- Check Vercel function logs in the dashboard for any serverless function errors

## Custom Domain (Optional)
1. Go to your project settings in Vercel dashboard
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions