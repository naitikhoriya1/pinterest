import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { api } from "../lib/api";

// ── Topic definitions ────────────────────────────────────────────────────────
const TOPICS = [
  {
    id: "nature",
    label: "Nature & Outdoors",
    tags: ["nature", "landscape", "mountains", "outdoor"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    color: "from-green-400/80 to-emerald-600/80",
  },
  {
    id: "food",
    label: "Food & Cooking",
    tags: ["food", "cooking", "recipe", "healthy"],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    color: "from-orange-400/80 to-red-500/80",
  },
  {
    id: "fashion",
    label: "Fashion & Style",
    tags: ["fashion", "style", "outfit", "aesthetic"],
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80",
    color: "from-pink-400/80 to-rose-600/80",
  },
  {
    id: "travel",
    label: "Travel & Adventure",
    tags: ["travel", "adventure", "wanderlust", "city"],
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80",
    color: "from-sky-400/80 to-blue-600/80",
  },
  {
    id: "interior",
    label: "Home & Decor",
    tags: ["interior", "design", "home", "decor", "minimalist"],
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
    color: "from-amber-300/80 to-yellow-500/80",
  },
  {
    id: "art",
    label: "Art & Illustration",
    tags: ["art", "illustration", "drawing", "creative", "painting"],
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
    color: "from-purple-400/80 to-violet-600/80",
  },
  {
    id: "fitness",
    label: "Fitness & Wellness",
    tags: ["fitness", "workout", "gym", "health", "yoga"],
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
    color: "from-teal-400/80 to-cyan-600/80",
  },
  {
    id: "photography",
    label: "Photography",
    tags: ["photography", "portrait", "black-and-white", "street"],
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    color: "from-gray-500/80 to-slate-700/80",
  },
  {
    id: "architecture",
    label: "Architecture",
    tags: ["architecture", "buildings", "urban", "city", "design"],
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80",
    color: "from-stone-400/80 to-zinc-600/80",
  },
  {
    id: "technology",
    label: "Tech & Gadgets",
    tags: ["technology", "gadgets", "minimal", "workspace"],
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80",
    color: "from-indigo-400/80 to-blue-600/80",
  },
  {
    id: "animals",
    label: "Animals & Pets",
    tags: ["animals", "pets", "wildlife", "cute"],
    image: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400&q=80",
    color: "from-lime-400/80 to-green-600/80",
  },
  {
    id: "coffee",
    label: "Coffee & Cafes",
    tags: ["coffee", "cafe", "drinks", "morning"],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
    color: "from-amber-600/80 to-orange-800/80",
  },
  {
    id: "plants",
    label: "Plants & Garden",
    tags: ["plants", "garden", "green", "nature", "botany"],
    image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&q=80",
    color: "from-green-300/80 to-teal-500/80",
  },
  {
    id: "diy",
    label: "DIY & Crafts",
    tags: ["diy", "crafts", "handmade", "creative"],
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
    color: "from-rose-300/80 to-pink-500/80",
  },
  {
    id: "music",
    label: "Music & Culture",
    tags: ["music", "culture", "art", "concert"],
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    color: "from-fuchsia-400/80 to-purple-600/80",
  },
  {
    id: "books",
    label: "Books & Reading",
    tags: ["books", "reading", "literature", "cozy"],
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80",
    color: "from-yellow-500/80 to-amber-600/80",
  },
];

const REQUIRED = 5;

// ── Component ────────────────────────────────────────────────────────────────
const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < REQUIRED) {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (selected.size < REQUIRED) return;
    setSaving(true);
    setError(null);
    try {
      const allTags = TOPICS.filter((t) => selected.has(t.id)).flatMap((t) => t.tags);
      const uniqueTags = [...new Set(allTags)];
      await api.post("/api/user/interests", { tags: uniqueTags });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  const remaining = REQUIRED - selected.size;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="#e60023" className="w-8 h-8">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
            <span className="font-bold text-lg text-gray-900">Pinterest</span>
          </div>
          <AnimatePresence mode="wait">
            {selected.size > 0 && (
              <motion.div
                key="counter"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <div className="flex gap-1">
                  {Array.from({ length: REQUIRED }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: i < selected.size ? 1 : 0.6 }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i < selected.size ? "bg-[#e60023]" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {selected.size}/{REQUIRED}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero text */}
      <div className="max-w-5xl mx-auto w-full px-6 pt-12 pb-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
        >
          What do you love?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-3 text-lg text-gray-500"
        >
          Pick {REQUIRED} topics to personalise your home feed.
        </motion.p>
        <AnimatePresence>
          {remaining > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-1 text-sm text-gray-400"
            >
              {remaining === REQUIRED
                ? `Choose ${REQUIRED} topics to continue`
                : `${remaining} more to go`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Topic grid */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pb-36">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {TOPICS.map((topic, i) => {
            const isSelected = selected.has(topic.id);
            const isDisabled = !isSelected && selected.size >= REQUIRED;

            return (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => toggle(topic.id)}
                disabled={isDisabled}
                className={`relative h-36 sm:h-44 rounded-2xl overflow-hidden text-left focus:outline-none transition-all duration-200 ${
                  isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                } ${isSelected ? "ring-4 ring-[#e60023] ring-offset-2 scale-[1.02]" : "hover:scale-[1.02] hover:shadow-xl"}`}
              >
                {/* Background image */}
                <img
                  src={topic.image}
                  alt={topic.label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${topic.color}`} />

                {/* Label */}
                <span className="absolute bottom-3 left-3 right-3 text-white font-bold text-sm sm:text-base leading-tight drop-shadow">
                  {topic.label}
                </span>

                {/* Selection checkmark */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-3 right-3 w-7 h-7 bg-[#e60023] rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Check size={14} className="text-white stroke-[3]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </main>

      {/* Sticky footer CTA */}
      <AnimatePresence>
        {selected.size >= REQUIRED && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 z-20 bg-white/90 backdrop-blur-sm border-t border-gray-100 px-6 py-5 flex flex-col items-center gap-2"
          >
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full max-w-sm bg-[#e60023] hover:bg-[#c9001e] disabled:bg-gray-300 text-white font-bold py-4 rounded-full text-base transition-all active:scale-95 shadow-lg shadow-red-200"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75" />
                  </svg>
                  Saving your taste…
                </span>
              ) : (
                "Let's go →"
              )}
            </button>
            <p className="text-xs text-gray-400">You can always update this in your settings</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
