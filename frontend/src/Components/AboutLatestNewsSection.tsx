const AboutLatestNewsSection = () => {
  const news = [
    {
      id: 1,
      title:
        "Pinterest’s Festive Season Edit brings precision to festive shopping",
      date: "3 November 2025",
      tags: ["Ads", "Creators", "Trends"],
      image:
        "https://images.ctfassets.net/2pyx8rwuvz6x/01RN4hVKlvlChUdkD3nlZl/9ea686f88d5721e16f51b26c3019af72/Holiday-Hero-Image-02__5_.jpg?fm=webp&q=85", // replace with your actual image
    },
    {
      id: 2,
      title:
        "Pinterest rolls out new tools to give users more control over GenAI content",
      date: "16 October 2025",
      tags: ["Product", "Company"],
      image:
        "https://images.ctfassets.net/2pyx8rwuvz6x/4lRFE0KoQfkkMcCiviIHiQ/c579d481526b4d45026ce6afb7ac31d8/FilteringPins-NewsroomHeader.jpg?fm=webp&q=85",
    },
    {
      id: 3,
      title:
        "Pinterest launches Top of Search ads and new advertising tools to drive visual shopping decisions",
      date: "25 September 2025",
      tags: ["Ads", "Company", "Product"],
      image:
        "https://images.ctfassets.net/2pyx8rwuvz6x/7gha1SzKZT4zlNYqjJQcYn/85c4e379a34ec7a6edde530c90bfa7cd/Hero_Video_Thumb__1_.jpg?fm=webp&q=85",
    },
  ];

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h2 className="text-2xl md:text-base font-semibold text-gray-900">
          Latest news
        </h2>
        <button className="text-sm md:text-base font-semibold bg-gray-100 hover:bg-gray-200 transition-all px-4 py-2 rounded-full">
          See all news
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => (
          <div key={item.id} className="group">
            <div className="overflow-hidden rounded-xl mb-5">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-56 object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-3 leading-snug group-hover:text-red-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{item.date}</p>
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm bg-gray-100 text-gray-400 px-2 py-1 rounded-full font-light"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutLatestNewsSection;
