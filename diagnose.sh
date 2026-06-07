#!/bin/bash
# ==============================================================================
# BIZSEARCH24 CO.ZA - FULL-STACK PRODUCTION DIAGNOSTICS & SYSTEM RECOVERY
# ==============================================================================
# This script executes on the target VPS to inspect:
# 1. Docker daemon & service container statuses
# 2. Ports mapping (3004 for Next.js app, 5435 for PostgreSQL)
# 3. Next.js App startup/crash analysis (captures raw container logs)
# 4. Prisma database sync state and PostgreSQL reachability
# 5. Host system resources (checks if Next.js build failed due to low Memory/OOM)
# 6. Nginx routing and Cloudflare configuration consistency
# ==============================================================================

# --- COLOR PALETTE ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BOLD}${GREEN}🔍  BIZSEARCH24 SYSTEM DIAGNOSTICS & ROOT CAUSE INDEXER${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo -e "Starting automated verification on local runtime boundaries...\n"

# Check if docker is available
echo -e "${BOLD}[1/7] Inspecting Docker Engine Status...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ ERROR: Docker command not found on host VPS system!${NC}"
    echo -e "Recommendation: Please install Docker and Docker-Compose."
    DOCKER_OK=0
else
    echo -e "${GREEN}✓ Docker is installed: $(docker --version)${NC}"
    DOCKER_OK=1
fi

if [ "$DOCKER_OK" -eq 1 ]; then
    # Verify Compose version
    if docker compose version &>/dev/null; then
        COMPOSE_EXE="docker compose"
        echo -e "${GREEN}✓ Docker Compose CLI found!${NC}"
    elif docker-compose version &>/dev/null; then
        COMPOSE_EXE="docker-compose"
        echo -e "${GREEN}✓ Legacy docker-compose CLI found!${NC}"
    else
        echo -e "${YELLOW}⚠️ Warning: Docker Compose layout tool was not detected.${NC}"
        COMPOSE_EXE=""
    fi
fi

# Look for network port allocations
echo -e "\n${BOLD}[2/7] Checking active port listeners on Host VPS...${NC}"
HOST_POSTGRES_5432=$(netstat -tuln 2>/dev/null | grep :5432 || ss -tuln 2>/dev/null | grep :5432 || true)
HOST_POSTGRES_5435=$(netstat -tuln 2>/dev/null | grep :5435 || ss -tuln 2>/dev/null | grep :5435 || true)
HOST_WEB_3004=$(netstat -tuln 2>/dev/null | grep :3004 || ss -tuln 2>/dev/null | grep :3004 || true)
HOST_WEB_3000=$(netstat -tuln 2>/dev/null | grep :3000 || ss -tuln 2>/dev/null | grep :3000 || true)

if [ ! -z "$HOST_POSTGRES_5432" ]; then
    echo -e "${YELLOW}⚠️ Notice: Host has a service listening on Port 5432 (native Postgres or Docker).${NC}"
fi
if [ ! -z "$HOST_POSTGRES_5435" ]; then
    echo -e "${GREEN}✓ Mapped PostgreSQL listening on Port 5435.${NC}"
else
    echo -e "${RED}❌ ERROR: Docker postgreSQL port (5435) is NOT listening on Host.${NC}"
fi
if [ ! -z "$HOST_WEB_3004" ]; then
    echo -e "${GREEN}✓ BizSearch Next.js App listening on Port 3004.${NC}"
else
    echo -e "${RED}❌ ERROR: Mapped public web port (3004) is NOT listening on Host.${NC}"
    echo -e "${YELLOW}👉 This is the direct reason Cloudflare returns a 502 Bad Gateway! Nginx cannot route to port 3004 because it is closed.${NC}"
fi

# Deep dive into Docker statuses
if [ "$DOCKER_OK" -eq 1 ]; then
    echo -e "\n${BOLD}[3/7] Analysing docker container lifecycles...${NC}"
    DB_RUNNING=$(docker ps --filter "name=bizsearch-db" --format "{{.Status}}")
    APP_RUNNING=$(docker ps --filter "name=bizsearch-app" --format "{{.Status}}")
    
    if [ -z "$DB_RUNNING" ]; then
        echo -e "${RED}❌ CONTAINER DOWN: 'bizsearch-db' (PostgreSQL) is offline!${NC}"
    else
        echo -e "${GREEN}✓ 'bizsearch-db' container is active: $DB_RUNNING${NC}"
    fi

    if [ -z "$APP_RUNNING" ]; then
        echo -e "${RED}❌ CONTAINER DOWN: 'bizsearch-app' (Next.js Node) is offline!${NC}"
        echo -e "Let's check if the container exited due to a build or database link failure:"
        
        # Check all exited containers
        STALE_APP=$(docker ps -a --filter "name=bizsearch-app" --format "Exit Code: {{.ExitCode}}, Status: {{.Status}}")
        if [ ! -z "$STALE_APP" ]; then
            echo -e "  ↳ ${YELLOW}Status: $STALE_APP${NC}"
        fi
    else
        echo -e "${GREEN}✓ 'bizsearch-app' container is active: $APP_RUNNING${NC}"
    fi
