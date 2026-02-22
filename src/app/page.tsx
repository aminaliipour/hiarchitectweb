"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HeroSlider from "./components/hero-slider"
import ProjectGrid from "./components/project-grid"
import DesignStudio from "./components/design-studio"
import Community from "./components/community"
import Contact from "./components/contact"
import Footer from "./components/footer"
import Navigation from "./components/navigation"

// Dynamically import Timeline to avoid hydration issues with Framer Motion
const Timeline = dynamic(() => import("./components/timeline"), {
  ssr: false,
  loading: () => (
    <section id="timeline" className="relative bg-black py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">سفر ما</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            مسیری که طی کرده‌ایم و ماحصل تجربه‌هایمان
          </p>
        </div>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    </section>
  )
})
import LandingNew from "./components/landing-new"
import { AnimatePresence } from "framer-motion"

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);

  const handleEnterSite = () => {
    setShowLanding(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasVisited', 'true');
    }
  };

  // Check if user has already visited and handle direct navigation
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return;
    
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
