#!/bin/bash
# Script to fix the "database disk image is malformed" error
echo "Fixing Bizsearch24 database..."

# Path to the database file
DB_PATH="./prisma/dev.db"

if [ -f "$DB_PATH" ]; then
    echo "Found corrupted database at $DB_PATH. Deleting..."
    rm "$DB_PATH"
else
    echo "No database found at $DB_PATH."
fi

echo "Recreating database schema..."
npx prisma db push --accept-data-loss

echo "Regenerating Prisma client..."
npx prisma generate

echo "Database fix complete."
