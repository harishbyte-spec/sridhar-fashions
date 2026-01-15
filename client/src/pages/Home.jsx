import React, { useState, useEffect } from 'react'
import Hero from '../components/HomePage/Hero'
import CategorySection from '../components/HomePage/CategorySection'
import FeaturedProducts from "../components/HomePage/FeaturedProducts";
import OccasionsSection from '../components/HomePage/Occasions';
import PromoSection from '../components/HomePage/PromoSection';
import Testimonials from '../components/HomePage/Testimonials';
import LocationSection from '../components/HomePage/Location';
import Intro from '../components/IntroAnimation/Intro';
import API_URL from "../config";

const Home = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [homeSettings, setHomeSettings] = useState(null);

  useEffect(() => {
    // Fetch Settings
    fetch(`${API_URL}/home-settings`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setHomeSettings(data.settings);
        }
      })
      .catch(err => console.error("Home settings fetch error", err));
  }, []);

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

      <Hero settings={homeSettings} />
      <FeaturedProducts />
      <OccasionsSection />
      <CategorySection settings={homeSettings} />
      <PromoSection settings={homeSettings} />
      <LocationSection />
      <Testimonials />
    </div>
  )
}

export default Home