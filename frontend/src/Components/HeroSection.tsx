import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="w-full text-center py-20 bg-gradient-to-b from-white to-[#f8f8f8]">
      <h1 className="text-5xl font-bold mb-4">Get your next</h1>
      <h2 className="text-4xl text-amber-600 font-semibold">
        chai time snacks idea
      </h2>

      <div className="flex justify-center gap-4 mt-10 overflow-x-auto px-4">
        {[
          "/assets/snack1.jpg",
          "/assets/snack2.jpg",
          "/assets/snack3.jpg",
          "/assets/snack4.jpg",
          "/assets/snack5.jpg",
        ].map((img, index) => (
          <img
            key={index}
            src={img}
            alt="snack"
            className="w-48 h-64 object-cover rounded-2xl shadow-md"
          />
        ))}
      </div>

      <button className="mt-10 bg-amber-600 text-white py-2 px-6 rounded-full hover:bg-amber-700 transition">
        Here's how it works ↓
      </button>
    </section>
  );
};

export default HeroSection;
