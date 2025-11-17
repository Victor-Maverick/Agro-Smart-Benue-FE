# Quick Deployment Guide for Digital Ocean

## 🚀 Fast Track Deployment

### On Your Server (SSH into Digital Ocean):

```bash
# 1. Navigate to your app directory
cd /var/www/bfpc-app

# 2. Create environment file
nano .env.production.local
```

**Paste this and save (Ctrl+X, Y, Enter):**
```env
NEXT_PUBLIC_API_BASE_URL=https://api.agrosmartbenue.com
NEXTAUTH_URL=https://agrosmartbenue.com
NEXTAUTH_SECRET=prod-bfpc-2024-f7e6d5c4b3a29018fedcba9876543210fedcba9876543210fedcba9876543210
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeRVQssAAAAAFFVrXBgCpPNyDPb1SqD1sI4Ywqm
RECAPTCHA_SECRET_KEY=6LeRVQssAAAAAFkjnRTOFmd1-Te-43VSZ7gtpQSU
NEXT_PUBLIC_WEATHER_API_KEY=84a36ddea24d4e23b61115004250811
NODE_ENV=production
```

```bash
# 3. Build and restart
npm install
npm run build
pm2 restart bfpc-app

# 4. Check if it's working
pm2 logs bfpc-app
```

## 🔧 Fix CORS Error

Your backend needs to allow requests from your frontend. Add this to your Spring Boot backend:

**File: `CorsConfig.java`**
```java
package dev.gagnon.bfpcapi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(
                "https://agrosmartbenue.com",
                "https://www.agrosmartbenue.com",
                "http://localhost:3000"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

Then rebuild and restart your backend:
```bash
cd /path/to/backend
mvn clean package
# Restart your Spring Boot app
```

## ✅ Verification

After deployment, check:

1. **Visit your site**: https://agrosmartbenue.com
2. **Open browser console** (F12)
3. **Look for**:
   - No `undefined` in URLs
   - API calls go to `https://api.agrosmartbenue.com`
   - No CORS errors
4. **Test login** to verify NextAuth works

## 🆘 Quick Troubleshooting

### Still seeing `localhost:8080`?
```bash
# Clear Next.js cache and rebuild
cd /var/www/bfpc-app
rm -rf .next
npm run build
pm2 restart bfpc-app
```

### CORS errors?
- Check backend CORS configuration
- Verify backend is running
- Check backend logs

### NextAuth 500 error?
```bash
# Verify environment variables are set
cat .env.production.local
# Should show all variables
```

### App not starting?
```bash
pm2 logs bfpc-app --lines 100
# Look for errors in the logs
```

## 📞 Need Help?

Check the full guide: `DIGITAL_OCEAN_DEPLOYMENT.md`
