import React, { useState, useEffect } from "react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string; // e.g., "aspect-video", "aspect-square", "aspect-[16/10]" etc.
  priority?: "high" | "low" | "auto";
  isBelowFold?: boolean;
  referrerPolicy?: any;
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  aspectRatioClass = "aspect-auto",
  priority = "low",
  isBelowFold = true,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger browser-level prefetching when component mounts
  useEffect(() => {
    if (src) {
      const img = new Image();
      img.src = src;
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass} ${className}`}>
      {/* Subtle, elegant pulsing skeleton overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#0E0E10] animate-pulse flex items-center justify-center z-10">
          {/* Minimal gold accent indicator */}
          <div className="w-5 h-5 border-2 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        loading={isBelowFold ? "lazy" : "eager"}
        fetchPriority={priority}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        {...props}
      />
    </div>
  );
}
