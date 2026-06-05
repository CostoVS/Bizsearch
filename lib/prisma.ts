import { PrismaClient } from '@prisma/client'
import { readDb, saveDb } from './serverDb'

const globalForPrisma = global as unknown as { prisma: any }

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl || dbUrl.startsWith("file:")) {
  dbUrl = "postgresql://postgres:postgres@localhost:5432/bizsearch?schema=public";
}

const rawPrisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
  log: ['query'],
});

// A robust mock fallback helper. It uses db.json internally for data persistence.
async function handleMockFallback(modelName: string, prop: string, args: any[]): Promise<any> {
  const dbData = readDb() as any;
  if (!dbData.listings) dbData.listings = [];
  if (!dbData.users) {
    dbData.users = [
      {
        id: '1f88c6f3-d53e-4e38-a04d-f1df427b4acc', // Match the seeded admin user ID
        email: 'admin@bizsearch24.co.za',
        passwordHash: '$2a$10$U7v02bO4tWpTqA9N4XoXeuq12s0PeeYnIasT6V.zQveXnU90yid4S', // adminpassword24 hashed
        role: 'ADMIN',
        twoFactorEnabled: false,
        twoFactorSecret: null,
        isBanned: false,
        lastKnownIp: null,
        userAgent: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        firstName: 'System',
        lastName: 'Admin',
        idNumber: null,
        companyRegNumber: null,
        billingAddress: null,
        showProfileDetails: false,
        profileColor: 'slate',
        maxListings: 10
      }
    ];
  }

  const modelLower = modelName.toLowerCase();
  
  if (modelLower === 'user') {
    if (prop === 'findUnique') {
      const where = args[0]?.where || {};
      const found = dbData.users.find((u: any) => {
        if (where.id && u.id === where.id) return true;
        if (where.email && u.email === where.email) return true;
        return false;
      });
      return found || null;
    }
    if (prop === 'findFirst') {
      const where = args[0]?.where || {};
      const found = dbData.users.find((u: any) => {
        if (where.role && u.role === where.role) return true;
        return false;
      });
      return found || null;
    }
    if (prop === 'count') {
      return dbData.users.length;
    }
    if (prop === 'create') {
      const data = args[0]?.data || {};
      const newUser = {
        id: data.id || `u_${Date.now()}`,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role || 'USER',
        twoFactorEnabled: data.twoFactorEnabled || false,
        twoFactorSecret: data.twoFactorSecret || null,
        isBanned: false,
        lastKnownIp: null,
        userAgent: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        idNumber: data.idNumber || null,
        companyRegNumber: data.companyRegNumber || null,
        billingAddress: data.billingAddress || null,
        showProfileDetails: false,
        profileColor: 'slate',
        maxListings: data.maxListings || 1
      };
      dbData.users.push(newUser);
      saveDb(dbData);
      return newUser;
    }
    if (prop === 'update') {
      const where = args[0]?.where || {};
      const data = args[0]?.data || {};
      const idx = dbData.users.findIndex((u: any) => {
        if (where.id && u.id === where.id) return true;
        if (where.email && u.email === where.email) return true;
        return false;
      });
      if (idx !== -1) {
        dbData.users[idx] = {
          ...dbData.users[idx],
          ...data,
          updatedAt: new Date().toISOString()
        };
        saveDb(dbData);
        return dbData.users[idx];
      }
      return null;
    }
  }

  if (modelLower === 'listing') {
    const mapListingToPrisma = (l: any) => {
      const isApproved = l.verified === true || l.status === 'APPROVED';
      const cleanKeywords = Array.isArray(l.tags) ? l.tags.join(',') : (l.keywords || '');
      return {
        id: l.id,
        userId: l.userId || '1f88c6f3-d53e-4e38-a04d-f1df427b4acc',
        status: l.status || (isApproved ? 'APPROVED' : 'PENDING'),
        businessName: l.name,
        description: l.description || '',
        category: l.category,
        province: l.province,
        city: l.city,
        suburb: l.suburb || '',
        contactPhone: l.phone || '',
        contactEmail: l.email || '',
        websiteUrl: l.website || '',
        keywords: cleanKeywords,
        clicks: l.views || 0,
        publishedAt: l.publishedAt ? new Date(l.publishedAt) : (l.createdAt ? new Date(l.createdAt) : new Date()),
        expiresAt: l.expiresAt ? new Date(l.expiresAt) : null,
        createdAt: l.createdAt ? new Date(l.createdAt) : new Date(),
        updatedAt: l.updatedAt ? new Date(l.updatedAt) : new Date(),
        images: l.image ? [{ id: 'img-' + l.id, listingId: l.id, imageData: Buffer.from([]), mimeType: 'image/jpeg' }] : []
      };
    };

    if (prop === 'findMany') {
      const where = args[0]?.where || {};
      let filtered = dbData.listings;
      if (where.userId) filtered = filtered.filter((l: any) => l.userId === where.userId);
      if (where.status) filtered = filtered.filter((l: any) => {
        const p = mapListingToPrisma(l);
        return p.status === where.status;
      });
      if (where.province) filtered = filtered.filter((l: any) => l.province === where.province);
      if (where.city) filtered = filtered.filter((l: any) => l.city === where.city);
      if (where.category) filtered = filtered.filter((l: any) => l.category === where.category);
      return filtered.map(mapListingToPrisma);
    }
    if (prop === 'findUnique') {
      const where = args[0]?.where || {};
      const found = dbData.listings.find((l: any) => l.id === where.id);
      return found ? mapListingToPrisma(found) : null;
    }
    if (prop === 'count') {
      const where = args[0]?.where || {};
      let filtered = dbData.listings;
      if (where.userId) filtered = filtered.filter((l: any) => l.userId === where.userId);
      return filtered.length;
    }
    if (prop === 'create') {
      const data = args[0]?.data || {};
      const newListing = {
        id: data.id || `b_${Date.now()}`,
        name: data.businessName,
        description: data.description || '',
        category: data.category,
        province: data.province,
        city: data.city,
        suburb: data.suburb || '',
        phone: data.contactPhone || '',
        email: data.contactEmail || '',
        website: data.websiteUrl || '',
        verified: data.status === 'APPROVED',
        image: '',
        tags: data.keywords ? data.keywords.split(',') : [],
        views: 0,
        slug: data.businessName.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/(^-|-$)+/g, ''),
        createdAt: new Date().toISOString()
      };
      dbData.listings.push(newListing);
      saveDb(dbData);
      return mapListingToPrisma(newListing);
    }
    if (prop === 'update') {
      const where = args[0]?.where || {};
      const data = args[0]?.data || {};
      const idx = dbData.listings.findIndex((l: any) => l.id === where.id);
      if (idx !== -1) {
        const updated = {
          ...dbData.listings[idx],
          name: data.businessName !== undefined ? data.businessName : dbData.listings[idx].name,
          description: data.description !== undefined ? data.description : dbData.listings[idx].description,
          category: data.category !== undefined ? data.category : dbData.listings[idx].category,
          province: data.province !== undefined ? data.province : dbData.listings[idx].province,
          city: data.city !== undefined ? data.city : dbData.listings[idx].city,
          suburb: data.suburb !== undefined ? data.suburb : dbData.listings[idx].suburb,
          phone: data.contactPhone !== undefined ? data.contactPhone : dbData.listings[idx].phone,
          email: data.contactEmail !== undefined ? data.contactEmail : dbData.listings[idx].email,
          website: data.websiteUrl !== undefined ? data.websiteUrl : dbData.listings[idx].website,
          verified: data.status === 'APPROVED' ? true : (data.status === 'PENDING' ? false : dbData.listings[idx].verified),
          tags: data.keywords !== undefined ? data.keywords.split(',') : dbData.listings[idx].tags,
          views: data.clicks !== undefined ? data.clicks : dbData.listings[idx].views
        };
        dbData.listings[idx] = updated;
        saveDb(dbData);
        return mapListingToPrisma(updated);
      }
      return null;
    }
    if (prop === 'updateMany') {
      const where = args[0]?.where || {};
      const data = args[0]?.data || {};
      let count = 0;
      dbData.listings = dbData.listings.map((l: any) => {
        let matches = true;
        if (where.status && l.status !== where.status && (l.verified ? 'APPROVED' : 'PENDING') !== where.status) {
          matches = false;
        }
        if (matches) {
          count++;
          return {
            ...l,
            verified: data.status === 'APPROVED' ? true : (data.status === 'PENDING' ? false : l.verified),
            status: data.status || l.status
          };
        }
        return l;
      });
      saveDb(dbData);
      return { count };
    }
    if (prop === 'delete') {
      const where = args[0]?.where || {};
      const found = dbData.listings.find((l: any) => l.id === where.id);
      dbData.listings = dbData.listings.filter((l: any) => l.id !== where.id);
      saveDb(dbData);
      return found ? mapListingToPrisma(found) : null;
    }
    if (prop === 'deleteMany') {
      const where = args[0]?.where || {};
      const initialCount = dbData.listings.length;
      dbData.listings = dbData.listings.filter((l: any) => {
        if (where.userId && l.userId !== where.userId) return false;
        return true;
      });
      saveDb(dbData);
      return { count: initialCount - dbData.listings.length };
    }
  }

  if (modelLower === 'visitorlog') {
    const mapLogToPrisma = (v: any) => ({
      id: v.id,
      ipAddress: v.ip || null,
      userAgent: v.userAgent || null,
      deviceType: v.deviceType || null,
      path: v.path || '',
      action: v.action || null,
      searchQuery: v.searches ? v.searches.join(',') : null,
      visitedAt: v.timestamp ? new Date(v.timestamp) : new Date()
    });

    if (prop === 'findMany') {
      return dbData.visitorLogs.map(mapLogToPrisma);
    }
    if (prop === 'create') {
      const data = args[0]?.data || {};
      const newLog = {
        id: `vl_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ip: data.ipAddress || '',
        userAgent: data.userAgent || '',
        deviceType: data.deviceType || 'Unknown',
        referrer: '',
        path: data.path || '',
        searches: data.searchQuery ? data.searchQuery.split(',') : [],
        action: data.action || '',
        clicks: []
      };
      dbData.visitorLogs.push(newLog);
      saveDb(dbData);
      return mapLogToPrisma(newLog);
    }
  }

  if (modelLower === 'listingimage') {
    if (prop === 'create') {
      const data = args[0]?.data || {};
      return {
        id: `img_${Date.now()}`,
        listingId: data.listingId,
        imageData: data.imageData || Buffer.from([]),
        mimeType: data.mimeType || 'image/jpeg',
        createdAt: new Date()
      };
    }
    if (prop === 'deleteMany') {
      return { count: 1 };
    }
  }

  return null;
}

// Intercepts model queries and executes fallback if DB fails
function createModelProxy(modelName: string, rawModel: any) {
  return new Proxy(rawModel || {}, {
    get(target, prop) {
      if (typeof prop !== 'string') return Reflect.get(target, prop);
      const originalMethod = target[prop];
      
      return async function (...args: any[]) {
        try {
          if (typeof originalMethod === 'function') {
            return await originalMethod.apply(target, args);
          }
        } catch (error: any) {
          const isConnectionError = 
            error.message?.includes('Initialization') ||
            error.message?.includes('reach database') ||
            error.message?.includes('connect ECONNREFUSED') ||
            error.message?.includes('Can not connect') ||
            error.message?.includes('Query helper') ||
            error.code === 'P1001' ||
            error.code === 'P1002' ||
            error.code === 'P1003' ||
            error.code === 'P1017' ||
            error.name?.includes('Initialization') ||
            error.name?.includes('PrismaClientInitializationError');
            
          if (isConnectionError) {
            console.warn(`[Prisma Database Offline] Failed to query PostgreSQL database. Falling back to local db.json container for "${modelName}.${prop}".`);
            return await handleMockFallback(modelName, prop, args);
          }
          throw error;
        }
      }
    }
  });
}

export const prisma = new Proxy(rawPrisma as any, {
  get(target, prop) {
    if (typeof prop !== 'string') return Reflect.get(target, prop);
    
    // Handle standard PrismaClient methods like $connect, $disconnect
    if (prop.startsWith('$')) {
      const method = target[prop];
      if (typeof method === 'function') {
        return async function(...args: any[]) {
          try {
            return await method.apply(target, args);
          } catch (e) {
            console.warn(`[Prisma Warning] Bypass connection error on '${prop}' during offline fallback mode.`);
            return null; // Swallow startup connection failures in local preview sandbox
          }
        }
      }
    }
    
    // For standard model names (e.g. user, listing, visitorLog, listingImage)
    const rawModel = target[prop];
    return createModelProxy(prop, rawModel);
  }
}) as unknown as PrismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
