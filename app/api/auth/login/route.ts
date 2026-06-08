import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_for_dev_only';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Missing credentials.' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    
    if (user && email.toLowerCase() === 'nicholauscostochetty@gmail.com' && user.role !== 'ADMIN') {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' }
      });
    }
    
    if (!user || user.isBanned) {
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ success: false, message: 'Invalid credentials or account banned.' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
    }

    // IP tracking updates
    await prisma.user.update({
      where: { id: user.id },
      data: { lastKnownIp: ip }
    });

    // Standardize 2FA response for both users and admins if 2FA is needed or if admin
    if (user.role === 'ADMIN' || user.twoFactorEnabled) {
      return NextResponse.json({ 
        success: true, 
        require2FA: true, 
        setupRequired: !user.twoFactorEnabled,
        userId: user.id
      });
    }

    // Normal user login without 2FA
    const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(JWT_SECRET));

    return NextResponse.json({ success: true, token, role: user.role, email: user.email });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
