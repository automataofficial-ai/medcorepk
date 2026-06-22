# MedCore Deployment Guide

## 🚀 Automatic Deployment (GitHub Actions)

Your app now automatically deploys whenever you push to the `main` branch!

### How It Works:

1. ✅ You make changes locally
2. ✅ Commit and push to GitHub (`main` branch)
3. ✅ GitHub Actions automatically triggers
4. ✅ Your VPS is updated with latest code
5. ✅ Docker container rebuilds and restarts
6. ✅ App is live in ~2-3 minutes

### Check Deployment Status:

1. Go to your GitHub repo
2. Click **Actions** tab
3. See the latest deployment run
4. Green checkmark = ✅ Success
5. Red X = ❌ Failed (check logs)

---

## 📝 Standard Workflow (No Manual SSH Needed)

### Step 1: Make Changes Locally

```bash
# Edit your files in VS Code
# For example: update dashboard, logo, etc.
```

### Step 2: Commit and Push

```powershell
# In PowerShell/Terminal
cd e:\medcorepk

git add .
git commit -m "feat: update dashboard design"
git push origin main
```

### Step 3: Wait for Automatic Deployment

- GitHub Actions runs automatically (~2-3 minutes)
- Check status: GitHub repo → Actions tab
- Your production URL updates automatically

### Step 4: Verify

- Open your production URL
- Do a hard refresh: `Ctrl + Shift + R`
- See your changes live! 🎉

---

## 🔧 Manual Deployment (If Needed)

If you need to deploy immediately without waiting for GitHub Actions:

### Option 1: Using SSH (Quick Manual Deploy)

```bash
ssh root@YOUR_VPS_IP

cd /opt/medcore
git pull origin main
docker build --no-cache --pull -t medcore:latest .
docker rm -f medcore
docker run -d --name medcore --restart unless-stopped -p 3001:3001 medcore:latest
sleep 10 && docker logs medcore
```

### Option 2: One-Line Command

```bash
ssh root@YOUR_VPS_IP "cd /opt/medcore && git pull origin main && docker build --no-cache --pull -t medcore:latest . && docker rm -f medcore && docker run -d --name medcore --restart unless-stopped -p 3001:3001 medcore:latest && sleep 10 && docker logs medcore"
```

---

## 📊 Deployment Troubleshooting

### Check Deployment Logs on GitHub

```
GitHub Repo → Actions → Click Latest Workflow → Check Logs
```

### SSH into VPS and Check Container Status

```bash
ssh root@YOUR_VPS_IP

# See all containers
docker ps -a

# View logs
docker logs medcore

# Check if running
curl http://localhost:3001

# Restart container
docker restart medcore
```

### Common Issues

| Issue | Solution |
|-------|----------|
| **Port 3001 already in use** | `docker rm -f medcore` then rebuild |
| **Build fails** | Check GitHub Actions logs for errors |
| **Container won't start** | `docker logs medcore` to see error |
| **Changes not showing** | Hard refresh browser: `Ctrl + Shift + R` |
| **Deployment stuck** | Check if GitHub Actions workflow has secrets set |

---

## 🔐 Verify GitHub Actions Secrets

Your GitHub Actions needs these secrets to deploy:

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. You should see:
   - ✅ `VPS_HOST` (your VPS IP)
   - ✅ `VPS_USER` (usually `root`)
   - ✅ `VPS_SSH_KEY` (your SSH private key)

If any are missing, add them!

---

## 📈 Production Monitoring

### Check if App is Running

```bash
ssh root@YOUR_VPS_IP
curl http://localhost:3001
```

### View Live Logs

```bash
docker logs -f medcore
```

### Restart if Needed

```bash
docker restart medcore
```

---

## 🎯 Your Workflow Summary

**From now on, just do this:**

1. Make changes in VS Code
2. Run: `git add . && git commit -m "message" && git push`
3. Wait 2-3 minutes
4. Check your production URL
5. **Done!** No more manual SSH needed 🚀

---

## ❓ Questions?

- GitHub Actions logs: GitHub repo → Actions tab
- VPS logs: `docker logs medcore`
- Deployment status: Check VPS running containers with `docker ps`

Happy deploying! 🎉
