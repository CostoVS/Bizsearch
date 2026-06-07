import { NextResponse } from "next/server";
import { readDb, saveDb } from "@/lib/serverDb";
const Filter = require('bad-words');

const filter = new Filter();

// Custom additional South African profanity and slang often used by bad actors
const customBadWords = [
  'poes', 'kak', 'moer', 'fok', 'naaier', 'zef', 'doos', 'pomp', 'naai',
  'nigger', 'kaffir', 'coolie', 'boere', 'paki',
  'scam', 'crypto', 'whatsapp me', 'telegram me', 'invest and win', 'make money fast'
];

customBadWords.forEach(word => filter.addWords(word));

export async function POST(req: Request) {
  try {
    const { image, caption, userId } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    const textToCheck = caption || '';
    
    let isSafe = true;
    let rejectionReason = '';

    // 1. Text Moderation (Local)
    if (filter.isProfane(textToCheck)) {
      isSafe = false;
      rejectionReason = 'detected inappropriate language or "Bad Actor" patterns (SAPS patterns)';
    }

    // 2. Pattern Matching for Scams/Bots
    if (isSafe) {
      const botPatterns = [
        /\+\d{1,3}\s?\(?\d{3}\)?\s?\d{3}\s?\d{4}/,
        /http[s]?:\/\/[^\s]+/,
        /bit\.ly|t\.me|wa\.me/i,
        /dm for info|send me a message|earn daily/i
      ];

      for (const pattern of botPatterns) {
        if (pattern.test(textToCheck)) {
          isSafe = false;
          rejectionReason = 'Automated policy: External links or direct contact patterns in captions are flagged.';
          break;
        }
      }
    }

    // 3. Image Metadata/Size check
    if (isSafe && image && image.length > 5 * 1024 * 1024) {
      isSafe = false;
      rejectionReason = 'Resource protection: Uploaded image exceeds safety limits (5MB).';
    }

    // 4. [OPTIONAL] Ollama Vision Check (only if configured and user specifically asks/has it)
    if (isSafe && image && process.env.OLLAMA_VISION_MODEL) {
       try {
         const ollamaUrl = process.env.OLLAMA_URL || 'http://host.docker.internal:11434';
         const base64Data = image.split(',')[1];
         
         const ollamaRes = await fetch(`${ollamaUrl}/api/generate`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             model: process.env.OLLAMA_VISION_MODEL,
             prompt: `Analyze this image and caption: "${textToCheck}". Is it appropriate for a business directory feed? Focus on detecting NSFW, violence, or spam. Respond with ONLY "SAFE" or "REJECTED: reason"`,
             images: [base64Data],
             stream: false
           })
         });
         
         if (ollamaRes.ok) {
           const result = await ollamaRes.json();
           const text = (result.response || "").trim();
           if (!text.startsWith('SAFE')) {
             isSafe = false;
             rejectionReason = text.includes('REJECTED:') ? text.split('REJECTED:')[1].trim() : 'Ollama flagged this content.';
           }
         }
       } catch (err) {
         console.warn('Ollama vision check failed or unavailable:', err);
       }
    }

    if (!isSafe) {
      // Log the moderation event
      const db = readDb();
      if (!db.moderationLogs) db.moderationLogs = [];
      db.moderationLogs.push({
        id: `mod_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'scam',
        content: textToCheck,
        reason: rejectionReason,
        ip,
        userId: userId || 'anonymous'
      });
      saveDb(db);

      return NextResponse.json({ safe: false, reason: rejectionReason });
    }

    return NextResponse.json({ safe: true });

  } catch (error) {
    console.error('Local Safety Moderation error:', error);
    return NextResponse.json({ safe: false, reason: 'Internal moderation error' }, { status: 500 });
  }
}
