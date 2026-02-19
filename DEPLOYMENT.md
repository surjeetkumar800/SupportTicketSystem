# 🚀 Deployment Guide - Support Ticket System

This guide explains how to deploy the Dockerized Support Ticket System to a production server (VPS like AWS EC2, DigitalOcean, Linode, etc.).

## Prerequisites

1.  **A Virtual Private Server (VPS)** with Ubuntu 20.04/22.04 LTS (recommended).
2.  **Domain Name** (optional, but recommended for SSL).
3.  **MongoDB Atlas Connection String** (remote database).
4.  **OpenAI API Key**.

---

## Step 1: Prepare the Server

Connect to your server via SSH:
```bash
ssh root@your_server_ip
```

### Install Docker & Docker Compose
Run the following commands to install the latest Docker version:

```bash
# Update package index
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker compose version
```

---

## Step 2: Transfer the Code

You can either clone your Git repository or upload the zip file.

### Option A: Using Git (Recommended)
```bash
git clone <your-repo-url>
cd SupportTicketSystem
```

### Option B: Using SCP (If you have the zip)
On your local machine:
```bash
scp -r path/to/project_folder root@your_server_ip:/root/SupportTicketSystem
```

---

## Step 3: Configure Environment Variables

Create the production `.env` file on the server manually, as it is ignored by Git for security.

1.  Navigate to the project folder:
    ```bash
    cd SupportTicketSystem
    ```

2.  Create `.env`:
    ```bash
    nano .env
    ```

3.  Paste your production configuration (Right-click to paste):
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
    OPENAI_API_KEY=sk-proj-your-key-here
    ```

4.  Save and exit:
    - Press `Ctrl+X`
    - Press `Y`
    - Press `Enter`

---

## Step 4: Deploy

Run the application in detached mode (background):

```bash
docker compose up -d --build
```

### Verification
Check if containers are running:
```bash
docker compose ps
```

You should see:
- `ticket_backend` (Up)
- `ticket_frontend` (Up - Port 80->3000)
- `ticket_mongo` (Up)

---

## Step 5: Access the Application

Open your browser and navigate to:
`http://your_server_ip:3000`

The frontend is served via Nginx on port 3000 (mapped to container port 80).
The backend API is accessible at `http://your_server_ip:5000`.

---

## Troubleshooting

**Logs**: View logs for a specific service:
```bash
docker compose logs -f backend
```

**Restart**: Restart all services:
```bash
docker compose restart
```

**Stop**: Stop all services:
```bash
docker compose down
```
