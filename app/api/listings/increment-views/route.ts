import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb } from '@/lib/serverDb';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const dbData = readDb();
    const index = dbData.listings.findIndex(b => b.id === id);

    if (index !== -1) {
      dbData.listings[index].views = (dbData.listings[index].views || 0) + 1;
      saveDb(dbData);
      return NextResponse.json({ success: true, views: dbData.listings[index].views });
    }

    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
