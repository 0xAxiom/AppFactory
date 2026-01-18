import { CollageImage } from './CollageImage'
import { ZoraToken } from '@/app/api/zora-tokens/route'
import { useMemo } from 'react'

export function Collage({ tokens, displayName, selectedToken, setSelectedToken }: { tokens: ZoraToken[], displayName: string, selectedToken: ZoraToken | null, setSelectedToken: (token: ZoraToken | null) => void }) {
  // Create a safe tokens array with fallbacks for missing items
  const safeTokens = tokens || [];
  
  // Dynamic font size calculation based on display name length
  const dynamicFontSize = useMemo(() => {
    const name = displayName || 'name';
    if (name.length <= 6) return 'text-5xl md:text-6xl lg:text-7xl';
    if (name.length <= 10) return 'text-4xl md:text-5xl lg:text-6xl';
    if (name.length <= 15) return 'text-3xl md:text-4xl lg:text-5xl';
    if (name.length <= 20) return 'text-2xl md:text-3xl lg:text-4xl';
    return 'text-xl md:text-2xl lg:text-3xl';
  }, [displayName]);

  return (
    <div className="w-full bg-black" id="collage-container">
    
      <div className="grid grid-cols-3 gap-2">
        {/* Top row - 3 images */}
        <div className="aspect-square">
          {safeTokens[0] && (
            <CollageImage 
              token={safeTokens[0]}
              src={safeTokens[0].imageUrl || '/placeholder.svg'}
              alt={safeTokens[0].name || 'Token 1'}
              className={`${selectedToken?.name === safeTokens[0].name ? 'border-2 border-blue-500' : ''}`}
              onClick={() => safeTokens[0] && setSelectedToken(safeTokens[0])}
            />
          )}
        </div>
        
        <div className="aspect-square">
          {safeTokens[1] && (
            <CollageImage 
              token={safeTokens[1]}
              src={safeTokens[1].imageUrl || '/placeholder.svg'}
              alt={safeTokens[1].name || 'Token 2'}
              className={`${selectedToken?.name === safeTokens[1].name ? 'border-2 border-blue-500' : ''}`}
              onClick={() => safeTokens[1] && setSelectedToken(safeTokens[1])}
            />
          )}
        </div>
        
        <div className="aspect-square">
          {safeTokens[2] && (
            <CollageImage 
              token={safeTokens[2]}
              src={safeTokens[2].imageUrl || '/placeholder.svg'}
              alt={safeTokens[2].name || 'Token 3'}
              className={`${selectedToken?.name === safeTokens[2].name ? 'border-2 border-blue-500' : ''}`}
              onClick={() => safeTokens[2] && setSelectedToken(safeTokens[2])}
            />
          )}
        </div>
        
        {/* Middle row - Image on left, empty middle and right */}
        <div className="aspect-square">
          {safeTokens[3] && (
            <CollageImage 
              token={safeTokens[3]}
              src={safeTokens[3].imageUrl || '/placeholder.svg'}
              alt={safeTokens[3].name || 'Token 4'}
              className={`${selectedToken?.name === safeTokens[3].name ? 'border-2 border-blue-500' : ''}`}
              onClick={() => safeTokens[3] && setSelectedToken(safeTokens[3])}
            />
          )}
        </div>
        
        {/* Middle cell spans 2 columns */}
        <div className="col-span-2 flex items-center justify-center">
          <h1 
            className={`${dynamicFontSize} font-bold text-blue-500 text-center px-2 break-words max-w-full`}
            style={{ fontFamily: 'sans-serif' }}
          >
            {displayName || 'name'}
          </h1>
        </div>
        
        {/* Bottom row - "Built with MiniKit" on left, horse image spanning 2 cells */}
        <div className="flex flex-col items-start justify-start">
          <p className="text-2xl font-bold text-lime-500 leading-tight" style={{ fontFamily: 'sans-serif' }}>
            BUILT<br />WITH<br />MINIKIT
          </p>
        </div>
        
        <div className="col-span-2 aspect-[2/1]">
          {safeTokens[4] && (
            <CollageImage 
              token={safeTokens[4]}
              src={safeTokens[4].imageUrl || '/placeholder.svg'}
              alt={safeTokens[4].name || 'Token 5'}
              className={`${selectedToken?.name === safeTokens[4].name ? 'border-2 border-blue-500' : ''}`}
              onClick={() => safeTokens[4] && setSelectedToken(safeTokens[4])}
            />
          )}
        </div>
      </div>
    </div>
  )
}