import { NextResponse } from 'next/server';
import lingosData from '@/data/lingos.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const lingos = lingosData.lingos;
    console.log(`Total lingos available: ${lingos.length}`);

    const randomIndex = Math.floor(Math.random() * lingos.length);
    console.log(`Selected random index: ${randomIndex}`);

    const randomLingo = lingos[randomIndex];
    console.log('Serving lingo:', {
      id: randomLingo.id,
      prompt: randomLingo.prompt,
      answer: randomLingo.answer,
      timestamp: new Date().toISOString(),
    });

    // Return response with no-cache headers
    return new NextResponse(JSON.stringify(randomLingo), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control':
          'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Error serving lingo:', error);
    return NextResponse.json(
      { error: 'Failed to serve lingo' },
      { status: 500 }
    );
  }
}
