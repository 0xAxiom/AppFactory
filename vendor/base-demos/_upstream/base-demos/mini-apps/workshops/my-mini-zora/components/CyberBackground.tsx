export function CyberpunkBackground() {
    return (
      <div className="fixed inset-0 bg-black overflow-hidden pointer-events-none z-0">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-12 gap-4">
          {Array(13)
            .fill(0)
            .map((_, i) => (
              <div key={`v-${i}`} className="col-span-1 h-full border-l border-gray-800"></div>
            ))}
        </div>
        <div className="absolute inset-0 grid grid-rows-12 gap-4">
          {Array(13)
            .fill(0)
            .map((_, i) => (
              <div key={`h-${i}`} className="row-span-1 w-full border-t border-gray-800"></div>
            ))}
        </div>
  
        {/* Dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-around">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={`dot-${i}`} className="w-1 h-1 rounded-full bg-gray-500"></div>
            ))}
        </div>
  
        {/* Cyber elements */}
        <div className="absolute top-1/4 right-1/4 w-8 h-8">
          <div className="w-full h-full relative">
            <div className="absolute inset-0 border-2 border-lime-300 rounded-full opacity-20"></div>
            <div className="absolute inset-2 border border-cyan-300 rounded-full opacity-10"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-lime-300 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
  
        <div className="absolute bottom-1/4 left-1/3 w-6 h-6">
          <div className="w-full h-full relative">
            <div className="absolute inset-0 border border-lime-300 rotate-45 opacity-20"></div>
            <div className="absolute inset-0 border border-cyan-300 -rotate-45 opacity-10"></div>
          </div>
        </div>
  
        <div className="absolute top-1/3 left-1/5 w-10 h-10">
          <div className="w-full h-full relative">
            <div className="absolute inset-0 border border-lime-300 rounded-full opacity-10"></div>
            <div className="absolute inset-3 border border-cyan-300 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    )
  }
  