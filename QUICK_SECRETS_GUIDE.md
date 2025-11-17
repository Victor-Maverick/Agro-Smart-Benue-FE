# Quick GitHub Secrets Setup

## 🚀 Fast Track Guide

### Step 1: Go to GitHub Secrets
```
Your Repo → Settings → Secrets and variables → Actions → New repository secret
```

### Step 2: Add These 11 Secrets

Copy and paste each one:

---

#### 1. DOCKERHUB_USERNAME
```
victormsonter
```

#### 2. DOCKERHUB_TOKEN
```
<Get from https://hub.docker.com/settings/security>
```

#### 3. VM_HOST
```
<Your Digital Ocean IP address>
```

#### 4. VM_USER
```
root
```

#### 5. VM_PASSWORD
```
<Your server password>
```

#### 6. NEXT_PUBLIC_API_BASE_URL
```
https://api.agrosmartbenue.com
```

#### 7. NEXTAUTH_URL
```
https://agrosmartbenue.com
```

#### 8. NEXTAUTH_SECRET
```
prod-bfpc-2024-f7e6d5c4b3a29018fedcba9876543210fedcba9876543210fedcba9876543210
```

#### 9. NEXT_PUBLIC_RECAPTCHA_SITE_KEY
```
6LeRVQssAAAAAFFVrXBgCpPNyDPb1SqD1sI4Ywqm
```

#### 10. RECAPTCHA_SECRET_KEY
```
6LeRVQssAAAAAFkjnRTOFmd1-Te-43VSZ7gtpQSU
```

#### 11. NEXT_PUBLIC_WEATHER_API_KEY
```
84a36ddea24d4e23b61115004250811
```

---

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Configure CI/CD with GitHub Secrets"
git push origin main
```

### Step 4: Watch Deployment
Go to **Actions** tab and watch your app deploy automatically! 🎉

---

## ✅ Checklist

- [ ] Added DOCKERHUB_USERNAME
- [ ] Added DOCKERHUB_TOKEN
- [ ] Added VM_HOST
- [ ] Added VM_USER
- [ ] Added VM_PASSWORD
- [ ] Added NEXT_PUBLIC_API_BASE_URL
- [ ] Added NEXTAUTH_URL
- [ ] Added NEXTAUTH_SECRET
- [ ] Added NEXT_PUBLIC_RECAPTCHA_SITE_KEY
- [ ] Added RECAPTCHA_SECRET_KEY
- [ ] Added NEXT_PUBLIC_WEATHER_API_KEY
- [ ] Pushed code to GitHub
- [ ] Verified deployment in Actions tab

Done! 🚀
