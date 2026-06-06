import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_for_dev_only';

async function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  try {
    const token = authHeader.replace('Bearer ', '');
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    if (payload && payload.role === 'ADMIN') {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.user.findMany();
    
    // map to remove sensitive secrets from response, though admin in theory can see all info
    const safeUsers = users.map((u: any) => {
      const { passwordHash, twoFactorSecret, ...safe } = u;
      return safe;
    });

    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error) {
    console.error('Admin GET users error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      fullName,
      phone,
      idNumber,
      companyRegNumber,
      billingAddress,
      showProfileDetails,
      profileColor,
      website,
      businessName,
      vatNumber,
      maxListings
    } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role || 'USER',
        firstName: firstName || '',
        lastName: lastName || '',
        fullName: fullName || '',
        phone: phone || '',
        idNumber: idNumber || null,
        companyRegNumber: companyRegNumber || null,
        billingAddress: billingAddress || null,
        showProfileDetails: showProfileDetails || false,
        profileColor: profileColor || 'slate',
        website: website || '',
        businessName: businessName || '',
        vatNumber: vatNumber || '',
        maxListings: maxListings ? Number(maxListings) : 1
      }
    });

    return NextResponse.json({ success: true, message: 'User created successfully', userId: newUser.id });
  } catch (error) {
    console.error('Admin CREATE user error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      email,
      password,
      role,
      firstName,
      lastName,
      fullName,
      phone,
      idNumber,
      companyRegNumber,
      billingAddress,
      showProfileDetails,
      profileColor,
      website,
      businessName,
      vatNumber,
      maxListings,
      isBanned
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const dataToUpdate: any = {
      role,
      firstName,
      lastName,
      fullName,
      phone,
      idNumber,
      companyRegNumber,
      billingAddress,
      showProfileDetails,
      profileColor,
      website,
      businessName,
      vatNumber,
      maxListings: maxListings ? Number(maxListings) : undefined,
      isBanned: isBanned !== undefined ? isBanned : undefined
    };

    if (email && email !== existingUser.email) {
      const emailDup = await prisma.user.findUnique({ where: { email } });
      if (emailDup) {
        return NextResponse.json({ success: false, message: 'Email already used by another account' }, { status: 409 });
      }
      dataToUpdate.email = email;
    }

    if (password && password.trim() !== '') {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Admin UPDATE user error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    if (id === admin.id) {
      return NextResponse.json({ success: false, message: 'You cannot delete your own admin account from here.' }, { status: 400 });
    }

    // Cascade delete user listings (Cascaed is configured in schema, so we match it)
    await prisma.listing.deleteMany({
      where: { userId: id }
    });

    // Delete the user
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'User and all their listings have been permanently deleted.' });
  } catch (error) {
    console.error('Admin DELETE user error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
