import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import prisma from '@/lib/prisma';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_for_dev_only';

export async function POST(req: NextRequest) {
  try {
    const { userId, action, token: mfaToken } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid User.' }, { status: 403 });
    }

    if (action === 'generate') {
      const secret = speakeasy.generateSecret({ name: 'Bizsearch24 (' + user.email + ')' });
      const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');
      
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorSecret: secret.base32 }
      });

      return NextResponse.json({ success: true, qrCode, secret: secret.base32 });
    }

    if (action === 'verifyAndEnable') {
      if (!user.twoFactorSecret) {
        return NextResponse.json({ success: false, message: 'Generate secret first.' }, { status: 400 });
      }

      const isValid = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token: mfaToken });
      
      if (!isValid) {
        return NextResponse.json({ success: false, message: 'Invalid 2FA code.' }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true }
      });

      const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('12h')
        .sign(new TextEncoder().encode(JWT_SECRET));

      return NextResponse.json({ success: true, token, role: user.role, email: user.email });
    }

    return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
