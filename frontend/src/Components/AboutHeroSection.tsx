import { FaPinterest, FaCheckCircle } from "react-icons/fa";

const AboutHeroSection = () => {
  return (
    <section className="bg-white text-center px-6 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        {/* Tagline */}
        <h1 className="text-4xl mb-32 md:text-7xl font-bold text-[#111] leading-[86px] tracking-tight">
          Get inspired{" "}
          <span className="inline-block ml-2 align-middle">
            <img
              src="./About-page/about-hero.jpeg"
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
        <div className="mt-12 text-left max-w-5xl mx-auto">
          <h2 className="text-m font-bold text-gray-900 tracking-wider mb-8">
            About Pinterest
          </h2>
          <p className="text-lg md:text-5xl text-[#111111] leading-relaxed font-bold tracking-wider">
            Pinterest is a visual search and discovery platform where people
            find inspiration, curate ideas and shop for products—all in a
            positive place online. Headquartered in San Francisco, Pinterest
            launched in 2010 and has over half a billion monthly active users
            worldwide.
          </p>
          <button className="mt-12 px-4 py-4 bg-[#000000] text-white rounded-full font-medium"> Visit Pinterest</button>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
