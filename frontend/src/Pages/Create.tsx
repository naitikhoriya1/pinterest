import { useEffect, useRef } from "react";
import gsap from "gsap";
import BusinessTabs from "../Components/createBusinessTabs";
import AudienceCards from "../Components/createAudienceCards";
import SuccessStories from "../Components/createSuccessstories";
import WhyPinterest from "../Components/createWhyPinterest";
import AboutNavbar from "../Components/AboutNavbar";

/* ✅ Use direct image URLs (CDN-safe) */
export const leftImages: string[] = [
  "https://i.pinimg.com/736x/f6/3e/d7/f63ed76c45f0487a9bbf840aa018e1d5.jpg",
  "https://i.pinimg.com/736x/0d/60/40/0d6040a7ec6513201a40811b33664bb6.jpg",
  "https://i.pinimg.com/736x/c4/ca/7a/c4ca7a5b18334fb47889c313e49e2b65.jpg",
  "https://i.pinimg.com/736x/63/af/e6/63afe6faa378e9c5629b0ce9e3aa771e.jpg",
];

const rightImages: string[] = [
  "https://i.pinimg.com/736x/c3/cc/f4/c3ccf4389268b366f5af7bfe9c7aa640.jpg",
  "https://i.pinimg.com/736x/9f/80/b1/9f80b1d524c13e859abc490a2992f91b.jpg",
  "https://i.pinimg.com/1200x/c3/43/ad/c343ad0d2313d2f4659262254a09dd37.jpg",
  "https://i.pinimg.com/736x/a2/f1/f3/a2f1f36bbc6d65bf6230baab85b28408.jpg",
];

const Create = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".float", {
        y: -20,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.35,
          from: "random",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden px-6"
      >
        {/* LEFT FLOATING IMAGES */}
        <div className="absolute left-8 top-24 hidden xl:flex flex-col gap-6">
          {leftImages.map((src, i) => (
            <div
              key={i}
              className="float w-28 aspect-[3/4] rounded-2xl overflow-hidden shadow-md"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* CENTER CONTENT */}
        <div className="relative z-10 text-center max-w-xl">
          <h1 className="text-6xl md:text-5xl xl:text-6xl font-bold leading-tight text-neutral-900">
            Where your <br /> content can thrive
          </h1>

          <p className="mt-6 text-xl text-neutral-600">
            On Pinterest, create with ease and grow your brand all in a more
            positive place.
          </p>

          <button className="mt-10 inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-white font-semibold hover:bg-neutral-800 transition">
            Get started
          </button>
        </div>

        {/* RIGHT FLOATING IMAGES */}
        <div className="absolute right-8 top-24 hidden xl:flex flex-col gap-6">
          {rightImages.map((src, i) => (
            <div
              key={i}
              className="float w-28 aspect-[3/4] rounded-2xl overflow-hidden shadow-md"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
      <BusinessTabs />
      <section
        ref={sectionRef}
        className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden px-6"
      >
        <div className="relative z-10 text-center max-w-xl">
          <h1 className="text-8xl md:text-6xl xl:text-6xl font-bold leading-tight text-neutral-900">
            Pinterest for Your Brand
          </h1>

          <p className="mt-3 text-xl text-neutral-600">
            Empowering brands of all types—from personal to business—to reach
            their goals.
          </p>

          <button className="mt-5 inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-white font-semibold hover:bg-neutral-800 transition">
            Get started
          </button>
        </div>
      </section>
      <AudienceCards />
      <section className="w-full bg-white py-28 px-6 flex justify-center">
        <div className="max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
            Not sure which is for you?
          </h2>

          <p className="mt-6 text-lg text-neutral-700 leading-relaxed">
            Dive into our features guides to see what works best for you
            <br className="hidden sm:block" />
            and your brand.
          </p>

          <div className="mt-10 flex justify-center">
            <button className="rounded-full border-2 border-black px-10 py-4 text-base font-semibold text-black transition hover:bg-black hover:text-white">
              Read the guides
            </button>
          </div>
        </div>
      </section>
      <SuccessStories />
      <WhyPinterest />
      <AboutNavbar />
    </>
  );
};

export default Create;
