import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb } from '@/lib/serverDb';
import { verifyAdminSession } from '@/lib/auth';
import { SlugMapping } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const dbData = readDb();
    return NextResponse.json({ success: true, mappings: dbData.slugMappings || [] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Could not fetch slug mappings.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Administrative access required.' }, { status: 401 });
    }

    const { source, target, type, active } = await req.json();

    if (!source || !target || !type) {
      return NextResponse.json({ success: false, message: 'Missing mapping parameters.' }, { status: 400 });
    }

    const dbData = readDb();
    if (!dbData.slugMappings) dbData.slugMappings = [];

    const newMapping: SlugMapping = {
      id: 'map_' + Math.random().toString(36).substring(2, 11),
      source: source.trim(),
      target: target.trim(),
      type: type as 'subdomain' | 'custom-link' | 'redirect',
      active: active !== false,
      createdAt: new Date().toISOString()
    };

    dbData.slugMappings.push(newMapping);
    saveDb(dbData);

    return NextResponse.json({ success: true, message: 'Slug configuration added successfully.', mapping: newMapping });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create slug configuration.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Administrative access required.' }, { status: 401 });
    }

    const { id, source, target, type, active } = await req.json();

    if (!id || !source || !target || !type) {
      return NextResponse.json({ success: false, message: 'Missing mapping parameters.' }, { status: 400 });
    }

    const dbData = readDb();
    if (!dbData.slugMappings) dbData.slugMappings = [];
    
    const index = dbData.slugMappings.findIndex(m => m.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Configuration not found.' }, { status: 404 });
    }

    dbData.slugMappings[index] = {
      ...dbData.slugMappings[index],
      source: source.trim(),
      target: target.trim(),
      type: type as 'subdomain' | 'custom-link' | 'redirect',
      active: active === true
    };

    saveDb(dbData);
    return NextResponse.json({ success: true, message: 'Slug configuration updated successfully.', mapping: dbData.slugMappings[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update slug configuration.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Administrative access required.' }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing configuration ID.' }, { status: 400 });
    }

    const dbData = readDb();
    if (!dbData.slugMappings) dbData.slugMappings = [];

    const index = dbData.slugMappings.findIndex(m => m.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Configuration not found.' }, { status: 404 });
    }

    dbData.slugMappings.splice(index, 1);
    saveDb(dbData);

    return NextResponse.json({ success: true, message: 'Slug configuration successfully removed.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete configuration.' }, { status: 500 });
  }
}
