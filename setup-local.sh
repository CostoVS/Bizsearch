#!/bin/bash

# --- COLOR DEFINITIONS ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${GREEN}      BizSearch24 - Local Environment Setup       ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Check dependencies
echo -e "\n${BLUE}[1/5] Checking essential local dependencies...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}ERROR: Node.js is not installed. Please install Node.js (v18+).${NC}"
    exit 1
else
    echo -e "✓ Node.js is installed: $(node -v)"
fi

if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}WARNING: Docker is not installed or not in PATH.${NC}"
    echo -e "You will need to manually start a PostgreSQL instance on port 5432 with db 'bizsearch'.${NC}"
    DOCKER_AVAILABLE=false
else
    echo -e "✓ Docker is installed: $(docker -v)"
    DOCKER_AVAILABLE=true
fi

# Setup Environment Variables
echo -e "\n${BLUE}[2/5] Designing environment files...${NC}"
if [ ! -f .env ]; then
    echo -e "Creating .env file from .env.example..."
    cp .env.example .env
    # Generate a random session secret
    SESSION_RAND=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 2>/dev/null || echo "bizsearch_local_secret_session")
    sed -i.bak "s/SESSION_SECRET=/SESSION_SECRET=$SESSION_RAND/g" .env 2>/dev/null || true
    echo -e "${GREEN}✓ .env file created successfully!${NC}"
else
    echo -e "✓ Existing .env file detected."
fi

# Boot Database
echo -e "\n${BLUE}[3/5] Launching local database...${NC}"
if [ "$DOCKER_AVAILABLE" = true ]; then
    # Check if container is already running
    if [ "$(docker ps -q -f name=bizsearch-db)" ]; then
        echo -e "${GREEN}✓ PostgreSQL container (bizsearch-db) is already running.${NC}"
    elif [ "$(docker ps -a -q -f name=bizsearch-db)" ]; then
        echo -e "Starting existing PostgreSQL container..."
        docker start bizsearch-db
    else
        echo -e "Spinning up new PostgreSQL container on port 5432..."
        docker run --name bizsearch-db \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres \
            -e POSTGRES_DB=bizsearch \
            -p 5432:5432 \
            -d postgres:15-alpine
    fi
    
    echo -e "Waiting for PostgreSQL database container to respond (timeout 15s)..."
    for i in {1..15}; do
        if docker exec bizsearch-db pg_isready -U postgres -d bizsearch >/dev/null 2>&1; then
            echo -e "${GREEN}✓ Database is completely healthy and accepting connections!${NC}"
            break
        fi
        sleep 1
    done
else
    echo -e "${YELLOW}Skipping Docker setup. Ensure you have PostgreSQL running at:${NC}"
    echo -e "postgresql://postgres:postgres@localhost:5432/bizsearch?schema=public"
fi

# Install dependencies
echo -e "\n${BLUE}[4/5] Installing project dependencies (npm install)...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to install npm dependencies.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm packages installed successfully!${NC}"

# Run migrations and seed
echo -e "\n${BLUE}[5/5] Aligning database schema and seeding initial dataset...${NC}"
echo -e "Pushing Prisma schema schema.prisma directly to local database..."
npx prisma db push --skip-generate
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to push database schema to PostgreSQL database.${NC}"
    echo -e "Make sure database is running and credentials in .env are correct.${NC}"
    exit 1
fi

echo -e "Generating Prisma Client..."
npx prisma generate

echo -e "Seeding administrative user and list records from db.json..."
npx prisma db seed
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Seeding failed.${NC}"
    exit 1
fi

echo -e "\n=================================================="
echo -e "${GREEN}         SUCCESS: Local Setup Complete!           ${NC}"
echo -e "=================================================="
echo -e "\nYour development workspace is primed and ready."
echo -e "To start the client-server interaction web server, run:"
echo -e "  ${BLUE}npm run dev${NC}"
echo -e "\nDatabase URL: postgresql://postgres:postgres@localhost:5432/bizsearch?schema=public"
echo -e "Admin Login Email: ${GREEN}admin@bizsearch24.co.za${NC}"
echo -e "Admin Login Password: ${GREEN}adminpassword24${NC}"
echo -e "=================================================="
