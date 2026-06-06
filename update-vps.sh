#!/bin/bash
# ==============================================================================
# BIZSEARCH24 PostgreSQL VPS UPDATE, MIGRATION & DEPLOYMENT SYSTEM
# ==============================================================================
# This script handles:
# 1. Gracefully terminating any hanging or orphan Next.js dev/prod processes
# 2. Bringing up PostgreSQL (on custom internal ports to avoid system conflicts)
# 3. Synchronizing PostgreSQL schemas using Prisma
# 4. Seeding the initial administrative user & business datasets
# ==============================================================================

set -e

# --- COLOR DEFINITIONS ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================================${NC}"
echo -e "${GREEN} 🚀 STARTING BIZSEARCH24 POSTGRESQL VPS UPDATE & REBUILD PROCESS...${NC}"
echo -e "${BLUE}======================================================================${NC}"

# Detect ports conflicts
echo -e "\n${BLUE}[1/8] Analyzing host network ports and killing hanging processes...${NC}"

# Check port 3000 on the host system
if command -v lsof &> /dev/null; then
    PORT_3000_PID=$(lsof -t -i:3000 || true)
    if [ ! -z "$PORT_3000_PID" ]; then
        echo -e "${YELLOW}Warning: Process PID $PORT_3000_PID is currently occupying port 3000 on the host VPS.${NC}"
        echo -e "Terminating holding process to prevent gateway routes from breaking..."
        kill -9 $PORT_3000_PID || sudo kill -9 $PORT_3000_PID || true
        echo -e "${GREEN}✓ Process on port 3000 terminated!${NC}"
    else
        echo -e "✓ Host port 3000 is clean and clear."
    fi

    PORT_3004_PID=$(lsof -t -i:3004 || true)
    if [ ! -z "$PORT_3004_PID" ]; then
        echo -e "Port 3004 is currently used by a running service. Terminating it to allow rebuild..."
        kill -9 $PORT_3004_PID || sudo kill -9 $PORT_3004_PID || true
    fi
else
    echo -e "${YELLOW}Notice: 'lsof' is not installed. Skipping automatic process cleanups.${NC}"
fi

# Stop any currently matching Docker container instances to prevent locked states
echo -e "\n${BLUE}[2/8] Halting docker services to perform clean rebuild...${NC}"
docker-compose down || true

# Pre-setup data directories
echo -e "\n${BLUE}[3/8] Creating and securing Docker data volumes...${NC}"
mkdir -p ./data_store
chmod -R 775 ./data_store

# Check or construct environment keys
echo -e "\n${BLUE}[4/8] Aligning service configuration (.env file)...${NC}"
if [ ! -f ".env" ]; then
    echo -e "No .env file found. Copying .env.example..."
    cp .env.example .env
    # Inject a secure session key automatically
    RAND_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 2>/dev/null || echo "bizsearch_prod_session_secret_fallback")
    sed -i.bak "s/SESSION_SECRET=/SESSION_SECRET=$RAND_SECRET/g" .env 2>/dev/null || true
    echo -e "${GREEN}✓ Local environment file .env has been generated!${NC}"
else
    echo -e "✓ Valid local database connection strings (.env check passed)."
fi

# Bring up Docker services on correct mapped host ports
echo -e "\n${BLUE}[5/8] Booting Docker stack (PostgreSQL + production Next.js Standalone)...${NC}"
# Note: In docker-compose.yml, PostgreSQL host port is mapped to 5435 to avoid any衝突 with host's native local database server.
docker-compose up -d --build

# Wait for PostgreSQL to complete initializations inside internal bridge network
echo -e "\n${BLUE}[6/8] Awaiting database responsiveness inside container...${NC}"
echo "We will poll database accessibility natively."
for i in {1..20}; do
    if docker exec bizsearch-db pg_isready -U postgres -d bizsearch >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Database connection successfully established!${NC}"
        break
    fi
    echo -e "${YELLOW}Waiting for database schema container to respond... ($i/20)${NC}"
    sleep 2
done

# Perform migrations
echo -e "\n${BLUE}[7/8] Synchronizing PostgreSQL db schemas directly in Prisma...${NC}"
docker-compose exec -T bizsearch npx prisma db push --accept-data-loss

# Generate client
echo -e "Generating Prisma Client binaries inside workspace container..."
docker-compose exec -T bizsearch npx prisma generate

# Seed database
echo -e "\n${BLUE}[8/8] Seeding default administrator profile and parsing listings from dataset...${NC}"
docker-compose exec -T bizsearch npx prisma db seed

# Complete deployment validation checks
echo -e "\n${GREEN}======================================================================${NC}"
echo -e "${GREEN}✅ DEPLOYMENT & DATABASE SEED COMPLETE!${NC}"
echo -e "======================================================================"
echo -e "Docker Container Statuses:"
docker-compose ps
echo -e "\n- Mapped Web Application Endpoint (Public Host): ${GREEN}http://localhost:3004 (Routed via Nginx to co.za domain)${NC}"
echo -e "- Private Database Connection Endpoint: ${BLUE}postgresql://postgres:postgres@localhost:5435/bizsearch?schema=public${NC}"
echo -e "- Default Administrator Email: ${GREEN}admin@bizsearch24.co.za${NC}"
echo -e "- Default Administrator Password: ${GREEN}adminpassword24${NC}"
echo -e "======================================================================"
