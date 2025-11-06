import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// --- Interfaces ---
interface ImageData {
  id: string;
  src: string;
  alt: string;
}

interface HeroData {
  [key: string]: ImageData[];
}

// --- Data ---
const heroData: HeroData = {
  "chai time snacks": [
    {
      id: "snack1",
      src: "/images/snacks/snack1.jpeg",
      alt: "Chai time snack 1",
    },
    {
      id: "snack2",
      src: "/images/snacks/snack2.jpeg",
      alt: "Chai time snack 2",
    },
    {
      id: "snack3",
      src: "/images/snacks/snack3.jpeg",
      alt: "Chai time snack 3",
    },
    {
      id: "snack4",
      src: "/images/snacks/snack4.jpeg",
      alt: "Chai time snack 4",
    },
    {
      id: "snack5",
      src: "/images/snacks/snack5.jpeg",
      alt: "Chai time snack 5",
    },
  ],
  DIY: [
    { id: "diy1", src: "/images/diy/diy1.jpeg", alt: "DIY project 1" },
    { id: "diy2", src: "/images/diy/diy2.jpeg", alt: "DIY project 2" },
    { id: "diy3", src: "/images/diy/diy3.jpeg", alt: "DIY project 3" },
    { id: "diy4", src: "/images/diy/diy4.jpeg", alt: "DIY project 4" },
    { id: "diy5", src: "/images/diy/diy5.jpeg", alt: "DIY project 5" },
  ],
  "home decor": [
    { id: "decor1", src: "/images/decor/decor1.jpeg", alt: "Home decor 1" },
    { id: "decor2", src: "/images/decor/decor2.jpeg", alt: "Home decor 2" },
    { id: "decor3", src: "/images/decor/decor3.jpeg", alt: "Home decor 3" },
    { id: "decor4", src: "/images/decor/decor4.jpeg", alt: "Home decor 4" },
    { id: "decor5", src: "/images/decor/decor5.jpeg", alt: "Home decor 5" },
  ],
  Travel: [
    { id: "travel1", src: "/images/travel/travel1.jpeg", alt: "Recipe 1" },
    { id: "travel2", src: "/images/travel/travel2.jpeg", alt: "Recipe 2" },
    { id: "travel3", src: "/images/travel/travel3.jpeg", alt: "Recipe 3" },
    { id: "travel4", src: "/images/travel/travel4.jpeg", alt: "Recipe 4" },
    { id: "travel5", src: "/images/travel/travel5.jpeg", alt: "Recipe 5" },
  ],
};

const topics = Object.keys(heroData);

// --- Child Component: HeroImage ---
const HeroImage: React.FC<{
  image: ImageData;
  index: number;
  total: number;
}> = ({ image, index, total }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  interface SizeClassConfig {
    index: number;
    total: number;
  }

  const getSizeClasses = ({ index, total }: SizeClassConfig): number => {
    const middleIndex = Math.floor(total / 2);

    if (index === 0 || index === total - 1) return 1.75;
    if (index === 1 || index === total - 2) return 1.5;
    if (index === middleIndex) return 1;
    return 1.25;
  };

  // Calculate vertical offset for curve effect
  const getOffsetClass = () => {
    const middleIndex = Math.floor(total / 2);
    const offset = Math.abs(index - middleIndex);
    const translateY = offset * 20; // 20px offset per position from center
    return `transform -translate-y-[${translateY}px]`;
  };

  return (
    <div
      className={`relative ${getSizeClasses({
        index,
        total,
      })} ${getOffsetClass()} transition-all duration-300 ease-in-out`}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
      )}
      <img
        src={hasError ? "/images/placeholder.jpg" : image.src}
        alt={image.alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover rounded-2xl shadow-md hover:scale-110 transition-all duration-700 ease-out hover:shadow-xl ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};

// --- Main Component: HeroSection ---
const HeroSection: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [currentTopic, setCurrentTopic] = useState(topics[0]);

  const textRef = useRef<HTMLHeadingElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  // Cycle through topics
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % topics.length);
    }, 6000); // Increased from 4000 to 6000ms for more comfortable viewing
    return () => clearInterval(interval);
  }, []);

  // Update topic when index changes
  useEffect(() => {
    setCurrentTopic(topics[index]);
  }, [index]);

  // Animate transitions using GSAP
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "circ.out(1, 0.8)", // Bouncy elastic effect
          delay: 0.2, // Slight delay before text appears
        }
      );
    }

    if (imageContainerRef.current) {
      // Note: We target the wrapper div, not the img directly,
      // because the HeroImage component renders the img.
      // GSAP will animate the `div.relative` elements.
      const imageWrappers =
        imageContainerRef.current.querySelectorAll(".relative");

      // Clear any existing animations first
      gsap.set(imageWrappers, { clearProps: "all" });

      gsap.fromTo(
        imageWrappers,
        {
          y: 60,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "circ.out(1.4)", // Smooth overshoot effect
          stagger: {
            amount: 1, // Total stagger time for all images
            from: "center", // Animate from center outwards
            ease: "power2.inOut", // Smooth stagger timing
          },
        }
      );
    }
  }, [currentTopic]);

  return (
    <section className="w-full text-center py-7 bg-gradient-to-b from-white to-[#f8f8f8] overflow-hidden relative">
      <h1 className="text-5xl md:text-6xl font-bold mb-2 text-gray-900">
        Get your next
      </h1>

      <h2
        ref={textRef}
        className="text-4xl md:text-5xl text-green-700 font-semibold capitalize"
      >
        {currentTopic} idea
      </h2>

      <div
        ref={imageContainerRef}
        className="flex justify-center items-center gap-4 mt-10 overflow-x-auto px-4 scrollbar-hide min-h-[400px]"
      >
        {heroData[currentTopic].map((img, idx, arr) => (
          <HeroImage key={img.id} image={img} index={idx} total={arr.length} />
        ))}
      </div>

      <button className="mt-10 bg-green-700 text-white py-2 px-6 rounded-full hover:bg-green-800 transition duration-300">
        Here's how it works ↓
      </button>

      <div className="flex justify-center mt-6 space-x-2">
        {topics.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-green-700" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
