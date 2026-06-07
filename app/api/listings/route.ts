import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import sharp from 'sharp';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_for_dev_only';

async function getUser(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  try {
    const token = authHeader.replace('Bearer ', '');
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload; // { id, email, role }
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get('term')?.toLowerCase() || '';
    const province = searchParams.get('province') || '';
    const city = searchParams.get('city') || '';
    const category = searchParams.get('category') || '';
    const onlyVerified = searchParams.get('onlyVerified') !== 'false';
    const isDashboardFetch = searchParams.get('onlyVerified') === 'false';
    
    const user = await getUser(req);
    const isAdmin = user?.role === 'ADMIN';

    let filterStatus = onlyVerified && !isAdmin ? 'APPROVED' : undefined;
    let filterUserId = undefined;

    if (isDashboardFetch && !isAdmin) {
      if (!user) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      filterUserId = user.id;
    }

    const whereClause: any = {
      status: filterStatus,
      province: province || undefined,
      city: city || undefined,
      category: category || undefined,
      userId: filterUserId,
    };

    if (onlyVerified && !isAdmin) {
      whereClause.OR = [
        { expiresAt: { gt: new Date() } },
        { expiresAt: null }
      ];
    }

    const listings = await prisma.listing.findMany({
      where: whereClause,
      include: { images: true }
    });

    const formatted = listings.map((l: any) => ({
      id: l.id,
      name: l.businessName,
      description: l.description,
      category: l.category,
      province: l.province,
      city: l.city,
      suburb: l.suburb,
      phone: l.contactPhone,
      email: l.contactEmail,
      website: l.websiteUrl,
      verified: l.status === 'APPROVED',
      status: l.status,
      views: l.clicks,
      tags: l.keywords ? l.keywords.split(',') : [],
      whatsappNumber: l.whatsappNumber || '',
      facebookUrl: l.facebookUrl || '',
      instagramUrl: l.instagramUrl || '',
      tiktokUrl: l.tiktokUrl || '',
      youtubeUrl: l.youtubeUrl || '',
      slug: l.businessName.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/(^-|-$)+/g, ''),
      // Base64 encode the image byte array for the frontend if exists
      image: l.images[0] ? `data:${l.images[0].mimeType};base64,${Buffer.from(l.images[0].imageData).toString('base64')}` : null,
      createdAt: l.createdAt,
      expiresAt: l.expiresAt
    }));

    // Local JS filtering for search text to save complex TSQuery logic
    const finalResults = term ? formatted.filter((b: any) => 
      b.name.toLowerCase().includes(term) ||
      b.description.toLowerCase().includes(term) ||
      b.tags.some((tag: string) => tag.toLowerCase().includes(term))
    ) : formatted;

    finalResults.sort((a: any, b: any) => b.views - a.views);

    return NextResponse.json({ success: true, listings: finalResults });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Could not fetch listings.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'You must be logged in to create an ad.' }, { status: 401 });
    }

    const userId = typeof user.id === 'string' ? user.id : '';

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    const maxListings = dbUser?.maxListings || 1;

    if (user.role !== 'ADMIN') {
      const currentListingsCount = await prisma.listing.count({ where: { userId } });
      if (currentListingsCount >= maxListings) {
        return NextResponse.json({ success: false, message: `You have reached your limit of ${maxListings} listing(s). Pay to request more limits inside your Dashboard.` }, { status: 403 });
      }
    }

    const body = await req.json();
    const { 
      name, description, category, address, province, city, suburb, phone, email, website, tags, image,
      whatsappNumber, facebookUrl, instagramUrl, tiktokUrl, youtubeUrl
    } = body;

    if (email) {
      const emailDomain = email.toLowerCase().split('@')[1];
      const freeDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'ymail.com', 
        'live.com', 'aol.com', 'icloud.com', 'mail.ru', 'protonmail.com', 
        'webmail.co.za', 'zoho.com', 'proton.me', 'gmx.com', 'mail.com'
      ];
      if (emailDomain && freeDomains.some(fd => emailDomain === fd || emailDomain.endsWith('.' + fd))) {
        return NextResponse.json({ success: false, message: 'Free email domains (Gmail, Yahoo, Hotmail, etc.) are not allowed. Please enter a professional business email address associated with your trading registry.' }, { status: 400 });
      }
    }

    const isAdmin = user.role === 'ADMIN';

    // 30 day timer for default listings
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Create the listing
    const listing = await prisma.listing.create({
      data: {
        userId,
        businessName: name,
        description: description || '',
        category,
        province,
        city,
        suburb: suburb || '',
        contactPhone: phone || '',
        contactEmail: email || '',
        websiteUrl: website || '',
        keywords: Array.isArray(tags) ? tags.join(',') : '',
        status: isAdmin ? 'APPROVED' : 'PENDING',
        expiresAt: isAdmin ? null : expiresAt,
        publishedAt: isAdmin ? new Date() : null,
        whatsappNumber: whatsappNumber || '',
        facebookUrl: facebookUrl || '',
        instagramUrl: instagramUrl || '',
        tiktokUrl: tiktokUrl || '',
        youtubeUrl: youtubeUrl || '',
      }
    });

    // Resize and save image
    if (image?.startsWith('data:image')) {
      const base64Data = image.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      const resizedBuffer = await sharp(buffer)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      await prisma.listingImage.create({
        data: {
          listingId: listing.id,
          imageData: resizedBuffer,
          mimeType: 'image/jpeg'
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: isAdmin ? 'Business listed and verified immediately.' : 'Submission successful. Waiting for admin approval.',
      listing: { ...listing, verified: isAdmin }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Failed to create business listing.' }, { status: 500 });
  }
}
