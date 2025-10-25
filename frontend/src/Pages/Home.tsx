import React from "react";
import HeroSection from "../Components/HeroSection";
import FeaturesSection from "../Components/FeaturesSection";
import SignupSection from "../Components/SignupSection";
import Footer from "../Components/Footer";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-gray-900">
      <HeroSection />
      <FeaturesSection />
      <SignupSection />
      <Footer />
    </div>
  );
};

export default Home;
