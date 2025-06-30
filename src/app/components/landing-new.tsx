"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LandingProps {
  onEnter: () => void;
}

const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const [clicked, setClicked] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const handleLogoClick = () => {
    setClicked(true);
    // Logo will move up with animation when clicked
  };

  const handleEnterClick = () => {
    // Start beautiful entrance animation
    setIsEntering(true);
    // Smooth transition to main site
    setTimeout(() => {
      onEnter();
    }, 2000); // Longer duration for beautiful effect
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isEntering ? 0 : 1,
        scale: isEntering ? 1.1 : 1
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: isEntering ? 1.5 : 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* No color expansion animation - just keep it simple */}

      {/* Main Content Container */}
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Logo - Clean and Simple */}
        <motion.div
          className="relative cursor-pointer group"
          onClick={handleLogoClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: isEntering ? 0.8 : (clicked ? 1 : 1), 
            opacity: isEntering ? 0 : 1, // Fade out during entrance
            x: 0, // Keep centered
            y: clicked ? -80 : 0,   // Only move up when clicked
          }}
          transition={{ 
            duration: isEntering ? 1.5 : (clicked ? 0.8 : 1), 
            delay: isEntering ? 0.2 : (clicked ? 0 : 0.5), 
            ease: isEntering ? [0.25, 0.46, 0.45, 0.94] : (clicked ? [0.22, 1, 0.36, 1] : "easeInOut")
          }}
        >
          {/* Logo Image - No border, no background */}
          <motion.div
            className="relative flex items-center justify-center"
            animate={clicked ? { 
              scale: 1
            } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Image
              src="/images/Hi-logo.png"
              alt="لوگوی های آرشیتکت"
              width={150}
              height={75}
              className={`transition-all duration-500 ${
                clicked ? 'filter-none' : 'filter grayscale group-hover:filter-none'
              }`}
            />
          </motion.div>
        </motion.div>

        {/* Company Name - Beautiful fade out effect */}
        <AnimatePresence>
          {clicked && !isEntering && (
            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-6 mt-12"
              style={{ 
                color: '#ffffff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              های آرشیتکت
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Subtitle - Beautiful fade out effect */}
        <AnimatePresence>
          {clicked && !isEntering && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-xl md:text-2xl lg:text-3xl text-center mb-16 max-w-2xl"
              style={{ color: '#FBCC0A' }}
            >
              ما زندگی را با طراحی میسازیم
            </motion.p>
          )}
        </AnimatePresence>

        {/* ENTER Button - Beautiful fade out effect */}
        <AnimatePresence>
          {clicked && !isEntering && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex justify-center"
            >
              <motion.button
                onClick={handleEnterClick}
                className="px-12 py-5 bg-transparent border-2 border-yellow-500 text-yellow-500 font-medium text-2xl rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 tracking-wider"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  backdropFilter: 'blur(10px)'
                }}
              >
                ورود
              </motion.button>
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
        <div className="flex items-center gap-2 text-gray-300">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full"
          />
          <span className="text-sm">آماده‌سازی...</span>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default Landing;
