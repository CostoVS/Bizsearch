import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Standardized mail interface
interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Sends an email using high-quality authenticated SMTP or falls back to log filing for testing.
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  // Use BizSearch24 as a clear friendly sender name to comply with anti-spam requirements
  const from = process.env.SMTP_FROM || '"BizSearch24 Support" <no-reply@bizsearch24.co.za>';

  const timestamp = new Date().toISOString();
  console.log(`[Email Sending Session Started at ${timestamp}] Destination: ${options.to}, Subject: "${options.subject}"`);

  // To assist with instant debugging and sandbox testing:
  const logDirectory = path.join(process.cwd(), 'data');
  const logFile = path.join(logDirectory, 'email-delivery-sandbox.log');
  
  const formattedLogEntry = `
========================================
TIMESTAMP: ${timestamp}
TO: ${options.to}
FROM: ${from}
SUBJECT: ${options.subject}
TEXT CONTENT:
${options.text}
----------------------------------------
HTML CONTENT:
${options.html}
========================================
\n`;

  try {
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }
    fs.appendFileSync(logFile, formattedLogEntry, 'utf-8');
  } catch (err) {
    console.error('Could not write to local email sandboxed log file:', err);
  }

  // If credentials are not present, log as a successful mock delivery in local preview
  if (!host || !user) {
    console.log(`[Email Mock Fallback Activated] Credentials not set in environment. Saved receipt details to project file sandbox: ${logFile}`);
    return {
      success: true,
      messageId: `mock_${Date.now()}`
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false // Avoid SSL certificate handshake failures with custom VPS/direct configurations
      }
    });

    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`[Email Delivered Successfully via SMTP] MessageId: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error: any) {
    console.error('[Email SMTP Delivery Failed]', error);
    return {
      success: false,
      error: error.message || String(error)
    };
  }
}
