import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const EXA_API_KEY = process.env.EXA_API_KEY;
    if (!EXA_API_KEY) {
      return NextResponse.json({ results: [], error: 'No API key' });
    }

    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EXA_API_KEY,
      },
      body: JSON.stringify({
        query: 'Base chain ecosystem news updates',
        numResults: 6,
        useAutoprompt: true,
        type: 'neural',
        startPublishedDate: new Date(Date.now() - 7 * 86400000)
          .toISOString()
          .split('T')[0],
      }),
    });

    const data = await res.json();
    const results = (data.results || []).map(
      (r: { title: string; url: string; publishedDate?: string }) => ({
        title: r.title,
        url: r.url,
        date: r.publishedDate?.split('T')[0] ?? '',
      })
    );

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
