import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    // Option for multiple account registrations during system testing and previews
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already in use.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        lastKnownIp: ip,
        userAgent,
        role: (isFirstUser || email === process.env.ADMIN_USERNAME || email === 'admin@bizsearch24.co.za') ? 'ADMIN' : 'USER'
      }
    });

    return NextResponse.json({ success: true, message: 'Account created successfully.' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
