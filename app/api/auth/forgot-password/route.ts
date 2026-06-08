import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();
    const cleanIdentifier = (identifier || '').toLowerCase().trim();

    if (!cleanIdentifier) {
      return NextResponse.json({ success: false, message: 'Please provide your email address or username.' }, { status: 400 });
    }

    // Find the user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          { username: cleanIdentifier }
        ]
      }
    });

    if (!user) {
      // To prevent account enumeration attacks but remain helpful, we'll return a friendly success message,
      // but log that the user was not found.
      console.log(`Password reset requested for non-existing identifier: ${cleanIdentifier}`);
      return NextResponse.json({ 
        success: true, 
        message: 'If your account exists in our system, you will receive an email with your new temporary password shortly.' 
      });
    }

    // Generate a secure, easily typed temporary reset password (e.g., BZ-DF83K2S)
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing characters like O, 0, I, 1
    let tempPassword = 'BZ-';
    for (let i = 0; i < 7; i++) {
      tempPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Hash the new temporary password
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // Update the database securely
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    // Dispatch the password reset email
    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Your Password Has Been Reset - BizSearch24',
      text: `Hello,\n\nYou have requested a password reset for your BizSearch24 account.\n\nYour Username: ${user.username || user.email}\nYour New Temporary Password: ${tempPassword}\n\nPlease log in using this temporary password and update it immediately inside your Profile & Settings panel.\n\nThank you,\n- The BizSearch24 Support Team`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
            <h1 style="color: #4f46e5; font-size: 24px; font-weight: bold; margin-bottom: 16pt;">Password Reset Request</h1>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">Hello,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">You have requested a password reset for your account listed on the <strong>BizSearch24</strong> directory platform.</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">We have generated a secure new temporary password for you to regain access to your dashboard:</p>
            <div style="background-color: #eef2ff; border: 1px dashed #c7d2fe; padding: 18px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <span style="font-size: 12px; font-weight: bold; color: #6366f1; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Temporary Password</span>
              <span style="font-size: 22px; font-family: monospace; font-weight: bold; color: #1e1b4b; letter-spacing: 0.1em;">${tempPassword}</span>
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;"><strong>What should I do now?</strong></p>
            <ol style="font-size: 14px; line-height: 1.6; color: #475569; padding-left: 20px;">
              <li>Log in using either your email address (<strong>${user.email}</strong>) or your username (<strong>${user.username || user.email}</strong>).</li>
              <li>Input the temporary password exactly as shown above.</li>
              <li>Navigate to your <strong>Profile & Settings</strong> tab and set a new personal password.</li>
            </ol>
            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; margin-top: 20px; border-radius: 4px;">
              <p style="font-size: 12px; color: #b45309; margin: 0; font-weight: bold;">⚠️ Security Notice:</p>
              <p style="font-size: 12px; color: #b45309; margin: 4px 0 0 0;">If you did not request this reset, please log in with your current details immediately or contact support.</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 11px; color: #94a3b8; line-height: 1.5; margin: 0;">
              This is an automated notification from BizSearch24. Please do not reply directly to this email. For assistance, reach us at support@bizsearch24.co.za.
            </p>
          </div>
        </div>
      `
    });

    if (!emailResult.success) {
      console.error(`Email delivery error: ${emailResult.error}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'If your account exists in our system, you will receive an email with your new temporary password shortly.' 
    });

  } catch (error) {
    console.error('Error handling forgot password:', error);
    return NextResponse.json({ success: false, message: 'Server error occurred during password reset.' }, { status: 500 });
  }
}
