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
- Static build with Vite from client directory
- Output directory: `dist/public`
- Serverless functions for API routes
- SPA routing fallback

✅ **API Routes** - Converted to Vercel serverless functions:
- `/api/products` - Get all products with filters
- `/api/products/[id]` - Get single product
- `/api/filters` - Get available filters

✅ **Static Assets** - Images copied to `client/public/` for Vite build process

✅ **Build Process**:
- Vite builds the React app from `client/` directory
- Assets are automatically copied from `client/public/` to build output
- API functions are deployed as serverless functions

## Environment Variables
No additional environment variables needed for this deployment.

## Post-Deployment
- Your app will be available at: `https://your-project-name.vercel.app`
- API endpoints will work automatically: `/api/products`, `/api/filters`, etc.
- All images and static assets will be served correctly from the build

## Important Notes
- The app uses in-memory storage, so data resets on each serverless function cold start
- For production, consider using a persistent database like Vercel Postgres or external DB
- Images are now served from the build output, not the original attached_assets directory

## Troubleshooting
- If build fails, ensure all dependencies are in `package.json` dependencies (not devDependencies)
- If API calls fail, check the Network tab for 404s and verify routes in `vercel.json`
- Check Vercel function logs in the dashboard for serverless function errors
- If images don't load, verify they're in `client/public/attached_assets/`

## Custom Domain (Optional)
1. Go to your project settings in Vercel dashboard
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions