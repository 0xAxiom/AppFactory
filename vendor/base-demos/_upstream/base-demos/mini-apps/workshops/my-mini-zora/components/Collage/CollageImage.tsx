import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ZoraToken } from "@/app/api/zora-tokens/route";
import { useState } from "react";

interface CollageImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
  token?: ZoraToken;
}

export function CollageImage({
  src,
  alt,
  className,
  priority = false,
  onClick,
  token,
}: CollageImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Build a query string from the token object
  const queryString = new URLSearchParams();
  if (token) {
    queryString.set("name", token.name);
  }

  // Use original image URL directly - no proxy needed for screen capture
  const imageUrl = src || "/placeholder.svg";

  // Log image loading for debugging
  if (token?.name && imageUrl !== "/placeholder.svg") {
    console.log(
      "🔄 [COLLAGE-IMAGE] Loading image for",
      token.name + ":",
      imageUrl,
    );
  }

  return (
    <div
      className={cn("relative w-full h-full group", className)}
      data-image-loaded={imageLoaded}
    >
      <Link
        href={`token/${token?.address}?${queryString.toString()}`}
        className="block w-full h-full"
        onClick={onClick}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover transition-all duration-300"
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(false);
          }}
        />

        {/* Loading placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Token name overlay - visible only on hover */}
        {token?.name && (
          <div className="absolute inset-0 flex items-start justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span
              className="font-medium text-lime-500 text-sm px-2 py-1 bg-black/70 rounded"
              style={{ fontFamily: "monospace" }}
            >
              {token.name}
            </span>
          </div>
        )}
      </Link>
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>
      {/* Noise texture */}
      <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            backgroundSize: "cover",
          }}
        ></div>
      </div>
    </div>
  );
}