fi

# Memory analysis (Very common Next.js compilation crash on VPS)
echo -e "\n${BOLD}[4/7] Analysing Host Memory Resources...${NC}"
if [ -f /proc/meminfo ]; then
    TOTAL_RAM=$(free -m | grep Mem | awk '{print $2}')
    FREE_RAM=$(free -m | grep Mem | awk '{print $4}')
    SWAP_TOTAL=$(free -m | grep Swap | awk '{print $2}')
    
    echo -e "Total System Memory: ${GREEN}${TOTAL_RAM} MB${NC}"
    echo -e "Available Idle Memory: ${GREEN}${FREE_RAM} MB${NC}"
    echo -e "Configured Swap Space: ${GREEN}${SWAP_TOTAL} MB${NC}"
    
    if [ "$TOTAL_RAM" -lt 2000 ] && [ "$SWAP_TOTAL" -eq 0 ]; then
        echo -e "${RED}⚠️ DANGER WARNING: Your VPS has under 2GB RAM and NO Swap file!${NC}"
        echo -e "${RED}Next.js compiler during 'npm run build' inside Docker easily uses >1.5GB of RAM. If memory is depleted,${NC}"
        echo -e "${RED}the Linux OS instantly KILLS the Node compiler process. This stops container generation.${NC}"
        echo -e "${YELLOW}💡 ACTION: Strongly recommend establishing a Swap file! run the following on your VPS server: ${NC}"
        echo -e "  sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab"
    fi
else
    echo -e "Skipped (non-linux platform check)."
fi

# Print Container Logs for Debugging
if [ "$DOCKER_OK" -eq 1 ]; then
    echo -e "\n${BOLD}[5/7] Reviewing Next.js Application Standalone Logs...${NC}"
    echo -e "${BLUE}--- Mapped bizsearch-app Runtime Stderr/Stdout (Last 15 lines) ---${NC}"
    docker logs --tail 15 bizsearch-app 2>&1 || echo "Could not read logs - container might not be built or found."
    echo -e "${BLUE}---------------------------------------------------------------${NC}"
    
    echo -e "\n${BOLD}[6/7] Reviewing PostgreSQL Logs...${NC}"
    echo -e "${BLUE}--- Mapped bizsearch-db Runtime Stderr/Stdout (Last 10 lines) ---${NC}"
    docker logs --tail 10 bizsearch-db 2>&1 || echo "Could not read logs - db container might not be found."
    echo -e "${BLUE}---------------------------------------------------------------${NC}"
fi

# Test Nginx configurations
echo -e "\n${BOLD}[7/7] Testing Nginx Reverse-Proxy Setup...${NC}"
if command -v nginx &> /dev/null; then
    NGINX_SYNTAX=$(sudo nginx -t 2>&1)
    if echo "$NGINX_SYNTAX" | grep -q "syntax is ok"; then
        echo -e "${GREEN}✓ Nginx syntax configuration is correct!${NC}"
    else
        echo -e "${RED}❌ ERROR: Nginx configuration check failed!${NC}"
        echo -e "$NGINX_SYNTAX"
    fi
else
    echo -e "${YELLOW}⚠️ Notice: Nginx binary is not available on this path. Ensure you are running as root/admin with proxy capabilities.${NC}"
fi

# Automated Repair Options Block
echo -e "\n${BLUE}======================================================================${NC}"
echo -e "${BOLD}${GREEN}🛠️  RECOVERY SUITE AND AUTOMATED CORRECTION PROCEDURES${NC}"
echo -e "${BLUE}======================================================================${NC}"
echo -e "Choose one of the recovery strategies below on your VPS:"
echo -e "\n${BOLD}Option A: Run Full Sync and Recovery Script${NC}"
echo -e "This is the primary method to rebuild matching images, flush locked ports, sync schemas, and start services:"
echo -e "  ${BLUE}./update-vps.sh${NC}"

echo -e "\n${BOLD}Option B: Rebuild and Start containers with verbose logs output${NC}"
echo -e "If app fails during build, stay in foreground to capture compilation issues with:"
echo -e "  ${BLUE}docker compose down && docker compose up --build${NC}"

echo -e "\n${BOLD}Option C: Test Database Connectivity Manually Inside App Container${NC}"
echo -e "Confirm that prisma can handshake correctly with postgres:"
echo -e "  ${BLUE}docker exec -it bizsearch-app npx prisma db push${NC}"

echo -e "\n${BOLD}Option D: Manually Inspect Running Docker Processes${NC}"
echo -e "  ${BLUE}docker ps -a${NC}"
echo -e "${BLUE}======================================================================${NC}"
