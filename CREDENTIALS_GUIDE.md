# 📋 Where to Find Your VPS Credentials

## 1️⃣ **VPS_HOST** (Your VPS IP Address or Domain)

### If you're using a VPS provider (DigitalOcean, AWS, Azure, Linode, etc.):

**Option A: Find Your IP Address**
1. Log into your VPS provider's dashboard
2. Go to your droplet/instance details
3. Look for **"IPv4 Address"** or **"Public IP"**

**Example from different providers:**

#### **DigitalOcean**
- Login to [cloud.digitalocean.com](https://cloud.digitalocean.com)
- Click **Droplets** on the left
- Select your droplet
- You'll see "IPV4" with an IP like `192.0.2.123`

#### **AWS (EC2)**
- Login to [AWS Console](https://console.aws.amazon.com)
- Go to **EC2 → Instances**
- Select your instance
- Copy the **Public IPv4 address** (e.g., `54.123.45.67`)

#### **Azure**
- Login to [Azure Portal](https://portal.azure.com)
- Go to **Virtual machines**
- Select your VM
- Copy the **Public IP address**

#### **Linode**
- Login to [linode.com](https://linode.com)
- Go to **Linodes**
- Select your Linode
- Copy the **Public IP** address

#### **Google Cloud**
- Login to [Google Cloud Console](https://console.cloud.google.com)
- Go to **VM instances**
- Copy the **External IP** address

### If you have a domain pointing to your VPS:
Simply use your domain name (e.g., `medcore.example.com`)

**Value Format:**
```
VPS_HOST = 192.0.2.123
        or
VPS_HOST = medcore.example.com
```

---

## 2️⃣ **VPS_USER** (SSH Username)

The SSH username depends on your VPS image/OS:

### Common default usernames by OS:

| OS | Username |
|----|----------|
| **Ubuntu** | `ubuntu` |
| **Debian** | `debian` |
| **CentOS/Rocky** | `root` |
| **Fedora** | `fedora` |
| **Amazon Linux** | `ec2-user` |
| **Windows** | N/A (use PowerShell/RDP) |

### How to find your VPS username:

**DigitalOcean:**
- Default is `root` for all distributions

**AWS EC2:**
- Ubuntu: `ubuntu`
- Amazon Linux 2: `ec2-user`
- Check your instance details

**Azure:**
- Usually `azureuser`
- Check the instance creation notes

**Linode:**
- Default is `root`

**Google Cloud:**
- Default is `root`

### Test your SSH connection:

```bash
# On your local machine (Mac/Linux/WSL)
ssh -i /path/to/your/private/key username@your_vps_ip

# Example:
ssh -i ~/.ssh/id_rsa ubuntu@192.0.2.123
```

**Value Format:**
```
VPS_USER = ubuntu
        or
VPS_USER = root
```

---

## 3️⃣ **VPS_SSH_KEY** (Your SSH Private Key Content)

### Step-by-Step: Generate or Find Your SSH Key

#### **If you DON'T have an SSH key yet:**

**On Mac/Linux/WSL:**

```bash
# Generate a new SSH key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""

# This creates two files:
# ~/.ssh/id_rsa (PRIVATE KEY - keep secret!)
# ~/.ssh/id_rsa.pub (PUBLIC KEY - add to VPS)
```

**On Windows (PowerShell):**

```powershell
# Generate SSH key
ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\id_rsa" -N ""
```

---

#### **If you ALREADY have an SSH key:**

Find your private key file:

**On Mac/Linux/WSL:**
```bash
# Usually located at:
~/.ssh/id_rsa
# or
~/.ssh/my_key
# or
~/Downloads/your_vps_key.pem
```

**On Windows:**
```powershell
# Usually located at:
C:\Users\YourUsername\.ssh\id_rsa
# or
C:\Users\YourUsername\Downloads\your_vps_key.pem
```

---

### Get the Private Key Content:

**On Mac/Linux/WSL:**

```bash
# Display your private key
cat ~/.ssh/id_rsa

# Output will look like:
# -----BEGIN RSA PRIVATE KEY-----
# MIIEpAIBAAKCAQEA2k4z9j+k8p...
# [many lines of characters]
# -----END RSA PRIVATE KEY-----
```

**On Windows (PowerShell):**

```powershell
# Display your private key
Get-Content -Path "$env:USERPROFILE\.ssh\id_rsa"

# Or if you want to copy it directly:
Get-Content -Path "$env:USERPROFILE\.ssh\id_rsa" | Set-Clipboard
```

**On Windows (Using Notepad):**

```powershell
notepad "$env:USERPROFILE\.ssh\id_rsa"
```

---

### Add Public Key to Your VPS:

**Option 1: During VPS Creation (Easiest)**

When creating your VPS, paste your public key:
- Copy your PUBLIC key: `cat ~/.ssh/id_rsa.pub`
- Paste it during VPS setup in "SSH Key" field

**Option 2: After VPS Creation**

```bash
# SSH into VPS (using password)
ssh root@your_vps_ip

# Add your public key
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit
```

---

## 📋 Complete Example

### Your VPS Details (from provider):
```
IP Address: 192.0.2.123
OS: Ubuntu 22.04
Default User: ubuntu
```

### Your Local SSH Key:
```bash
# Command to view your private key
cat ~/.ssh/id_rsa

# Output:
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA2k4z9j+k8p9w2l3x...
[many lines]
-----END RSA PRIVATE KEY-----
```

### GitHub Secrets to Add:
```
VPS_HOST = 192.0.2.123
VPS_USER = ubuntu
VPS_SSH_KEY = -----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA2k4z9j+k8p9w2l3x...
[many lines]
-----END RSA PRIVATE KEY-----
```

---

## ✅ Verification Checklist

Before adding to GitHub Secrets, verify:

- [ ] You can SSH into your VPS:
  ```bash
  ssh -i ~/.ssh/id_rsa ubuntu@192.0.2.123
  ```

- [ ] Docker is installed:
  ```bash
  docker --version
  ```

- [ ] Git is installed:
  ```bash
  git --version
  ```

- [ ] You have permission to create `/opt/medcore`:
  ```bash
  sudo mkdir -p /opt/medcore
  sudo chmod 777 /opt/medcore
  ```

---

## 🆘 Common Issues

### "Permission denied (publickey)"
- **Fix**: Add your public key to VPS `~/.ssh/authorized_keys`
- Ensure permissions: `chmod 600 ~/.ssh/authorized_keys`

### "ssh: command not found"
- **On Windows**: Install OpenSSH or use WSL
- **Command**: `ssh-keygen -A`

### "Cannot SSH into VPS"
- Check VPS is running
- Check SSH is enabled
- Check firewall allows port 22
- Try with password first: `ssh root@your_ip`

### "Private key permissions too open"
```bash
# Fix permissions
chmod 600 ~/.ssh/id_rsa
```

---

## 🔐 Security Tips

⚠️ **NEVER share your private key**
- Keep `id_rsa` private
- Only share `id_rsa.pub` (public key)
- GitHub Secrets are encrypted

✅ **DO:**
- Use strong SSH keys (RSA 4096 or Ed25519)
- Restrict SSH access (firewall rules)
- Use key-based auth (not passwords)
- Regularly rotate keys

---

For more help, see: [SSH Key Setup Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
