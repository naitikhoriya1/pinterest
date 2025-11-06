import AboutHeroSection from "../Components/AboutHeroSection";
import AboutStatsSection from "../Components/AboutStatsSection";
import AboutLatestNewsSection from "../Components/AboutLatestNewsSection";
import ExploreImpact from "../Components/ExploreImpact";
import AboutMarque from "../Components/AboutMarque";
import AboutContactSection from "../Components/AboutContactSection";
import AboutNavbar from "../Components/AboutNavbar";

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      <AboutHeroSection />
      <AboutStatsSection />
      <AboutLatestNewsSection />
      <ExploreImpact />
      <AboutMarque />
      <AboutContactSection />
      <AboutNavbar />
    </div>
  );
};

export default About;
