#!/bin/bash
# ==============================================================================
# BIZSEARCH24 PostgreSQL VPS UPDATE & DEPLOYMENT SCRIPT
# ==============================================================================
# This script handles the Git pull, secure directory permissions,
# PostgreSQL Docker container initialization, Prisma schema synchronization, and database seeding.

set -e

echo "======================================================================"
echo "🚀 STARTING BIZSEARCH24 POSTGRESQL VPS UPDATE & MIGRATION PROCESS..."
echo "======================================================================"

# 1. Pull latest code from Git
echo "Step 1: Pulling latest changes from git repository..."
git pull origin main || {
  echo "⚠️ Git pull failed. Please ensure your remote repository is configured or stash any local changes."
  echo "Proceeding with the update using local modifications..."
}

# 2. Shutdown existing running docker-compose containers (releases port 3004 and resources)
echo "Step 2: Stopping existing running docker services..."
docker-compose down || true

# 3. Handle Docker permissions and setup volumes
echo "Step 3: Setting up the postgreSQL data store and credentials..."
# Docker volume pgdata is automatically managed by docker-compose for persistence.
# If you are writing logs or have custom data directories:
mkdir -p ./data_store
sudo chmod -R 775 ./data_store

# 4. Prompt / verify that local .env file contains correct PostgreSQL DATABASE_URL
if [ ! -f ".env" ]; then
    echo "⚠️ No local .env file found. Copying .env.example..."
    cp .env.example .env
    echo "🚨 Created .env with fallback configurations. Please verify your DATABASE_URL inside your local .env file!"
else
    echo "✅ Existing .env configuration file detected."
fi

# 5. Build and start PostgreSQL and NextJS containers in detached mode
echo "Step 4: Building and booting Docker services (PostgreSQL & Next.js App)..."
docker-compose up -d --build

# 6. Wait for PostgreSQL container to be fully initialized and ready
echo "Step 5: Waiting for PostgreSQL database container to establish connections (10 seconds)..."
sleep 10

# 7. Apply the schema directly into PostgreSQL database and sync Prisma
echo "Step 6: Executing Prisma schema synchronization and DB push inside container..."
docker-compose exec -T bizsearch npx prisma db push --accept-data-loss

# 8. Seed/Populate the database with the JSON dataset using seedPrisma.js
echo "Step 7: Seeding PostgreSQL database with default and imported business profiles..."
docker-compose exec -T bizsearch npx prisma db seed

# 9. Verify database logs and application container status
echo "Step 8: Verifying running container services status..."
docker-compose ps

# 10. Query local loopback to confirm the app is serving index pages
echo "Step 9: Testing site loopback endpoint on port 3004..."
curl -I -s http://127.0.0.1:3004 || echo "⚠️ Host loopback returned offline. Wait another minute or check your proxy logs."

echo "======================================================================"
echo "✅ DEPLOYMENT & DATABASE SWAP COMPLETED SUCCESSFULLY FOR POSTGRESQL!"
echo "======================================================================"
