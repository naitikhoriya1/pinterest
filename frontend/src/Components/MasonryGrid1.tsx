import React, { useEffect } from "react";
import Masonry from "react-masonry-css";
import type { Pin } from "../types/pin";

const breakpointColumnsObj = {
  default: 5,
  1280: 4,
  1024: 3,
  640: 2,
};

interface MasonryGrid1Props {
  pins: Pin[];
  onPinClick?: (pin: Pin) => void;
}

const MasonryGrid1: React.FC<MasonryGrid1Props> = ({ pins, onPinClick }) => {
  useEffect(() => {
    console.log(`[MasonryGrid1] Rendering grid with ${pins.length} pins.`);
  }, [pins.length]);

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex gap-4"
      columnClassName="flex flex-col gap-4"
    >
      {pins.map((pin) => (
        <div
          key={pin._id}
          onClick={() => {
            console.log("[MasonryGrid1] Pin clicked:", {
              id: pin._id,
              title: pin.title,
              imageUrl: pin.imageUrl,
              tags: pin.tags,
            });
            onPinClick?.(pin);
          }}
          className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100"
        >
          {/* Pin image with width, height, loading="lazy", and w-full h-auto */}
          <img
            src={pin.imageUrl}
            alt={pin.title}
            width={pin.width}
            height={pin.height}
            loading="lazy"
            onLoad={() => {
              // optional debug if needed
            }}
            onError={() => {
              console.error("[MasonryGrid1] ❌ Pin image failed to load:", {
                pinId: pin._id,
                title: pin.title,
                failedUrl: pin.imageUrl,
              });
            }}
            className="w-full h-auto object-cover rounded-2xl block"
          />

          {/* Hover overlay showing title and save count */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex flex-col justify-between p-3 pointer-events-none">
            {/* Save count badge */}
            <div className="flex justify-end">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                ♥ {pin.saveCount}
              </span>
            </div>

            {/* Title at bottom */}
            <p className="text-white font-semibold text-sm leading-snug line-clamp-2 drop-shadow-md">
              {pin.title}
            </p>
          </div>
        </div>
      ))}
    </Masonry>
  );
};

export default MasonryGrid1;
