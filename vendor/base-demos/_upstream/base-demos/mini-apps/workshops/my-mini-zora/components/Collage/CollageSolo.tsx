import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";


type CollageSoloProps = {
  tokenAddress: string;
  title: string;
  holders: string;
  id: string;
  description: string;
  format: string;
  size: string;
  created: string;
  collection: string;
  imagePath: string;
};

export function CollageSolo({
  tokenAddress,
  title,
  holders,
  id,
  description,
  format,
  size,
  created,
  collection,
  imagePath,
}: CollageSoloProps) {
  return (
    <div className="w-full max-w-4xl">
     

      <div className="border border-gray-700 bg-gray-900 p-0.5">
        <div className="border border-gray-800 bg-black p-6">
          {/* Image header */}
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white font-mono">{title}</h1>
              <p className="text-xs text-gray-500 font-mono mt-1">Holders: {holders}</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 px-3 py-1 text-xs text-lime-300 font-mono">
              ID: {id}
            </div>
          </div>

          {/* Main image */}
          <div className="relative border border-gray-700 bg-gray-900 p-0.5 mb-6">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={imagePath}
                alt={title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-sm font-mono text-gray-400 mb-2">DESCRIPTION:</h2>
            <p className="text-white font-mono text-sm leading-relaxed">{description}</p>
          </div>

          {/* Zora link button */}
          <Link
            href={`https://zora.co/coin/base:${tokenAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-black border border-gray-700 hover:border-lime-300 text-white py-3 px-6 font-mono tracking-wider transition-colors duration-300 group"
            style={{
              clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)",
            }}
          >
            <span className="group-hover:text-lime-300 transition-colors duration-300">VIEW ON ZORA</span>
            <ExternalLink size={14} className="group-hover:text-lime-300 transition-colors duration-300" />
          </Link>

          {/* Technical details */}
          <div className="mt-12 pt-6 border-t border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h3 className="text-xs text-gray-500 font-mono mb-1">FORMAT</h3>
                <p className="text-xs text-white font-mono">{format}</p>
              </div>
              <div>
                <h3 className="text-xs text-gray-500 font-mono mb-1">TOTAL SUPPLY</h3>
                <p className="text-xs text-white font-mono">{size}</p>
              </div>
              <div>
                <h3 className="text-xs text-gray-500 font-mono mb-1">CREATOR</h3>
                <p className="text-xs text-white font-mono">{created}</p>
              </div>
              <div>
                <h3 className="text-xs text-gray-500 font-mono mb-1">24H VOLUME</h3>
                <p className="text-xs text-white font-mono">{collection}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}