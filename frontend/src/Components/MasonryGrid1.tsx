import Masonry from "react-masonry-css";
import type { Pin } from "../hooks/useFeed";

const breakpointColumnsObj = {
  default: 5,
  1280: 4,
  1024: 3,
  768: 2,
  500: 2,
};

interface MasonryGrid1Props {
  pins: Pin[];
}

const MasonryGrid1 = ({ pins }: MasonryGrid1Props) => {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex gap-4"
      columnClassName="flex flex-col gap-4"
    >
      {pins.map((pin) => (
        <div
          key={pin._id}
          className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-zoom-in bg-gray-100"
        >
          {/* Pin image */}
          <img
            src={pin.imageUrl}
            alt={pin.title}
            loading="lazy"
            className="w-full object-cover rounded-2xl block"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex flex-col justify-between p-3">
            {/* Save count badge */}
            <div className="flex justify-end">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
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
