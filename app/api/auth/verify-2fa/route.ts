import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import prisma from '@/lib/prisma';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_for_dev_only';

export async function POST(req: NextRequest) {
  try {
    const { userId, token: mfaToken } = await req.json();

    if (!userId || !mfaToken) {
      return NextResponse.json({ success: false, message: 'Missing parameters.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid admin.' }, { status: 403 });
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json({ success: false, message: '2FA not setup.' }, { status: 400 });
    }

    const isValid = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token: mfaToken });

    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Invalid 2FA token.' }, { status: 401 });
    }

    const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('12h')
      .sign(new TextEncoder().encode(JWT_SECRET));

    return NextResponse.json({ success: true, token, role: user.role, email: user.email });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
