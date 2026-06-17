# 🚀 MedCore VPS Deployment Guide

## Current Setup

The project is configured with GitHub Actions for **automatic deployment to VPS** on every push to the `main` branch.

## Prerequisites

1. **VPS Server** with:
   - SSH access enabled
   - Docker & Docker Compose installed
   - Git installed
   - At least 2GB RAM and 10GB storage

2. **GitHub Repository** with access to:
   - Settings → Secrets and variables → Actions

## Step-by-Step Setup

### 1️⃣ **Prepare Your VPS**

SSH into your VPS and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install -y git

# Create deployment directory
sudo mkdir -p /opt/medcore
sudo chmod 777 /opt/medcore

# Add your user to docker group (optional, for running docker without sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### 2️⃣ **Generate SSH Key**

On your VPS, generate an SSH key if you don't have one:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
```

Get the private key content:

```bash
cat ~/.ssh/id_rsa
```

### 3️⃣ **Configure GitHub Secrets**

Go to your GitHub repository:
1. **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

| Secret Name | Value |
|-------------|-------|
| `VPS_HOST` | Your VPS IP address or domain (e.g., `192.168.1.100` or `myserver.com`) |
| `VPS_USER` | SSH username (e.g., `root` or `ubuntu`) |
| `VPS_SSH_KEY` | **Entire contents** of your private SSH key (`~/.ssh/id_rsa`) |

### 4️⃣ **Add Public Key to VPS**

On your local machine, add the public key to the VPS authorized_keys:

```bash
# Copy public key
cat ~/.ssh/id_rsa.pub

# Then on your VPS, add it to authorized_keys
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
```

Or if using password auth initially:

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub username@your_vps_ip
```

### 5️⃣ **Test the Connection**

Test SSH connection from your local machine:

```bash
ssh -i path/to/your/ssh/key username@your_vps_ip
```

If successful, you should be able to login without a password.

### 6️⃣ **Deploy**

Simply push code to the `main` branch:

```bash
git add .
git commit -m "deployment: update app"
git push origin main
```

GitHub Actions will automatically:
1. ✅ Checkout your code
2. ✅ Connect to your VPS via SSH
3. ✅ Clone/pull the latest code
4. ✅ Build the Docker image
5. ✅ Stop the old container
6. ✅ Run the new container
7. ✅ Verify the deployment

## Monitoring Deployment

### View GitHub Actions Logs

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select the latest workflow run
4. Check the **Build and Deploy to VPS** step logs

### Check VPS Logs

SSH into your VPS and check:

```bash
# View running containers
docker ps

# View MedCore logs
docker logs medcore

# Follow logs in real-time
docker logs -f medcore

# Check if the app is responding
curl http://localhost:3001
```

## Accessing Your App

Once deployed, access your app at:

```
http://your_vps_ip:3001
```

Or with a domain (if configured):

```
http://yourdomain.com:3001
```

## Nginx Reverse Proxy (Optional)

For better performance and SSL support, set up Nginx as a reverse proxy:

```nginx
# /etc/nginx/sites-available/medcore
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/medcore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Troubleshooting

### Issue: Deployment fails with "Permission denied"
- **Fix**: Ensure SSH key is properly configured and public key is in `~/.ssh/authorized_keys`

### Issue: Docker build fails
- **Fix**: Ensure enough disk space with `df -h`
- Check Docker is running: `docker --version`

### Issue: Container won't start
- **Fix**: Check logs: `docker logs medcore`
- Ensure port 3001 is not in use: `netstat -tuln | grep 3001`

### Issue: App not responding
- **Fix**: Wait 10-15 seconds after deployment for the container to fully start
- Check: `curl http://localhost:3001`

## Auto-Restart & Updates

The Docker container is configured with `--restart unless-stopped`, which means:
- ✅ Automatically restarts if it crashes
- ✅ Restarts after VPS reboot
- ✅ Stops if manually stopped

## Next Steps

1. ✅ Configure GitHub Secrets
2. ✅ Test SSH connection
3. ✅ Push code to `main` branch
4. ✅ Monitor deployment in Actions
5. ✅ Verify app at `http://your_vps_ip:3001`

---

For more help, check GitHub Actions documentation: https://docs.github.com/en/actions
