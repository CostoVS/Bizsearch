import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb } from '@/lib/serverDb';
import { verifyAdminSession } from '@/lib/auth';

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
      return NextResponse.json({ success: true, message: 'All pending listings have been approved and verified successfully!' });
    } else if (action === 'boost_views') {
      dbData.listings.forEach(b => {
        if (b.verified) {
          b.views = (b.views || 0) + Math.floor(Math.random() * 85) + 15;
        }
      });
      saveDb(dbData);
      return NextResponse.json({ success: true, message: 'Organic Traffic Booster applied successfully! Added random page weight views (+15 to +100) to each verified listing.' });
    } else if (action === 'delete_unverified') {
      const initialCount = dbData.listings.length;
      dbData.listings = dbData.listings.filter(b => b.verified === true);
      const deletedCount = initialCount - dbData.listings.length;
      saveDb(dbData);
      return NextResponse.json({ success: true, message: `Successfully culled ${deletedCount} unverified spam listings from the directory database.` });
    }

    // Individual listing actions require ID and existence validation
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing business ID parameter.' }, { status: 400 });
    }

    const index = dbData.listings.findIndex(b => b.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Business listing not found.' }, { status: 444 });
    }

    if (action === 'verify') {
      dbData.listings[index].verified = true;
      saveDb(dbData);
      return NextResponse.json({ success: true, message: 'Business successfully verified and published.' });
    } else if (action === 'unverify') {
      dbData.listings[index].verified = false;
      saveDb(dbData);
      return NextResponse.json({ success: true, message: 'Business marked pending verification.' });
    } else if (action === 'delete') {
      dbData.listings.splice(index, 1);
      saveDb(dbData);
      return NextResponse.json({ success: true, message: 'Business listing successfully deleted.' });
    } else {
      return NextResponse.json({ success: false, message: 'Action not supported.' }, { status: 400 });
    }
  } catch (error) {
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

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Business listing not found.' }, { status: 404 });
    }

    // Preserve critical system markers un-edited unless passed
    dbData.listings[index] = {
      ...dbData.listings[index],
      ...updatedListing,
      // If admin updates, ensure they don't lose key parameters
      updatedAt: new Date().toISOString()
    };

    saveDb(dbData);
    return NextResponse.json({ success: true, message: 'Listing details updated.', listing: dbData.listings[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error saving listing updates.' }, { status: 500 });
  }
}
