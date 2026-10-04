import { NextResponse } from 'next/server';
import { extractTransactionFromImage } from '@/lib/ocr-helper';

export async function POST(request: Request) {
  try {
    const body = await request.json(); // { imageUrl, text }
    const result = extractTransactionFromImage(body.imageUrl || 'receipt.png', body.text);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
