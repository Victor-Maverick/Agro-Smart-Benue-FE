# Deployment Guide for BFPC Application

## Required Environment Variables

### For Production Deployment (Vercel/Netlify/etc.)

You MUST set these environment variables in your hosting platform's dashboard:

### 1. API Configuration
```
NEXT_PUBLIC_API_BASE_URL=https://api.agrosmartbenue.com
```

### 2. NextAuth Configuration (CRITICAL)
```
NEXTAUTH_URL=https://agrosmartbenue.com
NEXTAUTH_SECRET=prod-bfpc-2024-f7e6d5c4b3a29018fedcba9876543210fedcba9876543210fedcba9876543210
```

**Important Notes:**
- `NEXTAUTH_URL` must be your FRONTEND domain (where Next.js app is hosted)
- `NEXTAUTH_SECRET` must be a long random string (minimum 32 characters)
- Generate a new secret with: `openssl rand -base64 32`

### 3. ReCAPTCHA
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeRVQssAAAAAFFVrXBgCpPNyDPb1SqD1sI4Ywqm
RECAPTCHA_SECRET_KEY=6LeRVQssAAAAAFkjnRTOFmd1-Te-43VSZ7gtpQSU
```

### 4. Weather API
```
NEXT_PUBLIC_WEATHER_API_KEY=84a36ddea24d4e23b61115004250811
```

## Deployment Steps

### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable above
4. Redeploy your application

### Netlify
1. Go to Site settings → Build & deploy → Environment
2. Add each variable above
3. Trigger a new deploy

### Docker/VPS
1. Create a `.env.production.local` file with the variables above
2. Or set them in your docker-compose.yml or systemd service file

## Troubleshooting

### "undefined/api/..." errors
- **Cause:** `NEXT_PUBLIC_API_BASE_URL` is not set
- **Fix:** Add the environment variable in your hosting platform

### NextAuth 500 errors
- **Cause:** Missing `NEXTAUTH_SECRET` or `NEXTAUTH_URL`
- **Fix:** Add both variables in your hosting platform
- **Verify:** `NEXTAUTH_URL` should match your frontend domain exactly

### CORS errors
- **Cause:** Backend not allowing requests from frontend domain
- **Fix:** Update backend CORS configuration to allow `https://agrosmartbenue.com`

## Verification

After deployment, check:
1. Open browser console on your site
2. Look for "App Configuration" log (in development)
3. Verify no "undefined" in API URLs
4. Test login functionality
5. Check that API calls go to `https://api.agrosmartbenue.com`

## Security Notes

- Never commit `.env.production.local` to git
- Rotate `NEXTAUTH_SECRET` periodically
- Use different secrets for development and production
- Keep ReCAPTCHA keys secure
