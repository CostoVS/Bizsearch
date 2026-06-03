import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_for_dev_only';

async function isAdmin(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return false;
  try {
    const token = authHeader.replace('Bearer ', '');
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload?.role === 'ADMIN';
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const authorized = await isAdmin(req);
    if (!authorized) {
      return NextResponse.json({ success: false, message: 'Administrative access required.' }, { status: 401 });
    }
    const logs = await prisma.visitorLog.findMany({
      orderBy: { visitedAt: 'desc' },
      take: 1000
    });
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Could not fetch logs.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, path, search } = await req.json();
    const userAgent = req.headers.get('user-agent') || 'Unknown Browser';
    const ipRaw = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';

    let deviceType = 'Desktop';
    if (/tablet|ipad/i.test(userAgent)) deviceType = 'Tablet';
    else if (/mobi|android|iphone|phone/i.test(userAgent)) deviceType = 'Mobile';

    const log = await prisma.visitorLog.create({
      data: {
        ipAddress: ipRaw,
        userAgent,
        deviceType,
        path: path || '/',
        action: action || 'visit',
        searchQuery: search || null
      }
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to record tracking.' }, { status: 500 });
  }
}
