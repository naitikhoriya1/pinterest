import React from "react";

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#fafafa] text-center">
      <h2 className="text-4xl font-semibold mb-4">
        Bring your favourite ideas to life
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
        With Pinterest, you can unlock tools that spark your creativity and help
        you find more inspiration.
      </p>

      <div className="grid md:grid-cols-2 gap-12 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center">
          <img
            src="/assets/skin-tone-search.jpg"
            alt="skin tone search"
            className="rounded-xl mb-4 w-80 h-64 object-cover"
          />
          <h3 className="text-2xl font-semibold mb-2">Search by skin tone</h3>
          <p className="text-gray-600 mb-4">
            Search with skin tone ranges for beauty ideas that represent you.
          </p>
          <button className="bg-red-600 text-white px-5 py-2 rounded-full">
            Join Pinterest
          </button>
        </div>

        <div className="flex flex-col items-center">
          <img
            src="/assets/image-search.jpg"
            alt="image search"
            className="rounded-xl mb-4 w-80 h-64 object-cover"
          />
          <h3 className="text-2xl font-semibold mb-2">
            Search visually with images
          </h3>
          <p className="text-gray-600 mb-4">
            Search for objects within an image to find more styles you’ll love.
          </p>
          <button className="bg-red-600 text-white px-5 py-2 rounded-full">
            Join Pinterest
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
