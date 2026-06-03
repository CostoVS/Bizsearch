import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_for_dev_only';

async function getUser(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  try {
    const token = authHeader.replace('Bearer ', '');
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload; // { id, email, role }
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id as string }
    });

    if (!dbUser) {
        return NextResponse.json({ success: false, message: 'User DB Record Not Found' }, { status: 404 });
    }

    // Omit password and 2fa secret
    const { passwordHash, twoFactorSecret, ...safeUser } = dbUser;

    return NextResponse.json({ success: true, profile: safeUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Could not fetch profile.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, idNumber, companyRegNumber, billingAddress, showProfileDetails, profileColor } = body;

    const dbUser = await prisma.user.update({
      where: { id: user.id as string },
      data: {
        firstName,
        lastName,
        idNumber,
        companyRegNumber,
        billingAddress,
        showProfileDetails,
        profileColor
      }
    });

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Could not update profile.' }, { status: 500 });
  }
}
