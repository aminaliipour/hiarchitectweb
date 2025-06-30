"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MousePointer2 } from "lucide-react";

interface LandingProps {
  onEnter: () => void;
}

const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const [showPointer, setShowPointer] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // Show pointer hint after 3 seconds
    const timer = setTimeout(() => {
      setShowPointer(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleLogoClick = () => {
    setClicked(true);
    // Wait for color animation to complete before entering main site
    setTimeout(onEnter, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: clicked ? '#FBCC0A' : '#ffffff'
      }}
    >
      {/* Color Expansion Animation */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 0, opacity: 0 }}
        animate={clicked ? { 
          scale: 20, 
          opacity: 1,
          background: `radial-gradient(circle, 
            #FBCC0A 0%, 
            #58595B 50%, 
            #FBCC0A 100%)`
        } : { scale: 0, opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          borderRadius: '50%',
          transformOrigin: 'center center'
        }}
      />

      {/* Main Content Container */}
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Logo Square - The Clickable Element */}
        <motion.div
          className="relative cursor-pointer group"
          onClick={handleLogoClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* The Main Square */}
          <motion.div
            className="w-24 h-24 relative overflow-hidden border-2 border-black"
            style={{
              backgroundColor: clicked ? '#58595B' : '#ffffff',
              borderColor: clicked ? '#FBCC0A' : '#000000'
            }}
            animate={clicked ? { 
              scale: [1, 1.2, 0],
              rotate: [0, 90, 180],
              borderRadius: ['0%', '50%', '0%']
            } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Logo Image */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center p-2"
              animate={clicked ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/images/Hi-logo.png"
                alt="لوگوی های آرشیتکت"
                width={60}
                height={30}
                className="filter grayscale"
              />
            </motion.div>

            {/* Click Indicator Dot */}
            <motion.div
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{
                backgroundColor: clicked ? '#FBCC0A' : '#ff0000'
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>

        {/* Company Name - Only show after click */}
        <AnimatePresence>
          {clicked && (
            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-center mb-4 mt-8"
              style={{ 
                color: '#ffffff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              های آرشیتکت
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Subtitle - Only show after click */}
        <AnimatePresence>
          {clicked && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-lg md:text-xl text-center mb-12 max-w-md"
              style={{ color: '#ffffff' }}
            >
              تعادل • هماهنگی • زیبایی
            </motion.p>
          )}
        </AnimatePresence>

        {/* Animated Pointer Hint */}
        <AnimatePresence>
          {showPointer && !clicked && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0],
                x: [20, 0, -10, 0],
                y: [20, 10, 0, -10],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="absolute"
              style={{
                left: 'calc(50% + 60px)',
                top: 'calc(50% - 60px)',
              }}
            >
              <div className="flex items-center gap-2">
                <MousePointer2 className="w-5 h-5 text-red-500" />
                <span className="text-xs text-gray-700 bg-white/90 px-2 py-1 rounded shadow-lg border">
                  کلیک کنید
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simple Loading Text at Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: clicked ? 0 : 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex items-center gap-2 text-gray-600">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full"
          />
          <span className="text-sm">آماده‌سازی...</span>
        </div>
      </motion.div>

      {/* Minimal Corner Lines - Only show after click */}
      <AnimatePresence>
        {clicked && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute top-8 left-8 w-12 h-12 border-l border-t border-white/50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 1.7, duration: 1 }}
              className="absolute top-8 right-8 w-12 h-12 border-r border-t border-white/50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 1.9, duration: 1 }}
              className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-white/50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 2.1, duration: 1 }}
              className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-white/50"
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Landing;
