type Card = {
  id: number;
  title: string;
  cta: string;
  image: string;
  bg: string;
};

const cards: Card[] = [
  {
    id: 1,
    title: "The secret to creating standout Pinterest boards",
    cta: "Read blog →",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
    bg: "bg-[#FFF1A8]",
  },
  {
    id: 2,
    title: "Pinterest Analytics explained: tools, metrics, insights",
    cta: "Learn more →",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    bg: "bg-[#C7D99A]",
  },
  {
    id: 3,
    title: "How to create content to reach a Gen Z audience",
    cta: "Discover now →",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    bg: "bg-[#F4F4F4]",
  },
];

export default function PinterestCreateCards() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {cards.map((card) => (
          <div key={card.id} className="group cursor-pointer">
            {/* Image wrapper */}
            <div
              className={`rounded-2xl ${card.bg} p-6 flex items-center justify-center aspect-[4/3]`}
            >
              <img
                src={card.image}
                alt=""
                className="rounded-xl object-cover w-full h-full"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <h3 className="mt-6 text-xl font-semibold text-gray-900 leading-snug">
              {card.title}
            </h3>

            <p className="mt-2 text-base font-medium text-gray-700 group-hover:underline">
              {card.cta}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
