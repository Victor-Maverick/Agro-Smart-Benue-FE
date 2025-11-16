# GitHub Secrets Setup Guide

This guide will help you configure the required GitHub Secrets for your CI/CD pipeline.

## Required GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### 1. Docker Hub Credentials
- **DOCKERHUB_USERNAME**: Your Docker Hub username
- **DOCKERHUB_TOKEN**: Your Docker Hub access token

### 2. DigitalOcean VM Credentials
- **VM_HOST**: Your DigitalOcean droplet IP address
- **VM_USER**: SSH username (usually `root`)
- **VM_PASSWORD**: SSH password for the VM

### 3. NextAuth Configuration
- **NEXTAUTH_SECRET**: 
  ```
  prod-bfpc-2024-f7e6d5c4b3a29018fedcba9876543210fedcba9876543210fedcba9876543210
  ```
- **NEXTAUTH_URL**: 
  ```
  https://agrosmartbenue.com
  ```

### 4. API Configuration
- **NEXT_PUBLIC_API_URL**: 
  ```
  https://api.agrosmartbenue.com
  ```
- **NEXT_PUBLIC_API_BASE_URL**: 
  ```
  https://api.agrosmartbenue.com
  ```

### 5. ReCAPTCHA Configuration
- **NEXT_PUBLIC_RECAPTCHA_SITE_KEY**: 
  ```
  6LeRVQssAAAAAFFVrXBgCpPNyDPb1SqD1sI4Ywqm
  ```
- **RECAPTCHA_SECRET_KEY**: 
  ```
  6LeRVQssAAAAAFkjnRTOFmd1-Te-43VSZ7gtpQSU
  ```

### 6. Weather API
- **NEXT_PUBLIC_WEATHER_API_KEY**: 
  ```
  84a36ddea24d4e23b61115004250811
  ```

## How to Add Secrets

1. Go to your GitHub repository
2. Click on **Settings**
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter the **Name** (e.g., `NEXTAUTH_SECRET`)
6. Enter the **Value** (copy from above)
7. Click **Add secret**
8. Repeat for all secrets listed above

## Verification

After adding all secrets, you can verify by:
1. Going to Settings → Secrets and variables → Actions
2. You should see all 11 secrets listed
3. Push a commit to the `main` branch to trigger the CI/CD pipeline
4. Check the Actions tab to see if the deployment succeeds

## Security Notes

- ✅ Never commit secrets to your repository
- ✅ Use different secrets for development and production
- ✅ Rotate secrets regularly (especially NEXTAUTH_SECRET)
- ✅ Keep your Docker Hub token secure
- ✅ Use SSH keys instead of passwords when possible

## Troubleshooting

If you get "NO_SECRET" error:
1. Verify NEXTAUTH_SECRET is added to GitHub Secrets
2. Check the secret name matches exactly (case-sensitive)
3. Redeploy by pushing a new commit
4. Check Docker container logs: `docker logs agrosmart-frontend`

If environment variables are not working:
1. SSH into your VM
2. Check running containers: `docker ps`
3. Inspect container environment: `docker inspect agrosmart-frontend`
4. Check logs: `docker logs agrosmart-frontend`
