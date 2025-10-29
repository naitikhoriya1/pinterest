import React from "react";

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#f8f7f4]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-semibold text-[#111] mb-4">
            Bring your favourite ideas to life
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            With Pinterest, you can unlock tools that spark your creativity and
            help you find more inspiration.
          </p>
        </div>

        {/* --- Section 1: Image Left, Text Right --- */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          {/* Image Left */}
          <div className="flex justify-center md:justify-end">
            <div className="bg-[#f1f0ec] p-6 rounded-3xl shadow-sm">
              <img
                src="../images/features/skin-tone.png"
                alt="Search by skin tone"
                className="rounded-2xl w-full max-w-sm object-cover"
              />
            </div>
          </div>

          {/* Text Right */}
          <div className="text-left">
            <h3 className="text-3xl font-semibold text-[#111] mb-3">
              Search by skin tone
            </h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md">
              Search with skin tone ranges for beauty ideas that represent you.
            </p>
            <button className="bg-red-600 hover:bg-red-700 transition-colors text-white font-medium px-6 py-3 rounded-full">
              Join Pinterest
            </button>
          </div>
        </div>

        {/* --- Section 2: Image Right, Text Left --- */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text Left */}
          <div className="text-left order-2 md:order-1">
            <h3 className="text-3xl font-semibold text-[#111] mb-3">
              Search visually with images
            </h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md">
              Search for objects within an image to find more styles you’ll
              love.
            </p>
            <button className="bg-red-600 hover:bg-red-700 transition-colors text-white font-medium px-6 py-3 rounded-full">
              Join Pinterest
            </button>
          </div>

          {/* Image Right */}
          <div className="flex justify-center md:justify-start order-1 md:order-2">
            <div className="bg-[#f1f0ec] p-6 rounded-3xl shadow-sm">
              <img
                src="../images/features/search.png"
                alt="Visual image search"
                className="rounded-2xl w-full max-w-sm object-cover"
              />
            </div>
          </div>
        </div>
        {/* --- Section 3: Image Left, Text Right --- */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          {/* Image Left */}
          <div className="flex justify-center md:justify-end">
            <div className="bg-[#f1f0ec] p-6 rounded-3xl shadow-sm">
              <img
                src="../images/features/group.png"
                alt="Search by skin tone"
                className="rounded-2xl w-full max-w-sm object-cover"
              />
            </div>
          </div>

          {/* Text Right */}
          <div className="text-left">
            <h3 className="text-3xl font-semibold text-[#111] mb-3">
              Collaborate with group boards{" "}
            </h3>
            <p className="text-gray-600 text-lg mb-6 max-w-md">
              Visualise your ideas with others using a Pinterest account
            </p>
            <button className="bg-red-600 hover:bg-red-700 transition-colors text-white font-medium px-6 py-3 rounded-full">
              Join Pinterest
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
