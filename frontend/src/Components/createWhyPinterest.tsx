import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type WhyKey = "reach" | "actionable" | "creation" | "longevity" | "positivity";

const WHY_DATA: Record<
  WhyKey,
  {
    title: string;
    desc: string;
    images: string[];
  }
> = {
  reach: {
    title: "Reach people when they’re planning",
    desc: "Amplify your content to over half a billion people who use Pinterest every month to explore their passions.¹ You’ll find Millennials, sure, and Gen Z finding their next aesthetic, too—in fact, they’re our fastest growing, most engaged audience.",
    images: [
      "https://images.ctfassets.net/jis2uwrnn1pu/6odynkolInxvjE6zS4gRFr/6c3497197df9218f1eedb5f1f0863d63/why-pinterest-reach-en-gb.jpg?fm=webp&q=85",
    ],
  },
  actionable: {
    title: "…and they’re ready to act",
    desc: "See. Save. Shop. People on Pinterest want to try out the inspiring ideas they see and take action IRL. More than half of them say that it’s a place to shop.² So you can reach a primed audience with actionable content. Features such as product tagging and linking help to enhance the experience as people browse products, save ideas and discover new things—your things—to love.",
    images: [
      "https://images.ctfassets.net/jis2uwrnn1pu/6ygSfM6DoPfMc74zqs9PL3/2c1fdcd776d77e87ee8ad9cc8fa24e4e/why-pinterest-actionable-en-gb.jpg?fm=webp&q=85",
    ],
  },
  creation: {
    title: "Content creation made simple",
    desc: "Create and scale your content with tools that plug right into your process. Create content on your go-to channel or platform, and you can then cross-post, connect and share directly on Pinterest. With Instagram account claiming, RSS feeds and more integrated solutions, creating on Pinterest is simple, fast and seamless.",
    images: [
      "https://images.ctfassets.net/jis2uwrnn1pu/1nPIuIY46wazW2c9FdKlZ3/9b74d03f1e4b2de76a51c7b06686c650/why-pinterest-easy-creation-en-gb.jpg?fm=webp&q=85",
    ],
  },
  longevity: {
    title: "Your content is long lasting",
    desc: "Pinterest is a content discovery and visual search engine, so your content doesn’t disappear or expire. It appears whenever people search and browse long after you initially post it. This means that your content works harder for you here.",
    images: [
      "https://images.ctfassets.net/jis2uwrnn1pu/3HJ3lCBxjpnztyI7ycwPEV/5a3ac9504a77f5ed75b70f6d4fdba6a4/why-pinterest-longevity-en-gb.jpg?fm=webp&q=85",
    ],
  },
  positivity: {
    title: "You’re in a more positive place",
    desc: "Pinterest is the positive corner of the internet for good reason. Initiatives that prioritise well-being, such as the Inspired Internet Pledge, and inclusive product features that represent our diverse communities help to ensure that people on Pinterest feel safe, supported and free to be creative and express themselves without judgment.",
    images: [
      "https://images.ctfassets.net/jis2uwrnn1pu/16SUMZRTJZzrrdi2iUdcCP/e951143fcc9b14177bca33c5a441ba91/why-pinterest-positivity-en-gb.jpg?fm=webp&q=85",
    ],
  },
};

const contentAnim = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

export default function WhyPinterest() {
  const [active, setActive] = useState<WhyKey>("longevity");
  const data = WHY_DATA[active];

  return (
    <>
      <section className="w-full bg-white py-32 px-6">
        <div className="mx-auto max-w-7xl">
          {/* TITLE */}
          <h2 className="text-center text-5xl md:text-6xl font-bold mb-16">
            Why Pinterest
          </h2>

          {/* TABS */}
          <div className="flex justify-center mb-20">
            <div className="relative flex bg-white rounded-lg p-3 shadow-2xl">
              {(Object.keys(WHY_DATA) as WhyKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className="relative px-6 py-2 text-lg font-semibold z-10"
                >
                  {active === tab && (
                    <motion.span
                      layoutId="pill"
                      className="absolute inset-0 bg-black rounded-2xl"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={`relative ${
                      active === tab ? "text-white" : "text-neutral-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 items-center">
            {/* LEFT – VISUALS */}

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                variants={contentAnim}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full max-w-[560px]"
              >
                <div className="relative">
                  <img
                    src={data.images[0]}
                    alt=""
                    className="w-full h-[350px] rounded-[32px] object-cover shadow-2xl"
                  />

                  {/* OPTIONAL OVERLAY CARD (Pinterest feel) */}
                  <div className="absolute -right-8 -bottom-10 w-[220px] h-[280px] rounded-[28px] overflow-hidden shadow-xl bg-white p-2">
                    <img
                      src={data.images[0]}
                      alt=""
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* RIGHT – COPY */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                variants={contentAnim}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h3 className="text-4xl font-bold mb-6 leading-tight">
                  {data.title}
                </h3>
                <p className="text-lg text-neutral-700 max-w-xl">{data.desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
      <section className="w-full bg-white py-32 px-6">
      <div className="mx-auto max-w-4xl text-center">
        {/* HEADING */}
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-neutral-900 mb-8">
          Start creating on Pinterest
        </h2>

        {/* SUBTEXT */}
        <p className="text-xl md:text-2xl text-neutral-700 max-w-2xl mx-auto mb-14 leading-relaxed">
          Anyone can create and grow on Pinterest. Whether you’re flying solo
          or part of a brand team. And it’s free.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex justify-center gap-6">
          <button className="px-8 py-4 rounded-full bg-black text-white text-base font-semibold hover:opacity-90 transition">
            Get started
          </button>

          <button className="px-8 py-4 rounded-full border-2 border-black text-black text-base font-semibold hover:bg-black hover:text-white transition">
            Create now
          </button>
        </div>
      </div>
    </section>
    </>
  );
}
