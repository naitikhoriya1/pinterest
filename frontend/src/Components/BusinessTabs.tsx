import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const brands = [
  "/marque_icon/backardi.png",
  "/marque_icon/hayatt.png",
  "/marque_icon/hp.png",
  "/marque_icon/ikea.png",
  "/marque_icon/lego.png",
  "/marque_icon/luoce.png",
  "/marque_icon/mcd.png",
  "/marque_icon/paypal.png",
  "/marque_icon/rayban.png",
  "/marque_icon/uber.png",
];

interface TabData {
  key: string;
  tab: string;
  title: string;
  description: string;
  image: string;
}

const tabs: TabData[] = [
  {
    key: "awareness",
    tab: "Awareness",
    title: "Build awareness",
    description:
      "Grow your reach and build brand or product awareness. Image ads, Idea ads or Spotlight formats help you tell your story visually.",
    image:
      "https://i.pinimg.com/1200x/57/34/6a/57346ac560918b4039c10a4da9a9b2f0.jpg",
  },
  {
    key: "consideration",
    tab: "Consideration",
    title: "Drive consideration",
    description:
      "Inspire people to click on your content. Visually rich creative drives deeper engagement and motivates users to explore more.",
    image:
      "https://i.pinimg.com/736x/84/f1/07/84f1077b9501b985fa0dacfba451676d.jpg",
  },
  {
    key: "conversions",
    tab: "Conversions",
    title: "Get conversions",
    description:
      "Drive online actions or store visits. High-quality visuals help get your products in front of motivated shoppers.",
    image:
      "https://i.pinimg.com/736x/41/03/96/4103967c0b39bc0d32618ffcd97ed3e6.jpg",
  },
];

const BusinessTabs: React.FC = () => {
  const [active, setActive] = useState("awareness");

  const imageRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!imageRef.current || !textRef.current) return;

    const tl = gsap.timeline();

    // Fade out old content
    tl.to([imageRef.current, textRef.current], {
      opacity: 0,
      y: 20,
      duration: 0.2,
      ease: "power2.out",
    })
      // After fade-out, GSAP swaps content
      .call(() => {
        if (imageRef.current) {
          const img = imageRef.current.querySelector("img") as HTMLImageElement;
          img.src = activeTab.image;
        }
      })
      // Fade new content in
      .to([imageRef.current, textRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power3.out",
      });
  }, [active]);

  const activeTab = tabs.find((t) => t.key === active)!;

  return (
    <>
      <section className="w-full bg-[#F7F7F5] py-20 px-4">
        {/* Tabs */}
        <div className="flex justify-center items-center gap-3 mb-12 flex-wrap">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-all
                ${
                  active === item.key
                    ? "bg-black text-white"
                    : "text-gray-800 hover:bg-gray-200"
                }
                    `}
            >
              {item.tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: Image */}
          <div
            ref={imageRef}
            className=" p-6 md:p-10 rounded-2xl flex justify-center items-center opacity-0"
          >
            <img
              src={activeTab.image}
              alt={activeTab.title}
              className="rounded-2xl w-full max-w-sm md:max-w-md lg:max-w-full h-auto  object-cover"
            />
          </div>

          {/* Right: Text */}
          <div ref={textRef} className="flex flex-col justify-center opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-snug">
              {activeTab.title}
            </h2>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
              {activeTab.description}
            </p>
          </div>
        </div>
      </section>
      <section className="w-full bg-white py-20 px-4">
        {/* Text Section */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Brands win big with Pinterest ads
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mt-4 leading-relaxed">
            Brands such as Nestlé, Urban Outfitters and CeraVe are already using
            Pinterest to reach their goals. Explore our success story section to
            see how brands have achieved results for a variety of objectives.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <button className="px-8 py-3 bg-black text-white font-semibold rounded-full text-base hover:opacity-80 transition">
              Read success stories
            </button>

            <button className="px-8 py-3 border border-black text-black font-semibold rounded-full text-base hover:bg-black hover:text-white transition">
              Create ad
            </button>
          </div>
        </div>

        {/* Infinite Marquee */}
        <div className="relative overflow-hidden w-full mt-16">
          <div className="marquee flex items-center gap-16">
            {/* Track 1 */}
            {brands.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="brand"
                className="h-12 object-contain opacity-70 grayscale"
              />
            ))}

            {/* Track 2 (duplicate for seamless loop) */}
            {brands.map((src, i) => (
              <img
                key={`dup-${i}`}
                src={src}
                alt="brand"
                className="h-12 object-contain opacity-70 grayscale"
              />
            ))}
          </div>
        </div>

        {/* Marquee Animation */}
        <style>
          {`
          .marquee {
            width: max-content;
            display: flex;
            animation: scroll 22s linear infinite;
          }

          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
        </style>
      </section>
    </>
  );
};

export default BusinessTabs;
