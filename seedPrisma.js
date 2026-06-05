const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting PostgreSQL database seeding process...');

  // 1. Ensure we have an admin user in the system
  let admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!admin) {
    admin = await prisma.user.findUnique({
      where: { email: 'admin@bizsearch24.co.za' }
    });
  }

  if (!admin) {
    console.log('No admin user found. Creating default administrator (admin@bizsearch24.co.za)...');
    const hashedPassword = await bcrypt.hash('adminpassword24', 10);
    admin = await prisma.user.create({
      data: {
        email: 'admin@bizsearch24.co.za',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        firstName: 'System',
        lastName: 'Admin'
      }
    });
    console.log(`Admin user created with ID: ${admin.id}`);
  } else {
    console.log(`Existing Admin user detected: ${admin.email} (ID: ${admin.id})`);
  }

  // 2. Read local db.json
  const dbJsonPath = path.join(__dirname, 'data', 'db.json');
  if (!fs.existsSync(dbJsonPath)) {
    console.warn(`Warning: db.json was not found at ${dbJsonPath}`);
    return;
  }

  const fileContents = fs.readFileSync(dbJsonPath, 'utf8');
  const dbData = JSON.parse(fileContents);
  
  if (!dbData.listings || !Array.isArray(dbData.listings)) {
    console.warn('Warning: db.json listings is missing or is not an array.');
    return;
  }

  console.log(`Found ${dbData.listings.length} listings in db.json. Syncing to Prisma PostgreSQL...`);

  let count = 0;
  for (const listing of dbData.listings) {
    const keywordsStr = Array.isArray(listing.tags) ? listing.tags.join(', ') : (listing.keywords || '');
    
    await prisma.listing.upsert({
      where: { id: listing.id },
      update: {
        status: listing.verified ? 'APPROVED' : 'PENDING',
        businessName: listing.name,
        category: listing.category,
        province: listing.province,
        city: listing.city,
        suburb: listing.suburb,
        description: listing.description || '',
        contactEmail: listing.email || '',
        contactPhone: listing.phone || '',
        websiteUrl: listing.website || '',
        keywords: keywordsStr,
        clicks: listing.views || 0,
        publishedAt: listing.createdAt ? new Date(listing.createdAt) : new Date(),
        updatedAt: new Date()
      },
      create: {
        id: listing.id,
        userId: admin.id,
        status: listing.verified ? 'APPROVED' : 'PENDING',
        businessName: listing.name,
        category: listing.category,
        province: listing.province,
        city: listing.city,
        suburb: listing.suburb,
        description: listing.description || '',
        contactEmail: listing.email || '',
        contactPhone: listing.phone || '',
        websiteUrl: listing.website || '',
        keywords: keywordsStr,
        clicks: listing.views || 0,
        createdAt: listing.createdAt ? new Date(listing.createdAt) : new Date(),
        publishedAt: listing.createdAt ? new Date(listing.createdAt) : new Date(),
        updatedAt: new Date()
      }
    });
    count++;
  }

  console.log(`Successfully seeded ${count} listings inside Prisma database!`);
}

main()
  .catch(e => {
    console.error('Error seeding the database: ', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
