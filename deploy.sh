#!/bin/bash
# MedCore Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 MedCore Deployment Script"
echo "=============================="

# Check if SSH key is configured
if [ -z "$VPS_HOST" ]; then
    echo "❌ Please set environment variables:"
    echo "   export VPS_HOST='your-vps-ip'"
    echo "   export VPS_USER='root'"
    echo "   export VPS_SSH_KEY='path-to-key.pem'"
    exit 1
fi

echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || true
git push origin main

echo "✅ Pushed to GitHub"
echo ""
echo "🔄 GitHub Actions will now automatically deploy your changes..."
echo "📊 Check deployment status: https://github.com/YOUR_REPO/actions"
echo ""
echo "Or manually deploy with:"
echo "ssh -i '$VPS_SSH_KEY' $VPS_USER@$VPS_HOST 'cd /opt/medcore && git pull origin main && docker build --no-cache --pull -t medcore:latest . && docker rm -f medcore && docker run -d --name medcore --restart unless-stopped -p 3001:3001 medcore:latest && sleep 10 && docker logs medcore'"
