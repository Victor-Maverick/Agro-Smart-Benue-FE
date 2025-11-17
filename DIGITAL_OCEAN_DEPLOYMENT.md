# Digital Ocean + Nginx Deployment Guide

## Prerequisites
- Digital Ocean Droplet (Ubuntu 20.04/22.04)
- Domain pointed to your droplet IP
- SSH access to your server

## Step 1: Server Setup

### 1.1 Connect to your server
```bash
ssh root@your-server-ip
```

### 1.2 Install Node.js (v18 or higher)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should show v18.x or higher
```

### 1.3 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 1.4 Install Nginx
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 2: Deploy Your Application

### 2.1 Create application directory
```bash
mkdir -p /var/www/bfpc-app
cd /var/www/bfpc-app
```

### 2.2 Clone your repository (or upload files)
```bash
# Option 1: Using Git
git clone https://github.com/your-username/bfpc-app.git .

# Option 2: Using SCP from your local machine
# scp -r /path/to/bfpc-app/* root@your-server-ip:/var/www/bfpc-app/
```

### 2.3 Create .env.production.local file
```bash
nano .env.production.local
```

Paste this content:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.agrosmartbenue.com
NEXTAUTH_URL=https://agrosmartbenue.com
NEXTAUTH_SECRET=prod-bfpc-2024-f7e6d5c4b3a29018fedcba9876543210fedcba9876543210fedcba9876543210
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeRVQssAAAAAFFVrXBgCpPNyDPb1SqD1sI4Ywqm
RECAPTCHA_SECRET_KEY=6LeRVQssAAAAAFkjnRTOFmd1-Te-43VSZ7gtpQSU
NEXT_PUBLIC_WEATHER_API_KEY=84a36ddea24d4e23b61115004250811
NODE_ENV=production
```

Save with `Ctrl+X`, then `Y`, then `Enter`

### 2.4 Install dependencies and build
```bash
npm install
npm run build
```

### 2.5 Start with PM2
```bash
pm2 start npm --name "bfpc-app" -- start
pm2 save
pm2 startup
```

## Step 3: Configure Nginx

### 3.1 Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/agrosmartbenue.com
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name agrosmartbenue.com www.agrosmartbenue.com;

    # Redirect HTTP to HTTPS (after SSL is set up)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Image optimization
    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
    }
}
```

### 3.2 Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/agrosmartbenue.com /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

## Step 4: Set Up SSL with Let's Encrypt

### 4.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 4.2 Get SSL certificate
```bash
sudo certbot --nginx -d agrosmartbenue.com -d www.agrosmartbenue.com
```

Follow the prompts. Certbot will automatically configure HTTPS.

### 4.3 Update Nginx config for HTTPS
After SSL is set up, your config will look like:
```nginx
server {
    listen 80;
    server_name agrosmartbenue.com www.agrosmartbenue.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name agrosmartbenue.com www.agrosmartbenue.com;

    ssl_certificate /etc/letsencrypt/live/agrosmartbenue.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/agrosmartbenue.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
    }
}
```

## Step 5: Backend API CORS Configuration

Your Spring Boot backend needs to allow requests from your frontend domain.

Update your backend CORS configuration:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "https://agrosmartbenue.com",
                        "https://www.agrosmartbenue.com",
                        "http://localhost:3000" // For development
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
```

## Step 6: Deployment Commands

### Update application
```bash
cd /var/www/bfpc-app
git pull  # If using git
npm install
npm run build
pm2 restart bfpc-app
```

### View logs
```bash
pm2 logs bfpc-app
```

### Monitor application
```bash
pm2 monit
```

### Check status
```bash
pm2 status
```

## Step 7: Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

## Troubleshooting

### Check if app is running
```bash
pm2 status
curl http://localhost:3000
```

### Check Nginx status
```bash
sudo systemctl status nginx
sudo nginx -t
```

### View Nginx logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Restart services
```bash
pm2 restart bfpc-app
sudo systemctl restart nginx
```

### Check environment variables
```bash
cd /var/www/bfpc-app
cat .env.production.local
```

## Security Best Practices

1. **Never commit `.env.production.local` to git**
2. **Use strong NEXTAUTH_SECRET** (generate with `openssl rand -base64 32`)
3. **Keep SSL certificates updated** (Certbot auto-renews)
4. **Regular updates**: `sudo apt update && sudo apt upgrade`
5. **Monitor logs regularly**: `pm2 logs bfpc-app`

## Automatic Deployment (Optional)

Create a deployment script:
```bash
nano /var/www/bfpc-app/deploy.sh
```

```bash
#!/bin/bash
cd /var/www/bfpc-app
git pull
npm install
npm run build
pm2 restart bfpc-app
echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x /var/www/bfpc-app/deploy.sh
```

Run deployment:
```bash
./deploy.sh
```
