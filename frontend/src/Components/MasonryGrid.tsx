import React from "react";

const images = [
  {
    id: 1,
    src: "https://i.pinimg.com/736x/8d/ba/c1/8dbac1faef8a281d5fa818f5d6365146.jpg",
  },
  {
    id: 2,
    src: "https://i.pinimg.com/1200x/1e/61/76/1e61761582f22975a7f966aa775538bc.jpg",
  },
  {
    id: 3,
    src: "https://i.pinimg.com/1200x/95/fe/d7/95fed79613df99be662c710f7b2489e4.jpg",
  },
  {
    id: 4,
    src: "https://i.pinimg.com/736x/4b/72/3a/4b723ad76e6d2149c5233fd25d38960d.jpg",
    row: "row-span-3",
  },
  {
    id: 5,
    src: "https://i.pinimg.com/736x/f2/a7/6d/f2a76d7d1a7540c124de3f05f560e844.jpg",
    row: "row-span-4",
  },
  {
    id: 6,
    src: "https://i.pinimg.com/1200x/cb/b1/04/cbb1046149c93281acb6b42a76a9ffe5.jpg",
    row: "row-span-2",
  },
  {
    id: 7,
    src: "https://i.pinimg.com/736x/98/3b/85/983b856f7baf1944a329cb22c2e70761.jpg",
  },
  {
    id: 8,
    src: "https://i.pinimg.com/736x/84/5a/74/845a74dbc9534944db1b32b7cfeb68af.jpg",
    row: "row-span-2",
  },
  {
    id: 9,
    src: "https://i.pinimg.com/736x/44/8b/e1/448be11079039e7f72595ac41c12ddea.jpg",
    row: "row-span-5",
  },
  {
    id: 10,
    src: "https://i.pinimg.com/736x/95/39/6d/95396da790e37dde6df2bf0e7dfa1261.jpg",
  },
  {
    id: 11,
    src: "https://i.pinimg.com/1200x/ca/87/e8/ca87e89fc54d0e058ab50dd36ff9ce0b.jpg",
    row: "row-span-3",
  },
  {
    id: 12,
    src: "https://i.pinimg.com/1200x/f7/d9/b7/f7d9b7552c01aa255f337d42fff5b0d9.jpg",
    row: "row-span-5",
  },
  {
    id: 13,
    src: "https://i.pinimg.com/736x/16/20/80/1620807c2840dfa663594a7b168212ba.jpg",
    row: "row-span-4",
  },
  {
    id: 14,
    src: "https://i.pinimg.com/736x/41/71/0c/41710c32a084d8fb05dd85142e505944.jpg",
    row: "row-span-2",
  },
  {
    id: 15,
    src: "https://i.pinimg.com/736x/0c/d2/7c/0cd27c517597bc3ad6505717382dd951.jpg",
  },
];

const MasonryGrid: React.FC = () => {
  return (
    <div className="w-full">
      {/* Masonry Grid */}
      <main className="w-full flex justify-center">
        <div className="grid grid-cols-3 gap-6 max-w-7xl w-full py-12 auto-rows-[150px]">
          {images.map((img, i) => (
            <div key={i} className={`${img.row || ""}`}>
              <img
                src={img.src}
                className="w-full h-full object-cover rounded-xl"
                alt=""
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MasonryGrid;
