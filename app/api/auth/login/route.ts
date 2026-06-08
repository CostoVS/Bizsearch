import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { SignJWT } from 'jose';
import { restoreMfa } from '@/lib/mfaBackup';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_for_dev_only';

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json();
    const loginIdentifier = (email || username || '').toLowerCase().trim();
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    if (!loginIdentifier || !password) {
      return NextResponse.json({ success: false, message: 'Missing credentials.' }, { status: 400 });
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginIdentifier },
          { username: loginIdentifier }
        ]
      }
    });

    if (!user) {
      if (loginIdentifier === 'nicholauscostochetty@gmail.com' || loginIdentifier === 'nicholauscostochetty' || loginIdentifier === 'admin' || loginIdentifier === 'admin@bizsearch24.co.za') {
        const defaultEmail = (loginIdentifier === 'nicholauscostochetty' || loginIdentifier === 'nicholauscostochetty@gmail.com') ? 'nicholauscostochetty@gmail.com' : 'admin@bizsearch24.co.za';
        const defaultUsername = (loginIdentifier === 'nicholauscostochetty' || loginIdentifier === 'nicholauscostochetty@gmail.com') ? 'nicholauscostochetty' : 'admin';
        try {
          user = await prisma.user.create({
            data: {
              email: defaultEmail,
              username: defaultUsername,
              passwordHash: '$2a$10$U7v02bO4tWpTqA9N4XoXeuq12s0PeeYnIasT6V.zQveXnU90yid4S', // adminpassword24
              role: 'ADMIN',
              firstName: defaultUsername === 'admin' ? 'System' : 'Nicholaus',
              lastName: defaultUsername === 'admin' ? 'Admin' : 'Costo Chetty',
              fullName: defaultUsername === 'admin' ? 'System Admin' : 'Nicholaus Costo Chetty',
              selectedTier: 'PREMIUM',
              tier: 'PREMIUM',
              showProfileDetails: true,
              maxListings: 100
            }
          });
        } catch (e) {
          user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: defaultEmail },
                { username: defaultUsername }
              ]
            }
          });
        }
      }
    }
    
    // Restore 2FA details from backup memory if missing
    user = await restoreMfa(user);
    
    if (user && user.email.toLowerCase() === 'nicholauscostochetty@gmail.com' && user.role !== 'ADMIN') {
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
