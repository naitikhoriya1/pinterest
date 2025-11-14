import React from "react";

// // A simple + icon. You can replace this with an SVG icon component.
// const PlusIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className="w-6 h-6"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M12 4.5v15m7.5-7.5h-15"
//     />
//   </svg>
// );

const AboutContactSection: React.FC = () => {
  return (
    <div className="bg-white py-24 my-24 ">
      <div className="container mx-auto px-6">
        {/* Top Section: Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12">
          {/* Column 1: Get in touch */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get in touch
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-md">
              Contact our press team. Only press-related enquiries and speaker
              requests will receive a response.
            </p>
            <a
              href="mailto:press@pinterest.com"
              className="inline-block bg-gray-900 text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-700 transition-colors duration-300"
            >
              press@pinterest.com
            </a>
          </div>

          {/* Column 2: Stay connected */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Stay connected
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-md">
              Subscribe to our RSS feed to stay up to date on the latest news
              from Pinterest.
            </p>
            <a
              href="#" // Replace with your RSS feed URL
              className="inline-block bg-gray-900 text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-700 transition-colors duration-300"
            >
              Subscribe via RSS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContactSection;
