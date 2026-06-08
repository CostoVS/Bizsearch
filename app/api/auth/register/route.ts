import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, username, password, selectedTier } = await req.json();
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

    // Use explicit username if provided, or fallback to parsed part from the email
    const safeUsername = username ? username.trim().toLowerCase() : email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();

    if (safeUsername) {
      const existingUserByUsername = await prisma.user.findUnique({ where: { username: safeUsername } });
      if (existingUserByUsername) {
        return NextResponse.json({ success: false, message: 'Username already in use.' }, { status: 409 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        username: safeUsername || null,
        passwordHash,
        lastKnownIp: ip,
        userAgent,
        selectedTier: selectedTier || 'FREE',
        tier: 'FREE', // Always default actual active tier to FREE until Admin approves
        role: (isFirstUser || email === process.env.ADMIN_USERNAME || email === 'admin@bizsearch24.co.za' || email.toLowerCase() === 'nicholauscostochetty@gmail.com') ? 'ADMIN' : 'USER'
      }
    });

    // Send a polite Welcome Email using our new sendEmail helper
    await sendEmail({
      to: email,
      subject: 'Welcome to BizSearch24 Directory!',
      text: `Hello,\n\nWelcome to BizSearch24! Your directory member account has been registered successfully.\n\nYour Username: ${safeUsername || email}\nJoined Account: ${email}\n\nThank you for choosing BizSearch24!\n- The BizSearch24 Team`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
            <h1 style="color: #059669; font-size: 24px; font-weight: bold; margin-bottom: 16pt;">Welcome to BizSearch24</h1>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">Hello,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">Welcome to <strong>BizSearch24</strong>! Your directory member account has been registered successfully with the following credentials:</p>
            <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin: 20px 0; font-family: monospace; font-size: 13px;">
              <strong>Username:</strong> ${safeUsername || email}<br/>
              <strong>Email Address:</strong> ${email}
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">Start adding your premium listed businesses, boost SEO visibility and explore South Africa's trusted companies.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 11px; color: #94a3b8; line-height: 1.5; margin: 0;">
              This is an automated notification from BizSearch24. Please do not reply directly to this email. To contact our support desk, reach us at support@bizsearch24.co.za.
            </p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true, message: 'Account created successfully.' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
