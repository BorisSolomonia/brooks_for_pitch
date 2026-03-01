#!/bin/bash
set -e

echo "🚀 Setting up Brooks VM for deployment..."
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
: "${GCP_PROJECT_ID:?GCP_PROJECT_ID must be set}"
: "${GCP_REGION:?GCP_REGION must be set}"
: "${GCP_VM_NAME:?GCP_VM_NAME must be set}"
: "${GCP_VM_ZONE:?GCP_VM_ZONE must be set}"
: "${BROOKS_DOMAIN:?BROOKS_DOMAIN must be set}"

PROJECT_ID="${GCP_PROJECT_ID}"
REGION="${GCP_REGION}"
VM_NAME="${GCP_VM_NAME}"
VM_ZONE="${GCP_VM_ZONE}"
DOMAIN="${BROOKS_DOMAIN}"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  Project: $PROJECT_ID"
echo "  Region: $REGION"
echo "  VM: $VM_NAME"
echo "  Zone: $VM_ZONE"
echo "  Domain: $DOMAIN"
echo ""

# Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
if ! command -v docker &> /dev/null; then
    echo -e "${BLUE}🐳 Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed${NC}"
else
    echo -e "${GREEN}✅ Docker already installed${NC}"
fi

# Install Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo -e "${BLUE}📦 Installing Docker Compose...${NC}"
    sudo apt-get install -y docker-compose-plugin
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✅ Docker Compose already installed${NC}"
fi

# Install Google Cloud SDK
if ! command -v gcloud &> /dev/null; then
    echo -e "${BLUE}☁️ Installing Google Cloud SDK...${NC}"
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | \
        sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | \
        sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
    sudo apt-get update
    sudo apt-get install -y google-cloud-sdk
    echo -e "${GREEN}✅ Google Cloud SDK installed${NC}"
else
    echo -e "${GREEN}✅ Google Cloud SDK already installed${NC}"
fi

# Authenticate with GCP
echo -e "${BLUE}🔐 Configuring GCP authentication...${NC}"
gcloud config set project $PROJECT_ID
gcloud auth configure-docker $REGION-docker.pkg.dev --quiet
echo -e "${GREEN}✅ GCP authentication configured${NC}"

# Create Docker network
echo -e "${BLUE}🌐 Creating Docker network...${NC}"
docker network inspect web >/dev/null 2>&1 || docker network create web
echo -e "${GREEN}✅ Docker network 'web' ready${NC}"

# Setup Caddy
echo -e "${BLUE}🔧 Setting up Caddy reverse proxy...${NC}"
sudo mkdir -p /opt/caddy/config
sudo mkdir -p /opt/caddy/data

# Create Caddy docker-compose if it doesn't exist
if [ ! -f /opt/caddy/docker-compose.yml ]; then
    cat > /tmp/caddy-compose.yml <<'EOF'
version: '3.8'

services:
  caddy:
    image: caddy:2-alpine
    container_name: caddy
    restart: unless-stopped
    environment:
      BROOKS_DOMAIN: ${BROOKS_DOMAIN}
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"  # HTTP/3
    volumes:
      - /opt/caddy/config:/etc/caddy
      - /opt/caddy/data:/data
      - /opt/brooks/infra/caddy/Caddyfile:/etc/caddy/Caddyfile:ro
    networks:
      - web
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  web:
    external: true
EOF
    sudo mv /tmp/caddy-compose.yml /opt/caddy/docker-compose.yml
    echo -e "${GREEN}✅ Caddy compose file created${NC}"
else
    echo -e "${GREEN}✅ Caddy compose file already exists${NC}"
fi

# Start Caddy (will be configured later with app deployment)
echo -e "${BLUE}🚀 Starting Caddy...${NC}"
cd /opt/caddy
sudo docker compose up -d
echo -e "${GREEN}✅ Caddy started${NC}"

# Setup application directories
echo -e "${BLUE}📁 Setting up application directories...${NC}"
sudo mkdir -p /opt/brooks
sudo chown -R $USER:$USER /opt/brooks
echo -e "${GREEN}✅ Application directories ready${NC}"

# Configure firewall
echo -e "${BLUE}🔥 Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    echo -e "${GREEN}✅ Firewall configured${NC}"
else
    echo -e "${BLUE}ℹ️  UFW not installed, skipping firewall configuration${NC}"
fi

# Install useful utilities
echo -e "${BLUE}🛠️ Installing utilities...${NC}"
sudo apt-get install -y curl wget htop vim git jq
echo -e "${GREEN}✅ Utilities installed${NC}"

# System optimization
echo -e "${BLUE}⚙️ Optimizing system settings...${NC}"
# Increase file descriptors
echo "fs.file-max = 65535" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Docker log rotation
cat > /tmp/docker-daemon.json <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
sudo mv /tmp/docker-daemon.json /etc/docker/daemon.json
sudo systemctl restart docker
echo -e "${GREEN}✅ System optimized${NC}"

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✅ VM Setup Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "  1. Configure DNS: Point $DOMAIN to this VM's IP"
echo "  2. Setup GitHub Secrets (see DEPLOYMENT.md)"
echo "  3. Create GCP Secret Manager secret 'brooks-env' with environment variables"
echo "  4. Push code to GitHub to trigger deployment"
echo ""
echo -e "${BLUE}🔍 Verify installation:${NC}"
echo "  docker --version"
echo "  docker compose version"
echo "  gcloud --version"
echo "  docker network ls | grep web"
echo "  docker ps | grep caddy"
echo ""
echo -e "${BLUE}⚠️  IMPORTANT:${NC}"
echo "  - You may need to log out and back in for Docker group changes to take effect"
echo "  - Ensure DNS is configured before deployment for SSL to work"
echo ""
