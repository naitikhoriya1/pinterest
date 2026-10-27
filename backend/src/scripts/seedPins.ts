/**
 * Seed script — inserts sample pins into MongoDB for dev/testing.
 *
 * Run with:
 *   npx ts-node-dev src/scripts/seedPins.ts
 * or:
 *   npx ts-node src/scripts/seedPins.ts
 *
 * It will use the MONGO_URI from your .env file.
 * Safe to re-run: checks by title+tag before inserting to avoid duplicates.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import Pin from "../modules/pin/pin.model";
import User from "../modules/auth/auth.model";

// ── Seed data ───────────────────────────────────────────────────────────────
// Using Unsplash source URLs (reliable, no API key needed).
// Each pin has real-ish aspect ratios so the masonry grid looks natural.

const SEED_PINS = [
  // Nature & Outdoors
  {
    title: "Mountain sunrise over alpine lake",
    description: "Golden hour reflections on a crystal-clear alpine lake surrounded by peaks.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    width: 600, height: 800,
    tags: ["nature", "landscape", "mountains", "outdoor"],
  },
  {
    title: "Forest path in autumn",
    description: "A winding dirt path through a golden autumn forest.",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
    width: 600, height: 900,
    tags: ["nature", "outdoor", "landscape"],
  },
  {
    title: "Cascading waterfall",
    description: "Long-exposure waterfall in a lush green jungle.",
    imageUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80",
    width: 600, height: 700,
    tags: ["nature", "landscape", "outdoor"],
  },
  // Food & Cooking
  {
    title: "Avocado toast with poached eggs",
    description: "A classic healthy breakfast on sourdough bread.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    width: 600, height: 500,
    tags: ["food", "cooking", "healthy", "recipe"],
  },
  {
    title: "Homemade pasta from scratch",
    description: "Hand-rolled tagliatelle with rich tomato sauce.",
    imageUrl: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80",
    width: 600, height: 750,
    tags: ["food", "cooking", "recipe"],
  },
  {
    title: "Colourful smoothie bowls",
    description: "Vibrant acai bowl topped with fresh tropical fruit.",
    imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80",
    width: 600, height: 600,
    tags: ["food", "healthy", "cooking"],
  },
  // Fashion & Style
  {
    title: "Minimal streetwear look",
    description: "Clean lines, neutral palette — effortless everyday style.",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    width: 600, height: 900,
    tags: ["fashion", "style", "outfit", "aesthetic"],
  },
  {
    title: "Autumn layering essentials",
    description: "Oversized knit, trench coat and leather boots for the season.",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    width: 600, height: 850,
    tags: ["fashion", "style", "outfit"],
  },
  // Travel & Adventure
  {
    title: "Santorini blue-domed churches",
    description: "Iconic white-and-blue architecture perched above the Aegean.",
    imageUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80",
    width: 600, height: 700,
    tags: ["travel", "adventure", "wanderlust", "city"],
  },
  {
    title: "Kyoto bamboo grove",
    description: "Walking through the towering bamboo forest of Arashiyama.",
    imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80",
    width: 600, height: 900,
    tags: ["travel", "wanderlust", "nature"],
  },
  {
    title: "Desert road trip at sunset",
    description: "Endless highway cutting through red-rock canyons.",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
    width: 600, height: 450,
    tags: ["travel", "adventure", "landscape"],
  },
  // Home & Decor
  {
    title: "Cosy Scandinavian living room",
    description: "Light wood, neutral tones and hygge vibes.",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
    width: 600, height: 700,
    tags: ["interior", "design", "home", "decor", "minimalist"],
  },
  {
    title: "Boho bedroom with macrame",
    description: "Rattan headboard, trailing plants and warm fairy lights.",
    imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80",
    width: 600, height: 800,
    tags: ["interior", "home", "decor"],
  },
  // Art & Illustration
  {
    title: "Watercolour botanical print",
    description: "Delicate hand-painted wildflowers on cold-press paper.",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
    width: 600, height: 750,
    tags: ["art", "illustration", "painting", "creative"],
  },
  {
    title: "Digital character concept art",
    description: "Fantasy warrior illustration in a vibrant neon palette.",
    imageUrl: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&q=80",
    width: 600, height: 900,
    tags: ["art", "illustration", "creative", "drawing"],
  },
  // Fitness & Wellness
  {
    title: "Morning yoga at sunrise",
    description: "Starting the day with a sun salutation on the rooftop.",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
    width: 600, height: 700,
    tags: ["fitness", "yoga", "health", "wellness"],
  },
  {
    title: "Home gym setup inspo",
    description: "Minimal but effective — everything you need in one room.",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    width: 600, height: 600,
    tags: ["fitness", "gym", "workout", "health"],
  },
  // Photography
  {
    title: "Street portrait — golden hour",
    description: "Candid street portrait bathed in warm evening light.",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    width: 600, height: 900,
    tags: ["photography", "portrait", "street"],
  },
  {
    title: "Black-and-white urban geometry",
    description: "Bold lines and dramatic shadows in the city at dawn.",
    imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80",
    width: 600, height: 500,
    tags: ["photography", "black-and-white", "urban", "street"],
  },
  // Architecture
  {
    title: "Modern museum facade",
    description: "Geometric concrete and glass — brutalist meets contemporary.",
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    width: 600, height: 750,
    tags: ["architecture", "buildings", "design", "urban"],
  },
  {
    title: "Spiral staircase from above",
    description: "Hypnotic aerial view of a heritage building's curved stair.",
    imageUrl: "https://images.unsplash.com/photo-1558981852-426c349f7f0d?w=600&q=80",
    width: 600, height: 600,
    tags: ["architecture", "design", "urban"],
  },
  // Tech & Gadgets
  {
    title: "Minimal desk setup 2024",
    description: "Ultrawide monitor, mechanical keyboard — the dream workstation.",
    imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
    width: 600, height: 500,
    tags: ["technology", "gadgets", "workspace", "minimal"],
  },
  // Animals & Pets
  {
    title: "Golden retriever in the park",
    description: "Pure joy — a fluffy golden bounding through autumn leaves.",
    imageUrl: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=600&q=80",
    width: 600, height: 700,
    tags: ["animals", "pets", "cute"],
  },
  // Coffee & Cafes
  {
    title: "Latte art in a cosy cafe",
    description: "A perfectly poured rosetta on creamy single-origin espresso.",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    width: 600, height: 600,
    tags: ["coffee", "cafe", "drinks", "morning"],
  },
  // Plants & Garden
  {
    title: "Indoor plant shelfie",
    description: "A lush green shelf of pothos, monstera and trailing ivy.",
    imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=80",
    width: 600, height: 800,
    tags: ["plants", "garden", "green", "nature", "botany"],
  },
  // DIY & Crafts
  {
    title: "Hand-poured soy candles",
    description: "Simple DIY soy wax candles in vintage glass jars.",
    imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
    width: 600, height: 700,
    tags: ["diy", "crafts", "handmade", "creative"],
  },
  // Music & Culture
  {
    title: "Vinyl record collection",
    description: "Crate-digging classics — soul, jazz and classic rock.",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
    width: 600, height: 600,
    tags: ["music", "culture", "art"],
  },
  // Books & Reading
  {
    title: "Morning reading nook",
    description: "A window-seat, a warm coffee and a good book — perfect Sunday.",
    imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80",
    width: 600, height: 750,
    tags: ["books", "reading", "literature", "cozy"],
  },
];

// ── Runner ───────────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("✅  Connected to MongoDB");

  // Find or create a seed owner user
  let owner = await User.findOne({ email: "seed@pinterest.dev" });
  if (!owner) {
    owner = await User.create({
      username: "seedbot",
      email: "seed@pinterest.dev",
      password: "__seed__",
      interests: {},
    });
    console.log("🌱  Created seed owner user");
  }

  let inserted = 0;
  for (const pin of SEED_PINS) {
    // Idempotent: skip if a pin with the same title already exists
    const exists = await Pin.findOne({ title: pin.title });
    if (exists) {
      console.log(`   ↩  skipped: "${pin.title}"`);
      continue;
    }
    await Pin.create({ ...pin, owner: owner._id, saveCount: Math.floor(Math.random() * 200) });
    console.log(`   ✓  inserted: "${pin.title}"`);
    inserted++;
  }

  console.log(`\n🎉  Done — inserted ${inserted} new pins (${SEED_PINS.length - inserted} skipped)`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
