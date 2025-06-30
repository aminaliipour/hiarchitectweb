"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface EntryLandingProps {
  onEnter: () => void;
}

const EntryLanding: React.FC<EntryLandingProps> = ({ onEnter }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    if (!hasClicked) {
      setHasClicked(true);
      // Start the transition sequence
      setTimeout(() => {
        setShowContent(true);
      }, 800);
      
      // Complete transition to main site
      setTimeout(() => {
        onEnter();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background - starts black, transitions to colored on hover/click */}
      <motion.div
        className="absolute inset-0"
        initial={{ backgroundColor: "#000000" }}
        animate={{
          backgroundColor: hasClicked
            ? "#FBCC0A"
            : isHovering
            ? "#1a1a1a"
            : "#000000",
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Gradient overlay that appears on hover */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: hasClicked ? 1 : isHovering ? 0.3 : 0,
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          background: `radial-gradient(ellipse at center, 
            rgba(251, 204, 10, 0.1) 0%, 
            rgba(88, 89, 91, 0.05) 50%, 
            transparent 70%)`,
        }}
      />

      {/* Central Logo Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          ref={logoRef}
          className="relative cursor-pointer group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleLogoClick}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        >
          {/* Main Logo Container */}
          <motion.div
            className="relative w-32 h-32 flex items-center justify-center"
            animate={{
              scale: hasClicked ? [1, 1.1, 0.9] : isHovering ? 1.05 : 1,
            }}
            transition={{ duration: hasClicked ? 2 : 0.6, ease: "easeOut" }}
          >
            {/* Logo Background Circle */}
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              initial={{ borderColor: "#ffffff" }}
              animate={{
                borderColor: hasClicked
                  ? "#58595B"
                  : isHovering
                  ? "#FBCC0A"
                  : "#ffffff",
                backgroundColor: hasClicked
                  ? "rgba(88, 89, 91, 0.1)"
                  : isHovering
                  ? "rgba(251, 204, 10, 0.05)"
                  : "transparent",
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Logo Image */}
            <motion.div
              className="relative z-10 p-8"
              animate={{
                filter: hasClicked
                  ? "invert(0) brightness(1)"
                  : isHovering
                  ? "invert(0) brightness(1) contrast(1.2)"
                  : "invert(1) brightness(1)",
              }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="/images/Hi-logo.png"
                alt="لوگوی های آرشیتکت"
                width={80}
                height={40}
                className="object-contain"
              />
            </motion.div>

            {/* Interactive Dot */}
            <motion.div
              className="absolute -top-2 -right-2 w-3 h-3 rounded-full"
              initial={{ backgroundColor: "#ffffff" }}
              animate={{
                backgroundColor: hasClicked
                  ? "#58595B"
                  : isHovering
                  ? "#FBCC0A"
                  : "#ffffff",
                scale: hasClicked ? [1, 1.5, 0] : [1, 1.3, 1],
              }}
              transition={{
                backgroundColor: { duration: 0.6 },
                scale: {
                  duration: hasClicked ? 1.5 : 2,
                  repeat: hasClicked ? 0 : Infinity,
                  ease: "easeInOut",
                },
              }}
            />
          </motion.div>

          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHovering && !hasClicked ? 0.2 : 0,
              scale: isHovering && !hasClicked ? 1.5 : 0.8,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              background: `radial-gradient(circle, 
                rgba(251, 204, 10, 0.3) 0%, 
                rgba(251, 204, 10, 0.1) 40%, 
                transparent 70%)`,
            }}
          />
        </motion.div>
      </div>

      {/* Company Name - appears after click */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-light tracking-wider text-center mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              style={{
                color: "#58595B",
                fontFamily: "Morabba, serif",
                textShadow: "0 0 30px rgba(88, 89, 91, 0.3)",
              }}
            >
              های آرشیتکت
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl font-light tracking-wide text-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              style={{
                color: "#58595B",
                opacity: 0.8,
              }}
            >
              طراحی • تعادل • زیبایی
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color Expansion Animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          hasClicked
            ? {
                scale: 10,
                opacity: 0.9,
              }
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(circle, 
            rgba(251, 204, 10, 0.8) 0%, 
            rgba(88, 89, 91, 0.6) 40%, 
            rgba(251, 204, 10, 0.4) 80%, 
            transparent 100%)`,
          transformOrigin: "center center",
        }}
      />

      {/* Subtle Loading Indicator - only visible initially */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: hasClicked ? 0 : 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="text-sm tracking-widest text-white/60 uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          ورود به سایت
        </motion.div>
      </motion.div>

      {/* Corner Decoration Lines - appear on hover */}
      <AnimatePresence>
        {isHovering && !hasClicked && (
          <>
            <motion.div
              className="absolute top-8 left-8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div
                className="w-16 h-16 border-l-2 border-t-2"
                style={{ borderColor: "#FBCC0A" }}
              />
            </motion.div>
            
            <motion.div
              className="absolute top-8 right-8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
              <div
                className="w-16 h-16 border-r-2 border-t-2"
                style={{ borderColor: "#FBCC0A" }}
              />
            </motion.div>
            
            <motion.div
              className="absolute bottom-8 left-8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <div
                className="w-16 h-16 border-l-2 border-b-2"
                style={{ borderColor: "#FBCC0A" }}
              />
            </motion.div>
            
            <motion.div
              className="absolute bottom-8 right-8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <div
                className="w-16 h-16 border-r-2 border-b-2"
                style={{ borderColor: "#FBCC0A" }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntryLanding;
