import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { results: [], error: 'Exa API key not configured' },
      { status: 200 }
    );
  }

  try {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        query,
        type: 'auto',
        numResults: 5,
        contents: {
          text: { maxCharacters: 200 },
        },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ results: [], error: 'Exa search failed' });
    }

    const data = await res.json();
    const results = (data.results || []).map(
      (r: { title?: string; url?: string; text?: string }) => ({
        title: r.title || '',
        url: r.url || '',
        snippet: r.text || '',
      })
    );

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [], error: 'Search request failed' });
  }
}
