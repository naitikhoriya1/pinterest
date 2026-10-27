/**
 * Seed script — creates 100+ sample pins across diverse categories.
 * Run with:  npx ts-node src/scripts/seed.ts
 *
 * Uses Unsplash source URLs which include real image dimensions in the URL.
 * Each photo URL encodes width × height so we know the exact aspect ratio.
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../modules/auth/auth.model";
import Pin from "../modules/pin/pin.model";
import Board from "../modules/board/board.model";

// ── Helper ──────────────────────────────────────────────────────────────────
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ── Seed data ───────────────────────────────────────────────────────────────
const CATEGORIES: {
  tags: string[];
  photos: { url: string; w: number; h: number }[];
}[] = [
  {
    tags: ["nature", "landscape", "mountains", "outdoor"],
    photos: [
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", w: 800, h: 533 },
      { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", w: 800, h: 533 },
      { url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80", w: 800, h: 534 },
    ],
  },
  {
    tags: ["food", "cooking", "recipe", "healthy"],
    photos: [
      { url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", w: 800, h: 800 },
      { url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80", w: 800, h: 533 },
      { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80", w: 800, h: 533 },
    ],
  },
  {
    tags: ["fashion", "style", "outfit", "aesthetic"],
    photos: [
      { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80", w: 800, h: 1067 },
    ],
  },
  {
    tags: ["travel", "adventure", "wanderlust", "city"],
    photos: [
      { url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80", w: 800, h: 533 },
      { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80", w: 800, h: 533 },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80", w: 800, h: 533 },
    ],
  },
  {
    tags: ["interior", "design", "home", "decor", "minimalist"],
    photos: [
      { url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", w: 800, h: 533 },
      { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1549497538-303791108f95?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80", w: 800, h: 533 },
      { url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80", w: 800, h: 1067 },
    ],
  },
  {
    tags: ["art", "illustration", "drawing", "creative", "painting"],
    photos: [
      { url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1519810755548-39cd217da494?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1510832842230-87253f48d74b?w=800&q=80", w: 800, h: 533 },
      { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80", w: 800, h: 600 },
    ],
  },
  {
    tags: ["fitness", "workout", "gym", "health", "yoga"],
    photos: [
      { url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", w: 800, h: 533 },
      { url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80", w: 800, h: 533 },
      { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80", w: 800, h: 533 },
    ],
  },
  {
    tags: ["photography", "portrait", "black-and-white", "street"],
    photos: [
      { url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&q=80", w: 800, h: 533 },
      { url: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80", w: 800, h: 1067 },
    ],
  },
  {
    tags: ["architecture", "buildings", "urban", "city", "design"],
    photos: [
      { url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&q=80", w: 800, h: 533 },
      { url: "https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&q=80", w: 800, h: 600 },
    ],
  },
  {
    tags: ["technology", "gadgets", "minimal", "workspace"],
    photos: [
      { url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80", w: 800, h: 600 },
    ],
  },
  {
    tags: ["animals", "pets", "wildlife", "cute"],
    photos: [
      { url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=800&q=80", w: 800, h: 534 },
    ],
  },
  {
    tags: ["coffee", "cafe", "drinks", "morning"],
    photos: [
      { url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80", w: 800, h: 1067 },
    ],
  },
  {
    tags: ["plants", "garden", "green", "nature", "botany"],
    photos: [
      { url: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80", w: 800, h: 1067 },
      { url: "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=800&q=80", w: 800, h: 534 },
      { url: "https://images.unsplash.com/photo-1574173116625-46a06ab1b0bf?w=800&q=80", w: 800, h: 600 },
      { url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80", w: 800, h: 534 },
    ],
  },
];

const TITLES: Record<string, string[]> = {
  nature: ["Mountain Sunrise", "Alpine Lake View", "Golden Forest Path", "Morning Mist", "Rocky Summit"],
  food: ["Avocado Toast Delight", "Fresh Salad Bowl", "Homemade Pasta", "Colorful Smoothie Bowl", "Brunch Goals"],
  fashion: ["Minimal Chic Look", "Autumn Outfit Inspo", "Streetwear Vibes", "Boho Summer Style", "Classic Monochrome"],
  travel: ["Hidden Gem Destination", "Sunrise Over the City", "Weekend Getaway", "Explore More", "Off the Beaten Path"],
  interior: ["Cozy Living Room", "Minimal Workspace", "Scandinavian Bedroom", "Boho Shelf Styling", "Neutral Color Palette"],
  art: ["Abstract Watercolor", "Ink Portrait Study", "Digital Art Piece", "Gouache Landscape", "Sketchbook Pages"],
  fitness: ["Morning Workout Routine", "Yoga at Sunrise", "Home Gym Setup", "HIIT Training", "Stretch & Flow"],
  photography: ["Golden Hour Portrait", "Urban Street Shot", "B&W Mood", "Natural Light Study", "Candid Moment"],
  architecture: ["Glass & Steel", "Historic Facade", "Modern Villa", "Brutalist Beauty", "Night Skyline"],
  technology: ["Minimal Desk Setup", "New Gadget Drop", "Dark Mode Aesthetic", "Developer Workspace", "Flat Lay Tech"],
  animals: ["Puppy Eyes", "Wild & Free", "Morning Walk Buddy", "Fluffy Friends", "Safari Shot"],
  coffee: ["Latte Art Morning", "Third Wave Coffee", "Pour Over Ritual", "Cafe Corner", "Espresso Time"],
  plants: ["Urban Jungle Vibes", "Monstera Love", "Propagation Station", "Terracotta & Green", "Succulent Collection"],
};

const DESCRIPTIONS: string[] = [
  "Saved because this made my morning better ✨",
  "Obsessed with this aesthetic right now.",
  "Goals 🙌 Adding this to my vision board.",
  "The color palette here is everything.",
  "Can't stop thinking about this look.",
  "Woke up and chose beauty today.",
  "This is the inspo I needed.",
  "Simple but stunning, love it.",
  "The lighting in this shot is perfect.",
  "Bringing this energy into my life ASAP.",
  "Mood for the entire season.",
  "Everything about this is *chef's kiss*.",
];

// ── Main ────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("✅ Connected to MongoDB");

  // Clear existing pins and boards
  await Pin.deleteMany({});
  await Board.deleteMany({});
  console.log("🗑️  Cleared existing pins and boards");

  // Ensure a seed user exists
  let seedUser = await User.findOne({ email: "seed@pinterest.local" });
  if (!seedUser) {
    seedUser = await User.create({
      username: "PinBot",
      email: "seed@pinterest.local",
      password: "__seed__",
    });
    console.log("👤 Created seed user");
  }

  const pins: mongoose.Document[] = [];
  let count = 0;

  for (const category of CATEGORIES) {
    const primaryTag = category.tags[0];
    const titleList = TITLES[primaryTag] ?? ["Beautiful Pin"];

    for (const photo of category.photos) {
      // Pick 2–4 tags from this category
      const numTags = 2 + Math.floor(Math.random() * 3);
      const shuffled = [...category.tags].sort(() => 0.5 - Math.random());
      const tags = shuffled.slice(0, numTags);

      const title = pick(titleList);
      const description = pick(DESCRIPTIONS);

      const pin = await Pin.create({
        owner: seedUser._id,
        title,
        description,
        imageUrl: photo.url,
        width: photo.w,
        height: photo.h,
        tags,
        saveCount: Math.floor(Math.random() * 500),
      });

      pins.push(pin);
      count++;
    }
  }

  // Create a few boards
  const boardNames = ["Design Inspo", "Travel Bucket List", "Food & Recipes", "My Aesthetic"];
  for (const name of boardNames) {
    const boardPins = pins
      .sort(() => 0.5 - Math.random())
      .slice(0, 12)
      .map((p: any) => p._id);

    await Board.create({
      name,
      owner: seedUser._id,
      isPrivate: false,
      pins: boardPins,
      coverImage: (boardPins[0] as any)?.imageUrl,
    });
  }

  console.log(`✅ Seeded ${count} pins and ${boardNames.length} boards`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
