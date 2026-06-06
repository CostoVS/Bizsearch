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

    const mappedLogs = logs.map(log => {
      const searches = log.searchQuery ? [log.searchQuery] : [];
      const clicks: any[] = [];
      if (log.action && !['visit', 'init'].includes(log.action)) {
        if (log.action.startsWith('click:')) {
          clicks.push({ elementText: log.action.replace('click:', '').trim() });
        } else {
          let txt = log.action;
          if (log.action === 'filter_category') txt = 'Filter Category Selected';
          else if (log.action === 'filter_province') txt = 'Filter Province Selected';
          else if (log.action === 'filter_city') txt = 'Filter City Selected';
          else if (log.action === 'filter_suburb') txt = 'Filter Suburb Selected';
          else if (log.action === 'search_clear') txt = 'Reset Filters';
          else if (log.action === 'tab_switch') txt = `Switched to ${log.path}`;
          else if (log.action === 'view_page') txt = `Viewed SEO Page ${log.path}`;
          clicks.push({ elementText: txt });
        }
      }
      return {
        id: log.id,
        timestamp: log.visitedAt,
        ip: log.ipAddress || '127.0.0.1',
        deviceType: log.deviceType || 'Desktop',
        referrer: 'Direct Land',
        path: log.path,
        searches,
        clicks
      };
    });

    return NextResponse.json({ success: true, logs: mappedLogs });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Could not fetch logs.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, path, search, clickPayload } = await req.json();
    const userAgent = req.headers.get('user-agent') || 'Unknown Browser';
    const ipRaw = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';

    let deviceType = 'Desktop';
    if (/tablet|ipad/i.test(userAgent)) deviceType = 'Tablet';
    else if (/mobi|android|iphone|phone/i.test(userAgent)) deviceType = 'Mobile';

    let finalAction = action || 'visit';
    if (clickPayload && typeof clickPayload === 'object') {
      finalAction = `click: ${clickPayload.text || JSON.stringify(clickPayload)}`;
    }

    const log = await prisma.visitorLog.create({
      data: {
        ipAddress: ipRaw,
        userAgent,
        deviceType,
        path: path || '/',
        action: finalAction,
        searchQuery: search || null
      }
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to record tracking.' }, { status: 500 });
  }
}
