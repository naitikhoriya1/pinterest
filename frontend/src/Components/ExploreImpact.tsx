import React, { useState } from "react";

// --- Define interface for tab data ---
interface TabContent {
  heading: string;
  highlight: string;
  text: string;
  button: string;
  image: string;
  color: string; // Added color for the highlight
}

// --- Define all tab data in a typed object ---
const tabData: Record<string, TabContent> = {
  Impact: {
    heading: "A more inspired internet. A better world.",
    highlight: "It's Possible.",
    text: "We're building a more positive place online. A place that inspires the people that we serve and protects the data that we share.",
    button: "Explore impact",
    image:
      "https://images.ctfassets.net/2pyx8rwuvz6x/1ohlpOTPdhPXwPMDdagY1B/3dfaa7de51ec3d5379dee6e5601ab490/PIN_Company_Impact-01__1_.png?fm=webp&q=85",
    color: "text-emerald-600",
  },
  People: {
    heading: "Prioritising our people",
    highlight: "Together we rise.",
    text: "We believe that inspiration starts with inclusion. We’re committed to creating a diverse and equitable workplace that champions the well-being of our employees and communities.",
    button: "Meet our people",
    image:
      "https://images.ctfassets.net/2pyx8rwuvz6x/51dXz15Qlg1O9KCYnnewL4/659cd5a66606a0112fb680233a564c93/PIN_Company_Impact-02.png?fm=webp&q=85",
    color: "text-blue-600",
  },
  Product: {
    heading: "Designing inspiration into every product.",
    highlight: "Innovation that matters.",
    text: "We craft intuitive, human-centered digital experiences that make discovery joyful and meaningful for everyone.",
    button: "Explore product design",
    image:
      "https://images.ctfassets.net/2pyx8rwuvz6x/g7GiqgsYDZEPLCKeBjCYT/799fe6fef5e69e611ee066f96d1a0d2e/PIN_Company_Impact-03.png?fm=webp&q=85",
    color: "text-red-600",
  },
  Planet: {
    heading: "Sustainability is our shared responsibility.",
    highlight: "For a greener tomorrow.",
    text: "The global climate crisis poses a clear risk to both our environment and our well-being. We’re taking credible action to reduce emissions, preserve our natural resources and expand our positive impact on the planet.",
    button: "Discover initiatives",
    image:
      "https://images.ctfassets.net/2pyx8rwuvz6x/4ENm89n3nR93ep5W06tMod/0b3ffe78ad51cbd1a8fdf516cdd6d307/PIN_Company_Impact-04.png?fm=webp&q=85",
    color: "text-green-600",
  },
};

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<keyof typeof tabData>("Impact");
  // NEW: State to manage the fade animation
  const [isFadingOut, setIsFadingOut] = useState(false);

  const data = tabData[activeTab];
  const transitionDuration = 300; // Match this with Tailwind's duration-300

  // NEW: Click handler to manage the animation flow
  const handleTabClick = (tab: keyof typeof tabData) => {
    if (tab === activeTab) return; // Do nothing if the same tab is clicked

    setIsFadingOut(true); // Start fade-out

    // Wait for the fade-out to finish
    setTimeout(() => {
      setActiveTab(tab); // Change the content
      setIsFadingOut(false); // Start fade-in
    }, transitionDuration);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Tab Section */}
      <div className="bg-white">
        <div className="container mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 text-left">
              {/* Tabs */}
              <div className="flex items-center justify-center space-x-8 mb-6 border-b border-gray-200">
                {(Object.keys(tabData) as (keyof typeof tabData)[]).map(
                  (tab) => (
                    <button
                      key={tab}
                      // Use the new click handler
                      onClick={() => handleTabClick(tab)}
                      className={`font-semibold pb-2 transition-all duration-300 ${
                        activeTab === tab
                          ? "text-gray-900 border-b-2 border-gray-900"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>

              {/* Animated Text Content Wrapper */}
              <div
                // NEW: Apply transition classes
                className={`transition-opacity duration-300 ${
                  isFadingOut ? "opacity-0" : "opacity-100"
                }`}
              >
                {/* Heading */}
                <h1 className="text-5xl font-bold text-center text-gray-900 leading-snug mt-4 px-6 pb-4 h-36">
                  {data.heading}{" "}
                  <span className={data.color}>{data.highlight}</span>
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-700 mt-12 text-center max-w-xl mx-auto h-24">
                  {data.text}
                </p>

                {/* Button */}
                <div className="flex justify-center items-center">
                  <button className="bg-gray-900 text-white font-semibold py-4 px-6 rounded-full mt-10 hover:bg-gray-700 transition-colors duration-300">
                    {data.button}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2 flex items-center justify-center p-4">
              <img
                src={data.image}
                alt={activeTab}
                // NEW: Apply transition classes to the image as well
                className={`rounded-2xl shadow-xl object-cover w-full max-w-md lg:max-w-lg 
                            transition-opacity duration-300 ${
                              isFadingOut ? "opacity-0" : "opacity-100"
                            }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
