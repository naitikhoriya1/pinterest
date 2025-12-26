import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TabKey = "creator" | "publisher" | "merchant";

const fadeSlide = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

const STORIES: Record<
  TabKey,
  {
    title: string;
    bg: string;
    grid: [string, string];
    avatar: string;
  }
> = {
  creator: {
    title: "Lovely Delites’ strategy for dishing out delicious content",
    bg: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52",
    grid: [
      "https://images.unsplash.com/photo-1542826438-bd32f43d626f",
      "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3",
    ],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  },
  publisher: {
    title:
      "Art Room draws on a translation-powered strategy for global audience growth",
    bg: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70",
    grid: [
      "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    ],
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  },
  merchant: {
    title:
      "Brazilian kitchenware brand increases revenue by bringing their catalogue to Pinterest",
    bg: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
    grid: [
      "https://images.unsplash.com/photo-1514511547113-b0dc7b8e2f37",
      "https://images.unsplash.com/photo-1498579809087-ef1e558fd1da",
    ],
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
  },
};

export default function SuccessStories() {
  const [active, setActive] = useState<TabKey>("creator");
  const story = STORIES[active];

  return (
    <section className="w-full bg-white py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-4xl md:text-5xl font-bold text-neutral-900 mb-20">
          Success stories
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ">
          {/* LEFT – IMAGE COMPOSITION */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                variants={fadeSlide}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative"
              >
                <div className="overflow-hidden">
                  <img
                    src={story.bg}
                    className="w-full h-[360px] object-cover"
                  />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-4 w-[260px]">
                    <div className="grid grid-cols-2 gap-2">
                      {story.grid.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          className="h-32 w-full rounded-xl object-cover"
                        />
                      ))}
                    </div>

                    <div className="flex justify-center mt-4">
                      <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <img
                          src={story.avatar}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT – CONTENT */}
          <div>
            <div className="flex gap-8  mb-8 text-lg font-semibold">
              {(Object.keys(STORIES) as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className={`pb-1 transition
                    ${
                      active === tab
                        ? "border-b-2 border-black text-black"
                        : "text-neutral-500 hover:text-neutral-800"
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <h3 className="text-3xl pr-32 md:text-5xl text-neutral-900 leading-tight mb-6">
              {story.title}
            </h3>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-base font-semibold text-neutral-900 border-b border-neutral-900 hover:opacity-70 transition"
            >
              Read the story →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
