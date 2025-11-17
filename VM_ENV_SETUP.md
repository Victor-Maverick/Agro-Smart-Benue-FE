# Virtual Machine Environment Setup Guide

## Step 1: SSH into Your Digital Ocean Droplet

```bash
ssh root@your-server-ip
```

## Step 2: Create Directory for Environment Files

```bash
# Create directory if it doesn't exist
mkdir -p /srv/agrosmart

# Set proper permissions
chmod 700 /srv/agrosmart
```

## Step 3: Create Frontend Environment File

```bash
nano /srv/agrosmart/frontend.env
```

**Paste this content:**

```env
# Node Environment
NODE_ENV=production

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.agrosmartbenue.com

# NextAuth Configuration
NEXTAUTH_URL=https://agrosmartbenue.com
NEXTAUTH_SECRET=prod-bfpc-2024-f7e6d5c4b3a29018fedcba9876543210fedcba9876543210fedcba9876543210

# ReCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeRVQssAAAAAFFVrXBgCpPNyDPb1SqD1sI4Ywqm
RECAPTCHA_SECRET_KEY=6LeRVQssAAAAAFkjnRTOFmd1-Te-43VSZ7gtpQSU

# Weather API
NEXT_PUBLIC_WEATHER_API_KEY=84a36ddea24d4e23b61115004250811
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

## Step 4: Verify Backend Environment File Exists

```bash
# Check if backend env file exists
cat /srv/agrosmart/app.env
```

If it doesn't exist, create it:

```bash
nano /srv/agrosmart/app.env
```

**Paste your backend environment variables** (database, JWT keys, etc.)

## Step 5: Set Proper Permissions

```bash
# Secure the environment files
chmod 600 /srv/agrosmart/frontend.env
chmod 600 /srv/agrosmart/app.env

# Verify permissions
ls -la /srv/agrosmart/
```

Expected output:
```
-rw------- 1 root root  xxx app.env
-rw------- 1 root root  xxx frontend.env
```

## Step 6: Create Docker Network (if not exists)

```bash
# Check if network exists
docker network ls | grep agrosmart-network

# If not, create it
docker network create agrosmart-network
```

## Step 7: Restart Containers with New Configuration

### Stop all containers
```bash
docker stop agrosmart-frontend agrosmart-backend benfarm-postgres
docker rm agrosmart-frontend agrosmart-backend
```

### Start PostgreSQL (if not running)
```bash
docker run -d \
  --name benfarm-postgres \
  --network agrosmart-network \
  -e POSTGRES_DB=bfpc_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:17
```

### Start Backend
```bash
docker run -d \
  --name agrosmart-backend \
  --network agrosmart-network \
  --env-file /srv/agrosmart/app.env \
  -p 8983:8983 \
  victormsonter/agrosmart-backend:latest
```

### Start Frontend
```bash
docker run -d \
  --name agrosmart-frontend \
  --network agrosmart-network \
  --env-file /srv/agrosmart/frontend.env \
  -p 3000:3000 \
  victormsonter/agrosmart-frontend:latest
```

## Step 8: Verify Everything is Running

```bash
# Check container status
docker ps

# Check frontend logs
docker logs agrosmart-frontend

# Check backend logs
docker logs agrosmart-backend

# Verify environment variables are loaded
docker exec agrosmart-frontend env | grep NEXT_PUBLIC_API_BASE_URL
# Should output: NEXT_PUBLIC_API_BASE_URL=https://api.agrosmartbenue.com
```

## Step 9: Test the Application

1. **Visit your site:** https://agrosmartbenue.com
2. **Open browser console** (F12)
3. **Check Network tab** - API calls should go to `https://api.agrosmartbenue.com`
4. **Test login** to verify NextAuth works
5. **Check for errors** - No CORS errors, no `localhost` references

## Troubleshooting

### Frontend still calling localhost:8080?

```bash
# Rebuild the image with environment variables
docker stop agrosmart-frontend
docker rm agrosmart-frontend
docker pull victormsonter/agrosmart-frontend:latest
docker run -d \
  --name agrosmart-frontend \
  --network agrosmart-network \
  --env-file /srv/agrosmart/frontend.env \
  -p 3000:3000 \
  victormsonter/agrosmart-frontend:latest
```

### Check if environment variables are loaded

```bash
docker exec agrosmart-frontend env
```

### View real-time logs

```bash
docker logs -f agrosmart-frontend
```

### CORS errors?

Make sure backend is running and accessible:
```bash
curl http://localhost:8983/api/health
```

## Security Best Practices

1. **Never commit environment files to git**
   - `.env*` files are gitignored
   - Environment files stay only on the server

2. **Secure file permissions**
   - Environment files: `chmod 600` (only root can read/write)
   - Directory: `chmod 700` (only root can access)

3. **Rotate secrets regularly**
   - Update `NEXTAUTH_SECRET` periodically
   - Generate new secret: `openssl rand -base64 32`

4. **Backup environment files**
   ```bash
   cp /srv/agrosmart/frontend.env /srv/agrosmart/frontend.env.backup
   cp /srv/agrosmart/app.env /srv/agrosmart/app.env.backup
   ```

## Automated Deployment

Once environment files are set up, your CI/CD pipeline will:

1. Build Docker image
2. Push to Docker Hub
3. SSH into server
4. Pull latest image
5. Stop old container
6. Start new container with `--env-file /srv/agrosmart/frontend.env`
7. Environment variables are automatically loaded ✅

## Quick Reference Commands

```bash
# View environment files
cat /srv/agrosmart/frontend.env
cat /srv/agrosmart/app.env

# Edit environment files
nano /srv/agrosmart/frontend.env
nano /srv/agrosmart/app.env

# Restart frontend
docker restart agrosmart-frontend

# Restart backend
docker restart agrosmart-backend

# View logs
docker logs -f agrosmart-frontend
docker logs -f agrosmart-backend

# Check running containers
docker ps

# Check network
docker network inspect agrosmart-network
```

## Next Steps

1. ✅ Create environment files on VM
2. ✅ Restart containers with `--env-file`
3. ✅ Verify application works
4. ✅ Push code to GitHub
5. ✅ CI/CD will automatically deploy with correct environment

Your application will now use `https://api.agrosmartbenue.com` instead of `localhost:8080`! 🎉
