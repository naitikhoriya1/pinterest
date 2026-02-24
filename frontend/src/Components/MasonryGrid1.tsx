import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 5,
  1280: 4,
  1024: 3,
  768: 2,
  500: 1,
};

const MasonryGrid1 = ({ images }: { images: string[] }) => {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex gap-4"
      columnClassName="flex flex-col gap-4"
    >
      {images.map((img, index) => (
        <div key={index} className="rounded-xl overflow-hidden">
          <img
            src={img}
            className="w-full rounded-xl hover:opacity-90 transition"
          />
        </div>
      ))}
    </Masonry>
  );
};

export default MasonryGrid1;
