import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb } from '@/lib/serverDb';
import { verifyAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Administrative access required.' }, { status: 401 });
    }

    const { id, action } = await req.json();

    if (!action) {
      return NextResponse.json({ success: false, message: 'Missing action parameter.' }, { status: 400 });
    }

    const dbData = readDb();

    // Global bulk actions (no specific business ID needed)
    if (action === 'verify_all') {
      dbData.listings.forEach(b => {
        b.verified = true;
      });
      saveDb(dbData);

      // Sync to Prisma
      await prisma.listing.updateMany({
        where: {},
        data: { status: 'APPROVED', publishedAt: new Date() }
      });

      return NextResponse.json({ success: true, message: 'All pending listings have been approved and verified successfully!' });
    } else if (action === 'boost_views') {
      dbData.listings.forEach(b => {
        if (b.verified) {
          b.views = (b.views || 0) + Math.floor(Math.random() * 85) + 15;
        }
      });
      saveDb(dbData);

      // Sync to Prisma
      const approvedListings = await prisma.listing.findMany({ where: { status: 'APPROVED' } });
      for (const l of approvedListings) {
        await prisma.listing.update({
          where: { id: l.id },
          data: { clicks: l.clicks + Math.floor(Math.random() * 85) + 15 }
        });
      }

      return NextResponse.json({ success: true, message: 'Organic Traffic Booster applied successfully! Added random page weight views (+15 to +100) to each verified listing.' });
    } else if (action === 'delete_unverified') {
      const initialCount = dbData.listings.length;
      dbData.listings = dbData.listings.filter(b => b.verified === true);
      const deletedCount = initialCount - dbData.listings.length;
      saveDb(dbData);

      // Sync to Prisma
      await prisma.listing.deleteMany({
        where: {
          NOT: { status: 'APPROVED' }
        }
      });

      return NextResponse.json({ success: true, message: `Successfully culled ${deletedCount} unverified spam listings from the directory database.` });
    }

    // Individual listing actions require ID and existence validation
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing business ID parameter.' }, { status: 400 });
    }

    const index = dbData.listings.findIndex(b => b.id === id);

    if (index === -1) {
      // It might be in Prisma only, so we tolerate it
    }

    if (action === 'verify') {
      if (index !== -1) {
        dbData.listings[index].verified = true;
        saveDb(dbData);
      }
      // Sync to Prisma
      await prisma.listing.update({
        where: { id },
        data: { status: 'APPROVED', publishedAt: new Date() }
      });
      return NextResponse.json({ success: true, message: 'Business successfully verified and published.' });
    } else if (action === 'unverify') {
      if (index !== -1) {
        dbData.listings[index].verified = false;
        saveDb(dbData);
      }
      // Sync to Prisma
      await prisma.listing.update({
        where: { id },
        data: { status: 'PENDING' }
      });
      return NextResponse.json({ success: true, message: 'Business marked pending verification.' });
    } else if (action === 'delete') {
      if (index !== -1) {
        dbData.listings.splice(index, 1);
        saveDb(dbData);
      }
      // Sync to Prisma
      await prisma.listing.delete({
        where: { id }
      });
      return NextResponse.json({ success: true, message: 'Business listing successfully deleted.' });
    } else {
      return NextResponse.json({ success: false, message: 'Action not supported.' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Error updating listing verification state.' }, { status: 550 });
  }
}

// Support PUT to update full details of a business listing (for admin edits!)
export async function PUT(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Administrative access required.' }, { status: 401 });
    }

    const updatedListing = await req.json();
    if (!updatedListing || !updatedListing.id) {
      return NextResponse.json({ success: false, message: 'Missing updated details.' }, { status: 400 });
    }

    const dbData = readDb();
    const index = dbData.listings.findIndex(b => b.id === updatedListing.id);

    if (index !== -1) {
      // Preserve critical system markers un-edited unless passed
      dbData.listings[index] = {
        ...dbData.listings[index],
        ...updatedListing,
        updatedAt: new Date().toISOString()
      };
      saveDb(dbData);
    }

    // Sync to Prisma:
    if (updatedListing.image?.startsWith('data:image')) {
      const base64Data = updatedListing.image.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      const resizedBuffer = await sharp(buffer)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      // Delete existing image
      await prisma.listingImage.deleteMany({
        where: { listingId: updatedListing.id }
      });

      // Insert new image
      await prisma.listingImage.create({
        data: {
          listingId: updatedListing.id,
          imageData: resizedBuffer,
          mimeType: 'image/jpeg'
        }
      });
    }

    // Parse tag array/string
    let tagString = '';
    if (Array.isArray(updatedListing.tags)) {
      tagString = updatedListing.tags.join(',');
    } else if (typeof updatedListing.tags === 'string') {
      tagString = updatedListing.tags;
    }

    await prisma.listing.update({
      where: { id: updatedListing.id },
      data: {
        businessName: updatedListing.name,
        description: updatedListing.description || '',
        category: updatedListing.category,
        province: updatedListing.province,
        city: updatedListing.city,
        suburb: updatedListing.suburb || '',
        contactPhone: updatedListing.phone || '',
        contactEmail: updatedListing.email || '',
        websiteUrl: updatedListing.website || '',
        keywords: tagString,
        status: updatedListing.verified ? 'APPROVED' : 'PENDING',
        expiresAt: updatedListing.verified ? null : undefined,
        whatsappNumber: updatedListing.whatsappNumber || '',
        facebookUrl: updatedListing.facebookUrl || '',
        instagramUrl: updatedListing.instagramUrl || '',
        tiktokUrl: updatedListing.tiktokUrl || '',
        youtubeUrl: updatedListing.youtubeUrl || '',
      }
    });

    return NextResponse.json({ success: true, message: 'Listing details updated.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Error saving listing updates.' }, { status: 500 });
  }
}
