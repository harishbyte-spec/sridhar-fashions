import React, { useState, useEffect } from 'react'
import Hero from '../components/HomePage/Hero'
import CategorySection from '../components/HomePage/CategorySection'
import FeaturedProducts from "../components/HomePage/FeaturedProducts";
import OccasionsSection from '../components/HomePage/Occasions';
import PromoSection from '../components/HomePage/PromoSection';
import Testimonials from '../components/HomePage/Testimonials';
import LocationSection from '../components/HomePage/Location';
import Intro from '../components/IntroAnimation/Intro';

const Home = () => {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("introShown");
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("introShown", "true");
  };

  return (
    <div style={{ paddingTop: "0" }}>
      {showIntro && <Intro onComplete={handleIntroComplete} />}

      <Hero />
      <FeaturedProducts />
      <OccasionsSection />
      <CategorySection />
      <PromoSection />
      <LocationSection />
      <Testimonials />
    </div>
  )
}

export default Home