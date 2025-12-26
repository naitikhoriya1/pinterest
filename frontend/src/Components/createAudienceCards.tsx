type Audience = {
  id: number;
  title: string;
  description: string;
  bullets: string[];
  explore: string;
  images: string[];
  avatar: string;
  name: string;
};

const audiences: Audience[] = [
  {
    id: 1,
    title: "Content creators",
    description: "For everyone who wants to share their ideas.",
    bullets: [
      "Grow and engage your audience with simple ways to create, customise and cross-post your content.",
      "Make money with features to drive traffic to your own site or destination.",
    ],
    explore: "Explore Pinterest for creators →",
    images: [
      "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    ],
    avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",
    name: "Solange Woods",
  },
  {
    id: 2,
    title: "Merchants",
    description: "For shops and retailers of any size.",
    bullets: [
      "Increase sales or web conversions with shoppable content formats—and reach an audience that’s ready to shop.",
      "Build brand awareness with seamless solutions for scaling and optimising your organic content.",
    ],
    explore: "Explore Pinterest for merchants →",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    ],
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    name: "Home Universal",
  },
  {
    id: 3,
    title: "Publishers and media companies",
    description: "For traditional, digital and everything in between.",
    bullets: [
      "Amplify your brand to the millions of deeply engaged people on Pinterest.",
      "Grow your business with easy, efficient bulk creation tools.",
    ],
    explore: "Explore Pinterest for publishers and media companies →",
    images: [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    ],
    avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7",
    name: "Publisher",
  },
];

export default function AudienceCards() {
  return (
    <section className="max-w-[1180px] mx-auto px-3 py-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
        {audiences.map((item) => (
          <div key={item.id} className="relative">
            {/* Floating card */}
            <div className="relative w-[200px]">
              {/* LEFT COVER IMAGE */}
              <div className="absolute -left-20 top-3 z-0 h-[200px] w-[200px] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={item.images[1]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              {/* RIGHT COVER IMAGE */}
              <div className="absolute -right-20 top-3 z-0 h-[200px] w-[200px] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={item.images[2]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              {/* MAIN CARD */}
              <div className="relative z-10 rounded-[28px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.15)] overflow-hidden">
                {/* HERO IMAGE */}
                <div className="h-[150px] w-full">
                  <img
                    src={item.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* AVATAR */}
                <div className="absolute left-1/2 top-[100px] -translate-x-1/2">
                  <div className="h-15 w-15 rounded-e-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* TEXT */}
                <div className="pt-4 pb-6 text-center">
                  <p className="text-lg font-semibold text-neutral-900">
                    {item.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="pt-28">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>

              <p className="text-gray-600 mb-6">{item.description}</p>

              <ul className="space-y-4 mb-6">
                {item.bullets.map((text, i) => (
                  <li key={i} className="flex gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className="inline-flex items-center font-semibold text-gray-900 hover:underline"
              >
                {item.explore}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
