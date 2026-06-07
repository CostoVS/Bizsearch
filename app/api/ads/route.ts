import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb } from '@/lib/serverDb';
import { verifyAdminSession } from '@/lib/auth';
import { BizAd } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const province = searchParams.get('province')?.toLowerCase() || '';
    const city = searchParams.get('city')?.toLowerCase() || '';
    const suburb = searchParams.get('suburb')?.toLowerCase() || '';
    const targetPageParam = searchParams.get('page')?.toLowerCase() || '';

    const dbData = readDb();
    let ads = dbData.ads || [];

    const isAdmin = await verifyAdminSession(req);
    
    // If not admin, filter active ads and handle expiration
    if (!isAdmin) {
      ads = ads.filter(ad => {
        if (!ad.active) return false;
        if (ad.expiryType === 'date' && ad.expiryDate) {
          const expTime = Date.parse(ad.expiryDate);
          if (!isNaN(expTime) && expTime < Date.now()) {
            return false;
          }
        }
        return true;
      });
    }

    // Sort: priority / alwaysOnTop first, then orderIndex ascending, then newest
    ads = [...ads].sort((a, b) => {
      const aTop = a.alwaysOnTop ? 1 : 0;
      const bTop = b.alwaysOnTop ? 1 : 0;
      if (aTop !== bTop) {
        return bTop - aTop; // 1 (alwaysOnTop) comes before 0
      }
      const aOrder = a.orderIndex !== undefined ? a.orderIndex : 0;
      const bOrder = b.orderIndex !== undefined ? b.orderIndex : 0;
      if (aOrder !== bOrder) {
        return aOrder - bOrder; // ascending order index: lower comes first
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // If target page specifier is provided, filter ads accordingly
    if (targetPageParam) {
      ads = ads.filter(ad => {
        const adTarget = ad.targetPage || 'all';
        return adTarget === 'all' || adTarget === targetPageParam;
      });
    }

    // If matching filters are provided, filter ads accordingly.
    // Ads can match 'all' or are target-matched to the corresponding location fields.
    if (province || city || suburb) {
      ads = ads.filter(ad => {
        if (ad.placement === 'all') return true;
        if (ad.placement === 'province' && ad.province && ad.province.toLowerCase() === province) return true;
        if (ad.placement === 'city' && ad.city && ad.city.toLowerCase() === city) return true;
        if (ad.placement === 'suburb' && ad.suburb && ad.suburb.toLowerCase() === suburb) return true;
        return false;
      });
    }

    return NextResponse.json({ success: true, ads });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to retrieve ads.' }, { status: 500 });
  }
}

// Secured Admin operations
export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Administrative access required.' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      title, 
      imageUrl, 
      targetUrl, 
      placement, 
      province, 
      city, 
      suburb, 
      active, 
      position, 
      size,
      badge,
      description,
      alwaysOnTop,
      placementNews,
      placementSponsored,
      expiryType,
      expiryDate,
      targetPage,
      layoutRow,
      orderIndex
    } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, message: 'Missing title or imageUrl.' }, { status: 400 });
    }

    const dbData = readDb();
    if (!dbData.ads) dbData.ads = [];

    const newAd: BizAd = {
      id: 'ad_' + Math.random().toString(36).substring(2, 11),
      title,
      imageUrl,
      targetUrl: targetUrl || '',
      placement: placement || 'all',
      province: province || '',
      city: city || '',
      suburb: suburb || '',
      active: active !== false,
      position: position || 'sidebar',
      size: size || 'any',
      badge: badge || 'standard',
      description: description || '',
      alwaysOnTop: !!alwaysOnTop,
      placementNews: !!placementNews,
      placementSponsored: !!placementSponsored,
      expiryType: expiryType || 'permanent',
      expiryDate: expiryDate || null,
      targetPage: targetPage || 'all',
      layoutRow: layoutRow || 'top',
      orderIndex: typeof orderIndex === 'number' ? orderIndex : parseInt(orderIndex || '0', 10) || 0,
      createdAt: new Date().toISOString()
    };

    dbData.ads.push(newAd);
    saveDb(dbData);

    return NextResponse.json({ success: true, message: 'Advertisement placed successfully.', ad: newAd });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save advertisement.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Administrative access required.' }, { status: 401 });
    }

    const updatedAd = await req.json();
    if (!updatedAd || !updatedAd.id) {
      return NextResponse.json({ success: false, message: 'Missing advertisement details.' }, { status: 400 });
    }

    const dbData = readDb();
    if (!dbData.ads) dbData.ads = [];

    const index = dbData.ads.findIndex(ad => ad.id === updatedAd.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Advertisement not found.' }, { status: 404 });
    }

    dbData.ads[index] = {
      ...dbData.ads[index],
      ...updatedAd
    };

    saveDb(dbData);
    return NextResponse.json({ success: true, message: 'Advertisement successfully updated.', ad: dbData.ads[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update advertisement.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Administrative access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing advertisement ID.' }, { status: 400 });
    }

    const dbData = readDb();
    if (!dbData.ads) dbData.ads = [];

    const initialLength = dbData.ads.length;
    dbData.ads = dbData.ads.filter(ad => ad.id !== id);

    if (dbData.ads.length === initialLength) {
      return NextResponse.json({ success: false, message: 'Advertisement not found.' }, { status: 404 });
    }

    saveDb(dbData);
    return NextResponse.json({ success: true, message: 'Advertisement permanently deleted.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete advertisement.' }, { status: 500 });
  }
}
