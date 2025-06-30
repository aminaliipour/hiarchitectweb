"use client";
import { useState, useEffect } from "react";
import HeroSlider from "./components/hero-slider"
import Timeline from "./components/timeline"
import ProjectGrid from "./components/project-grid"
import DesignStudio from "./components/design-studio"
import Community from "./components/community"
import Contact from "./components/contact"
import Footer from "./components/footer"
import Navigation from "./components/navigation"
import LandingNew from "./components/landing-new"
import { AnimatePresence } from "framer-motion"

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);

  const handleEnterSite = () => {
    setShowLanding(false);
    sessionStorage.setItem('hasVisited', 'true');
  };

  // Check if user has already visited and handle direct navigation
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    const hasHash = window.location.hash;
    
    if (hasVisited || hasHash) {
      setShowLanding(false);
      
      // If there's a hash, scroll to it after landing is hidden
      if (hasHash) {
        setTimeout(() => {
          const hash = hasHash.substring(1);
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLanding ? (
          <LandingNew key="landing" onEnter={handleEnterSite} />
        ) : (
          <main key="main" className="relative min-h-screen overflow-hidden bg-black text-white">
            <Navigation />
            <HeroSlider />
            <ProjectGrid />
            <Timeline />
            <DesignStudio />
            <Community />
            <Contact />
            <Footer />
          </main>
        )}
      </AnimatePresence>
    </>
  )
}
