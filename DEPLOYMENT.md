# Vercel Deployment Guide

This guide covers deploying both the backend and frontend to Vercel.

## Option 1: Separate Projects (Recommended)

Deploy the backend and frontend as two independent Vercel projects.

### Backend Deployment

1. **Push code to a Git repository**

2. **Create new Vercel project** at [vercel.com/new](https://vercel.com/new)

3. **Configure the project:**
   - Root Directory: `backend`
   - Framework Preset: `Other` (will auto-detect Node.js)
   - Build Command: `npm run build`
   - Install Command: `npm install`

4. **Environment Variables** (add in Vercel dashboard → Settings → Environment Variables):
   ```
   PORT = 3000
   CORS_ORIGIN = <your-frontend-url>
   ```

5. **Deploy** - Vercel will auto-deploy on push to main branch

### Frontend Deployment

1. **Create another Vercel project** from the same repo

2. **Configure the project:**
   - Root Directory: `frontend`
   - Framework Preset: `Next.js`
   - Build Command: `npm run build` (default)
   - Install Command: `npm install`

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL = <your-backend-url>/api
   ```

4. **Deploy**

## Option 2: Monorepo with Root vercel.json

For a single Vercel project managing both with `/api/*` routes going to backend:

### Root vercel.json

```json
{
  "version": 2,
  "builds": [
    { "src": "backend/package.json", "use": "@vercel/node" },
    { "src": "frontend/package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/backend/src/index.ts" },
    { "src": "/(.*)", "dest": "/frontend/$1" }
  ]
}
```

### Frontend Configuration

Update `frontend/src/utils/api.ts` to use relative URLs:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
```

## Important Notes

1. **Cold Starts**: The backend loads Quran data (~2-3 seconds) on first request. Expect slower initial response.

2. **API_URL Configuration**: The frontend uses `NEXT_PUBLIC_API_URL` for API calls. In production with separate deployments, this should point to your backend URL.

3. **CORS**: Ensure `CORS_ORIGIN` in backend includes your frontend URL.

4. **Rate Limiting**: API has 300 requests/15min limit. Adjust if needed for production.