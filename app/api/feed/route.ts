import { NextResponse } from 'next/server';
import { readDb } from '@/lib/serverDb';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function GET() {
  const db = readDb();
  const posts = (db.feedPosts || []).sort((a: any, b: any) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return NextResponse.json({ success: true, posts });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Handle Like Action
    if (data.action === 'like') {
      const { id } = data;
      const db = readDb();
      const post = db.feedPosts?.find(p => p.id === id);
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      post.likes = (post.likes || 0) + 1;
      const DB_FILE = path.join(process.cwd(), 'data', 'db.json');
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
      return NextResponse.json({ success: true, likes: post.likes });
    }

    // Handle Pin Action (Admin only)
    if (data.action === 'pin') {
      const { id, isPinned } = data;
      const db = readDb();
      const post = db.feedPosts?.find(p => p.id === id);
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      post.isPinned = isPinned;
      const DB_FILE = path.join(process.cwd(), 'data', 'db.json');
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
      return NextResponse.json({ success: true });
    }

    const { userId, businessName, tier, imageUrl, caption } = data;
    
    if (!userId || !businessName || !caption) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = readDb();
    if (!db.feedPosts) {
      db.feedPosts = [];
    }

    // Check rate limit: 1 per day per user
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const userPosts = db.feedPosts.filter(p => p.userId === userId && new Date(p.createdAt).getTime() > twentyFourHoursAgo);
    if (userPosts.length > 0) {
      return NextResponse.json({ error: 'Daily limit reached. You can only post once every 24 hours.' }, { status: 429 });
    }

    const newPost = {
      id: crypto.randomUUID(),
      userId,
      businessName,
      tier: tier || 'free',
      imageUrl,
      caption,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    // Add to the front of the feed
    db.feedPosts.unshift(newPost);
    
    // Save to disk
    const DB_FILE = path.join(process.cwd(), 'data', 'db.json');
    if (fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    }

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Feed post error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const db = readDb();
    if (!db.feedPosts) return NextResponse.json({ error: 'No posts found' }, { status: 404 });

    const initialLength = db.feedPosts.length;
    db.feedPosts = db.feedPosts.filter(p => p.id !== id);

    if (db.feedPosts.length === initialLength) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const DB_FILE = path.join(process.cwd(), 'data', 'db.json');
    if (fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
