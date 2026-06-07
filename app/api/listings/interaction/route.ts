import { NextResponse } from 'next/server';
import { readDb } from '@/lib/serverDb';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json();
    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }
    const db = readDb();
    const listing = db.listings.find(l => l.id === id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    if (action === 'like') {
      listing.likes = (listing.likes || 0) + 1;
    } else if (action === 'share') {
      listing.shares = (listing.shares || 0) + 1;
    }
    
    // Save locally
    const DB_FILE = path.join(process.cwd(), 'data', 'db.json');
    if (fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    }
    return NextResponse.json({ success: true, likes: listing.likes, shares: listing.shares });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process interaction' }, { status: 500 });
  }
}
