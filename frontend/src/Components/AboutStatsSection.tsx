const AboutStatsSection = () => {
  const stats = [
    {
      value: "578 million",
      label: "Monthly active users¹",
    },
    {
      value: "1.5 billion",
      label: "Pins saved every week²",
    },
    {
      value: "More than 50%",
      label: "of users think of Pinterest as a place to shop³",
    },
  ];

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-2xl py-10 px-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-gray-700 mb-2">
              {stat.value}
            </h3>
            <p className="text-gray-700 text-base md:text-xl font-normal leading-relaxed">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutStatsSection;
