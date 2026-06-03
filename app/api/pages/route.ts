import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb } from '@/lib/serverDb';
import { verifyAdminSession } from '@/lib/auth';
import { DynamicPage } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const dbData = readDb();

    if (slug) {
      const page = dbData.pages.find(p => p.slug === slug);
      if (!page) {
        return NextResponse.json({ success: false, message: 'Page not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, page });
    }

    return NextResponse.json({ success: true, pages: dbData.pages });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Could not load pages.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Administrative access required.' }, { status: 401 });
    }

    const { title, slug, content, metaDescription, keywords, geoRegion, geoPlacename, geoPosition } = await req.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ success: false, message: 'Missing page parameters (Title, Slug, Content).' }, { status: 400 });
    }

    // Clean slug
    const cleanedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const dbData = readDb();
    const slugExists = dbData.pages.some(p => p.slug === cleanedSlug);

    if (slugExists) {
      return NextResponse.json({ success: false, message: 'Slug already exists. Please choose a unique URL path.' }, { status: 409 });
    }

    const newPage: DynamicPage = {
      id: 'p_' + Math.random().toString(36).substring(2, 11),
      title,
      slug: cleanedSlug,
      content,
      metaDescription: metaDescription || `${title} - Bizsearch24 SEO Page`,
      keywords: keywords || '',
      geoRegion: geoRegion || '',
      geoPlacename: geoPlacename || '',
      geoPosition: geoPosition || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dbData.pages.push(newPage);
    saveDb(dbData);

    return NextResponse.json({ success: true, message: 'Dynamic SEO Page successfully created!', page: newPage });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create page.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Administrative access required.' }, { status: 401 });
    }

    const { id, title, slug, content, metaDescription, keywords, geoRegion, geoPlacename, geoPosition } = await req.json();

    if (!id || !title || !slug || !content) {
      return NextResponse.json({ success: false, message: 'Missing page parameters.' }, { status: 400 });
    }

    const cleanedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const dbData = readDb();
    const index = dbData.pages.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Page not found.' }, { status: 404 });
    }

    // Check slug collision excluding current page
    const slugExists = dbData.pages.some(p => p.slug === cleanedSlug && p.id !== id);
    if (slugExists) {
      return NextResponse.json({ success: false, message: 'Slug already taken by another page.' }, { status: 409 });
    }

    dbData.pages[index] = {
      ...dbData.pages[index],
      title,
      slug: cleanedSlug,
      content,
      metaDescription: metaDescription || `${title} - Bizsearch24 SEO Page`,
      keywords: keywords || '',
      geoRegion: geoRegion || '',
      geoPlacename: geoPlacename || '',
      geoPosition: geoPosition || '',
      updatedAt: new Date().toISOString()
    };

    saveDb(dbData);
    return NextResponse.json({ success: true, message: 'SEO Page successfully updated!', page: dbData.pages[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save page.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminSession(req);
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Administrative access required.' }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing page ID.' }, { status: 400 });
    }

    const dbData = readDb();
    const index = dbData.pages.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Page not found.' }, { status: 404 });
    }

    dbData.pages.splice(index, 1);
    saveDb(dbData);

    return NextResponse.json({ success: true, message: 'SEO Page successfully deleted!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete page.' }, { status: 500 });
  }
}
