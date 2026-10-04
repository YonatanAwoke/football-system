export class NextResponse {
  static json(data: any, init?: { status?: number; headers?: Record<string, string> }) {
    return new Response(JSON.stringify(data), {
      status: init?.status || 200,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
      }
    });
  }
}
