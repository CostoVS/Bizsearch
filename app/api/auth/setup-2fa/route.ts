import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import prisma from '@/lib/prisma';
import { SignJWT } from 'jose';
import { restoreMfa, backupMfa } from '@/lib/mfaBackup';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_for_dev_only';

export async function POST(req: NextRequest) {
  try {
    const { userId, action, token: mfaToken } = await req.json();

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      return NextResponse.json({ success: false, message: 'Invalid User.' }, { status: 403 });
    }

    const user = await restoreMfa(dbUser);

    if (action === 'generate') {
      let secretBase32 = user.twoFactorSecret;
      let otpauthUrl = '';
      if (!secretBase32) {
        const secret = speakeasy.generateSecret({ name: 'Bizsearch24 (' + user.email + ')' });
        secretBase32 = secret.base32;
        otpauthUrl = secret.otpauth_url || '';
        await prisma.user.update({
          where: { id: userId },
          data: { twoFactorSecret: secretBase32 }
        });
        backupMfa(user.email, secretBase32, false);
      } else {
        otpauthUrl = `otpauth://totp/Bizsearch24%20(${encodeURIComponent(user.email)})?secret=${secretBase32}&issuer=Bizsearch24`;
      }
      
      const qrCode = await QRCode.toDataURL(otpauthUrl);
      return NextResponse.json({ success: true, qrCode, secret: secretBase32 });
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

      backupMfa(user.email, user.twoFactorSecret, true);

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
