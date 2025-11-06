import { FaPinterest, FaCheckCircle } from "react-icons/fa";

const AboutHeroSection = () => {
  return (
    <section className="bg-white text-center px-6 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        {/* Tagline */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#111] leading-tight tracking-tight">
          Get inspired{" "}
          <span className="inline-block ml-2 align-middle">
            <img
              src="/sample-collage.jpg"
              alt="Inspiration collage"
              className="inline-block w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
            />
          </span>
          <br />
          Then get started{" "}
          <FaCheckCircle className="inline-block text-green-500 ml-2 mb-1 md:mb-2" />
          <br />
          All on{" "}
          <FaPinterest className="inline-block text-[#e60023] mx-2 mb-1" />
          Pinterest
        </h1>

        {/* Subheading */}
        <div className="mt-12 text-left max-w-3xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            About Pinterest
          </h2>
          <p className="text-lg md:text-xl text-[#111111] leading-relaxed font-medium">
            Pinterest is a visual search and discovery platform where people
            find inspiration, curate ideas, and shop for products — all in one
            place. From DIY projects to travel plans and design inspiration,
            Pinterest helps turn imagination into action.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
