import { NextResponse } from 'next/server';
import { getGallery, saveGalleryAlbum, addAuditLog } from '@/lib/db';
import { GalleryAlbum } from '@/lib/types';

export async function GET() {
  const gallery = getGallery();
  return NextResponse.json({ success: true, data: gallery });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = `ALB-${Date.now()}`;

    const newAlbum: GalleryAlbum = {
      id,
      title: body.title || 'New Gallery Album',
      category: body.category || 'Matches',
      description: body.description || '',
      coverUrl: body.coverUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
      mediaCount: body.items?.length || 1,
      createdAt: new Date().toISOString(),
      published: true,
      items: body.items || [
        {
          id: `MED-${Date.now()}`,
          type: 'photo',
          url: body.coverUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
          caption: body.title || 'Album Photo',
          uploadedAt: new Date().toISOString()
        }
      ]
    };

    saveGalleryAlbum(newAlbum);

    addAuditLog({
      userId: body.authorId || 'USR-001',
      userName: body.authorName || 'Admin',
      userRole: body.authorRole || 'ADMIN',
      action: `Created gallery album ${newAlbum.title}`,
      affectedRecordId: id,
      affectedRecordType: 'GalleryAlbum',
      newValue: newAlbum.title,
      ipAddress: '127.0.0.1'
    });

    return NextResponse.json({ success: true, data: newAlbum });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = saveGalleryAlbum(body);

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
