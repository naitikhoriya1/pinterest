import { useMemo, useState } from "react";

type Category =
  | "All"
  | "Ads"
  | "Company"
  | "Creators"
  | "Partnerships"
  | "Product"
  | "Trust and safety"
  | "Trends";

type NewsCard = {
  id: number;
  title: string;
  image: string;
  date: string;
  tags: Category[];
};

const TABS: Category[] = [
  "All",
  "Ads",
  "Company",
  "Creators",
  "Partnerships",
  "Product",
  "Trust and safety",
  "Trends",
];

const NEWS: NewsCard[] = [
  {
    id: 1,
    title:
      "Pinterest’s Festive Season Edit brings precision to festive shopping",
    image: "https://images.unsplash.com/photo-1542831371-d531d36971e6",
    date: "3 November 2025",
    tags: ["Ads", "Creators", "Trends"],
  },
  {
    id: 2,
    title: "Pinterest launches Top of Search ads and new advertising tools",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70",
    date: "25 September 2025",
    tags: ["Ads", "Company", "Product"],
  },
  {
    id: 3,
    title:
      "Introducing AI-powered auto-collages and shopping trend forecasting",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    date: "11 June 2025",
    tags: ["Ads", "Product"],
  },
  {
    id: 4,
    title:
      "Pinterest Academy launches to help advertisers maximise campaign success",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    date: "13 February 2023",
    tags: ["Company", "Ads"],
  },
  {
    id: 5,
    title: "Pinterest rolls out new tools to help advertisers discover trends",
    image: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514",
    date: "17 October 2022",
    tags: ["Product", "Ads", "Trends"],
  },
  {
    id: 6,
    title: "Pinterest unveils slate of new product updates and ad solutions",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a",
    date: "13 September 2023",
    tags: ["Ads", "Product"],
  },
  {
    id: 7,
    title: "Introducing new AI and automation campaign features",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
    date: "1 October 2024",
    tags: ["Ads"],
  },
  {
    id: 8,
    title: "Introducing new AI tools for creative and performance safety",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    date: "13 June 2024",
    tags: ["Ads"],
  },
  {
    id: 9,
    title: "In Pinterest’s latest campaign, the P is for Performance",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    date: "21 February 2024",
    tags: ["Ads", "Company"],
  },
];

export default function NewsWithTabs() {
  const [activeTab, setActiveTab] = useState<Category>("All");
  const [query, setQuery] = useState("");

  const filteredNews = useMemo(() => {
    return NEWS.filter((item) => {
      const matchesTab = activeTab === "All" || item.tags.includes(activeTab);

      const matchesSearch =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

      return matchesTab && matchesSearch;
    });
  }, [activeTab, query]);

  return (
    <section className="bg-white px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition
                ${
                  activeTab === tab
                    ? "bg-neutral-200 text-black"
                    : "text-neutral-600 hover:bg-neutral-100"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search news"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-12 w-full max-w-md rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredNews.map((item) => (
            <article key={item.id} className="group cursor-pointer">
              <div className="rounded-3xl overflow-hidden mb-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="text-xl font-semibold leading-snug mb-4">
                {item.title}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                <span>{item.date}</span>
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filteredNews.length === 0 && (
          <p className="text-neutral-500 mt-16">
            No results found. Refine your search.
          </p>
        )}
      </div>
    </section>
  );
}
