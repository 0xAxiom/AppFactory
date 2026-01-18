import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Generate OG Image for Zora Collage using Vercel OG Image service
 * This is server-side generation - more reliable than client-side screen capture
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const displayName = searchParams.get('displayName') || 'name';
    
    // Get token images from query params
    const imageUrls = [
      searchParams.get('img1'),
      searchParams.get('img2'), 
      searchParams.get('img3'),
      searchParams.get('img4'),
      searchParams.get('img5'),
    ].filter(Boolean);

    console.log('🖼️ [OG-COLLAGE] Generating for:', displayName, 'with', imageUrls.length, 'images');

    // Dynamic font size based on display name length
    const getFontSize = (name: string) => {
      if (name.length <= 6) return 120;
      if (name.length <= 10) return 100;
      if (name.length <= 15) return 80;
      if (name.length <= 20) return 60;
      return 50;
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            backgroundColor: '#000000',
            padding: '20px',
          }}
        >
          {/* Grid Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              gap: '16px',
            }}
          >
            {/* Top Row - 3 images */}
            <div style={{ display: 'flex', gap: '16px', height: '33%' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ flex: 1, display: 'flex' }}>
                  {imageUrls[i] ? (
                    <img
                      src={imageUrls[i]}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      alt={`Token ${i + 1}`}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      backgroundColor: '#1a1a1a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: '#666'
                    }}>
                      ?
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Middle Row - Image + Name */}
            <div style={{ display: 'flex', gap: '16px', height: '33%' }}>
              {/* Left image */}
              <div style={{ flex: 1, display: 'flex' }}>
                {imageUrls[3] ? (
                  <img
                    src={imageUrls[3]}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    alt="Token 4"
                  />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: '#666'
                  }}>
                    ?
                  </div>
                )}
              </div>
              
              {/* Name spans 2 columns */}
              <div style={{
                flex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
                fontSize: getFontSize(displayName),
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: 'sans-serif'
              }}>
                {displayName}
              </div>
            </div>

            {/* Bottom Row - "Built with MiniKit" + Horse image */}
            <div style={{ display: 'flex', gap: '16px', height: '33%' }}>
              {/* Built with MiniKit */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                color: '#22c55e',
                fontSize: '36px',
                fontWeight: 'bold',
                lineHeight: '1.1',
                fontFamily: 'sans-serif'
              }}>
                <div>BUILT</div>
                <div>WITH</div>
                <div>MINIKIT</div>
              </div>
              
              {/* Bottom image spans 2 columns */}
              <div style={{ flex: 2, display: 'flex' }}>
                {imageUrls[4] ? (
                  <img
                    src={imageUrls[4]}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    alt="Token 5"
                  />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: '#666'
                  }}>
                    ?
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630, // Standard OG image dimensions
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
        },
      }
    );
  } catch (error) {
    console.error('❌ [OG-COLLAGE] Error generating image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
