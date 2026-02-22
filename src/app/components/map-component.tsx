"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import { Navigation, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";

// Custom styles for popup
const customPopupStyles = `
  .custom-popup .leaflet-popup-content-wrapper {
    background: transparent !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
    overflow: hidden;
    border: none !important;
    max-width: 280px !important;
  }
  
  .custom-popup .leaflet-popup-content {
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    border-radius: 0 !important;
    overflow: visible !important;
    width: auto !important;
  }
  
  .custom-popup .leaflet-popup-tip {
    background: rgba(31, 41, 55, 0.95) !important;
    border: 1px solid rgba(234, 179, 8, 0.3) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
  }
  
  .custom-popup .leaflet-popup-close-button {
    background: rgba(0, 0, 0, 0.7) !important;
    color: #fff !important;
    font-size: 16px !important;
    font-weight: bold !important;
    border-radius: 50% !important;
    width: 22px !important;
    height: 22px !important;
    top: 6px !important;
    right: 6px !important;
    border: 1px solid rgba(234, 179, 8, 0.3) !important;
    backdrop-filter: blur(10px) !important;
    transition: all 0.3s ease !important;
    line-height: 1 !important;
  }
  
  .custom-popup .leaflet-popup-close-button:hover {
    background: rgba(234, 179, 8, 0.9) !important;
    color: #000 !important;
    transform: scale(1.1) !important;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .custom-popup .leaflet-popup-content-wrapper {
      max-width: 240px !important;
    }
    
    .custom-popup .leaflet-popup-close-button {
      width: 20px !important;
      height: 20px !important;
      font-size: 14px !important;
      top: 4px !important;
      right: 4px !important;
    }
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = customPopupStyles;
  document.head.appendChild(styleSheet);
}

// تنظیم آیکون سفارشی برای شرکت
const companyIcon = new L.Icon({
  iconUrl: '/map_icon.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// تنظیم آیکون سفارشی برای پروژه‌ها با label
const createProjectIconWithLabel = (title: string) => {
  return L.divIcon({
    html: `
      <div class="project-marker-container">
        <div class="project-label">
          <span>${title}</span>
        </div>
        <div class="project-icon">
          <img src="/project_icon.png" alt="Project" width="60" height="60" style="filter: brightness(0) invert(1);" />
        </div>
      </div>
    `,
    className: 'custom-project-marker',
    iconSize: [120, 80],
    iconAnchor: [60, 75],
    popupAnchor: [0, -75],
  });
};

interface Project {
  id: string;
  title: string;
  slug: string;
  location: string;
  latitude: number;
  longitude: number;
  category_name: string;
  main_image?: string;
  description?: string;
}

export default function MapComponent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fix mobile map color issue
  useEffect(() => {
    if (typeof window === 'undefined' || !isMobile) return;

    // Different color schemes for mobile
    const colorSchemes = {
      blue: 'brightness(1.5) contrast(1.1) sepia(0.6) saturate(1.8) hue-rotate(180deg)', // Blue theme
      purple: 'brightness(1.2) contrast(1.2) sepia(0.8) saturate(1.5) hue-rotate(260deg)', // Purple theme
      green: 'brightness(1.4) contrast(1.1) sepia(0.7) saturate(1.6) hue-rotate(90deg)', // Green theme
      orange: 'brightness(1.3) contrast(1.2) sepia(0.9) saturate(2) hue-rotate(30deg)', // Orange theme
    };

    // Use blue theme for mobile
    const mobileFilter = colorSchemes.blue;

    const applyFilterToElement = (element: Element | null) => {
      if (!element || !(element instanceof HTMLElement)) return;
      element.style.setProperty('filter', mobileFilter, 'important');
      element.style.setProperty('-webkit-filter', mobileFilter, 'important');

      if (element.classList.contains('leaflet-tile')) {
        element.style.setProperty('mix-blend-mode', 'multiply', 'important');
        element.style.setProperty('opacity', '0.9', 'important');
      }
    };

    const fixMobileMapColors = () => {
      const mapTiles = document.querySelectorAll('.custom-gold-city-map .leaflet-tile');
      const mapLayers = document.querySelectorAll('.custom-gold-city-map .leaflet-layer, .custom-gold-city-map .leaflet-tile-pane');

      mapTiles.forEach((tile) => applyFilterToElement(tile));
      mapLayers.forEach((layer) => applyFilterToElement(layer));
    };

    // Apply immediately and after a short delay to catch late-loaded tiles
    fixMobileMapColors();
    const delayedTimer = window.setTimeout(fixMobileMapColors, 600);

    // Observe for newly added tiles (e.g., during pan/zoom) to keep colors consistent
    const tilePane = document.querySelector('.custom-gold-city-map .leaflet-tile-pane');
    const mutationObserver = tilePane
      ? new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) {
                applyFilterToElement(node);
                node.querySelectorAll('.leaflet-tile, .leaflet-layer').forEach((child) => applyFilterToElement(child));
              }
            });
          });
        })
      : null;

    if (tilePane && mutationObserver) {
      mutationObserver.observe(tilePane, { childList: true, subtree: true });
    }

    const handleOrientationChange = () => window.setTimeout(fixMobileMapColors, 400);
    const handleResize = () => window.setTimeout(fixMobileMapColors, 400);

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    return () => {
      window.clearTimeout(delayedTimer);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      mutationObserver?.disconnect();
    };
  }, [isMobile]);

  // بارگذاری پروژه‌ها
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('🔍 Fetching projects for map...');
        const response = await fetch('/api/projects?status=published&limit=500');
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📊 All projects data:', data);
          
          // فیلتر پروژه‌هایی که مختصات دارند
          const projectsWithCoords = data.projects.filter((project: any) => {
            const lat = parseFloat(project.latitude);
            const lng = parseFloat(project.longitude);
            const hasCoords = !isNaN(lat) && !isNaN(lng) && project.latitude !== null && project.longitude !== null;
            console.log(`📍 Project "${project.title}": lat=${project.latitude} (${lat}), lng=${project.longitude} (${lng}), hasCoords=${hasCoords}`);
            return hasCoords;
          }).map((project: any) => ({
            ...project,
            latitude: parseFloat(project.latitude),
            longitude: parseFloat(project.longitude)
          }));
          
          console.log('🗺️ Projects with coordinates:', projectsWithCoords);
          setProjects(projectsWithCoords);
        } else {
          console.error('❌ Failed to fetch projects:', response.status);
        }
      } catch (error) {
        console.error('❌ خطا در بارگذاری پروژه‌ها:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Function to open navigation to our location
  const openNavigation = () => {
    const latitude = 37.207081;
    const longitude = 50.009315;
    
    // Check if user is on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try to open in native maps app first
      const iosUrl = `maps://maps.google.com/maps?daddr=${latitude},${longitude}&amp;ll=`;
      const androidUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}(Hi Architect Company)`;
      
      // For iOS devices
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        window.open(iosUrl, '_blank');
        // Fallback to Google Maps web if native app doesn't open
        setTimeout(() => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
        }, 1000);
      } else {
        // For Android devices
        window.open(androidUrl, '_blank');
        // Fallback to Google Maps web if native app doesn't open
        setTimeout(() => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
        }, 1000);
      }
    } else {
      // Desktop - open Google Maps directions
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
    }
  }

  // تابع رفتن به صفحه پروژه
  const goToProject = (slug: string) => {
    window.open(`/project/${slug}`, '_blank');
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[37.205996, 50.013413]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        className="custom-gold-city-map"
        zoomControl={false}
      >
        {/* Custom golden city map tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
        />
        
        {/* مارکر شرکت */}
        <Marker position={[37.207081, 50.009315]} icon={companyIcon}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg text-yellow-600" style={{ fontFamily: 'Morabba, Vazirmatn, sans-serif' }}>شرکت های آرشیتکت</h3>
              <p className="text-sm text-white" style={{ fontFamily: 'Morabba, Vazirmatn, sans-serif' }}>لاهیجان، میدان بسیج، پلاک ۱</p>
            </div>
          </Popup>
        </Marker>

        {/* مارکرهای پروژه‌ها */}
        {projects.map((project) => (
          <Marker 
            key={project.id} 
            position={[project.latitude, project.longitude]} 
            icon={createProjectIconWithLabel(project.title)}
          >
            <Popup className="custom-popup">
              <div className="w-60 sm:w-64 md:w-72 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-black/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-yellow-500/30 ring-1 ring-yellow-500/10">
                {/* Project Image */}
                <div className="relative h-28 sm:h-32 overflow-hidden">
                  {project.main_image ? (
                    <>
                      <img 
                        src={project.main_image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      {/* Glass effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-yellow-600/30 to-yellow-800/20 flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-full bg-yellow-500/30 flex items-center justify-center border border-yellow-500/50 backdrop-blur-sm">
                          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                        </div>
                        <p className="text-xs text-yellow-300 font-medium" style={{ fontFamily: 'Morabba, Vazirmatn, sans-serif' }}>تصویر پروژه</p>
                      </div>
                    </div>
                  )}

                  {/* Project title overlay */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="font-bold text-sm sm:text-base md:text-lg text-white drop-shadow-2xl leading-tight text-center" style={{ fontFamily: 'Morabba, Vazirmatn, sans-serif' }}>
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Content - Only Button */}
                <div className="p-3 sm:p-4">
                  {/* Action Button with enhanced styling */}
                  <button
                    onClick={() => goToProject(project.slug)}
                    className="w-full bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 hover:from-yellow-600 hover:via-yellow-700 hover:to-yellow-600 text-black text-xs sm:text-sm font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/40 flex items-center justify-center gap-2 sm:gap-3 border border-yellow-400/50 backdrop-blur-sm relative overflow-hidden group"
                  >
                    {/* Button shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    <span className="relative z-10" style={{ fontFamily: 'Morabba, Vazirmatn, sans-serif' }}>مشاهده پروژه</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Navigation & Info Buttons */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openNavigation}
          className="flex items-center gap-2 rounded-lg bg-black/80 backdrop-blur-sm border border-yellow-500/50 px-3 py-2 text-sm font-medium text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500 transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
        >
          <Navigation className="h-4 w-4" />
          مسیریابی
        </motion.button>
        
        {loading ? (
          <div className="flex items-center gap-2 rounded-lg bg-black/80 backdrop-blur-sm border border-gray-500/50 px-3 py-2 text-sm font-medium text-gray-400">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            بارگذاری...
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-black/80 backdrop-blur-sm border border-blue-500/50 px-3 py-2 text-sm font-medium text-blue-400">
            <MapPin className="h-4 w-4" />
            {projects.length} پروژه
          </div>
        )}
      </div>
      
      {/* Golden city overlay effect with enhanced styling */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-gray-900/30 to-black/20" />
        
        {/* Golden accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-transparent to-yellow-400/5 mix-blend-soft-light" />
        
        {/* Border glow effect */}
        <div className="absolute inset-0 border border-yellow-500/20 rounded-xl shadow-inner shadow-yellow-500/10" />
      </div>
      
      {/* Custom CSS for black & gold themed map */}
      <style jsx global>{`
        .custom-gold-city-map {
          background: #1a1a1a;
        }
        
        .custom-gold-city-map .leaflet-tile {
          filter: 
            brightness(2)
            contrast(1)
            sepia(1.8)
            saturate(20)
            hue-rotate(45deg);
          mix-blend-mode: multiply;
          opacity: 100%;
        }
        
        /* Fix green color issue on mobile devices */
        @media only screen and (max-width: 768px) {
          .custom-gold-city-map .leaflet-tile {
            filter: 
              brightness(2)
              contrast(1)
              sepia(1.8)
              saturate(20)
              hue-rotate(45deg) !important;
            mix-blend-mode: multiply !important;
            opacity: 100% !important;
            -webkit-filter: 
              brightness(2)
              contrast(1)
              sepia(1.8)
              saturate(20)
              hue-rotate(45deg) !important;
          }
          
          .custom-gold-city-map .leaflet-layer,
          .custom-gold-city-map .leaflet-tile-pane {
            filter: 
              brightness(2)
              contrast(1)
              sepia(1.8)
              saturate(20)
              hue-rotate(45deg) !important;
            -webkit-filter: 
              brightness(2)
              contrast(1)
              sepia(1.8)
              saturate(20)
              hue-rotate(45deg) !important;
          }
        }
        
        /* Golden grid overlay for city blocks */
        .custom-gold-city-map::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(90deg, transparent 97%, rgba(255, 204, 0, 0.2) 98%, transparent 99%),
            linear-gradient(0deg, transparent 97%, rgba(255, 204, 0, 0.2) 98%, transparent 99%);
          background-size: 30px 30px;
          pointer-events: none;
          z-index: 1000;
          opacity: 0.4;
        }
        
        /* Custom marker styling with gold glow */
        .custom-gold-city-map .leaflet-marker-icon {
          filter: drop-shadow(0 0 15px rgba(255, 204, 0, 0.8)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
          transition: all 0.3s ease;
        }
        
        .custom-gold-city-map .leaflet-marker-icon:hover {
          filter: drop-shadow(0 0 25px rgba(255, 204, 0, 1)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.7));
          transform: scale(1.1);
        }
        
        /* Project marker with label styling */
        .custom-project-marker {
          background: none !important;
          border: none !important;
        }
        
        .project-marker-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 120px;
        }
        
        .project-label {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(26, 26, 26, 0.9));
          color: #FFCC00;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
          font-family: 'Morabba', 'Vazirmatn', monospace;
          white-space: nowrap;
          text-align: center;
          border: 1px solid rgba(255, 204, 0, 0.5);
          backdrop-filter: blur(5px);
          margin-bottom: 5px;
          max-width: 110px;
          overflow: hidden;
          text-overflow: ellipsis;
          transform: translateY(0);
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }
        
        .project-label:hover {
          background: linear-gradient(135deg, rgba(255, 204, 0, 0.9), rgba(255, 215, 0, 0.9));
          color: #000;
          transform: translateY(-2px);
        }
        
        .project-icon {
          transition: all 0.3s ease;
        }
        
        .project-icon img {
          width: 60px;
          height: 60px;
          object-fit: contain;
          display: block;
          filter: brightness(0) invert(1);
        }
        
        .project-marker-container:hover .project-icon {
          transform: scale(1.1);
        }
        
        .project-marker-container:hover .project-icon img {
          transform: scale(1.05);
        }
        
        /* Mobile adjustments for project labels */
        @media only screen and (max-width: 768px) {
          .project-label {
            font-size: 9px;
            padding: 3px 6px;
            max-width: 90px;
          }
          
          .project-marker-container {
            width: 100px;
          }
          
          .project-icon img {
            width: 45px;
            height: 45px;
          }
        }
        
        /* Custom popup styling - dark with gold accents */
        .custom-gold-city-map .leaflet-popup-content-wrapper {
          background: linear-gradient(135deg, #000000, #1a1a1a);
          color: #FFCC00;
          border: 2px solid rgba(255, 204, 0, 0.5);
          border-radius: 12px;
          font-weight: 700;
          text-shadow: 0 0 10px rgb(255, 204, 0);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 204, 0, 0.2);
        }
        
        .custom-gold-city-map .leaflet-popup-tip {
          background:rgb(255, 238, 0);
          border: 1px solid rgba(255, 204, 0, 0.5);
        }
        
        /* Remove default controls styling */
        .custom-gold-city-map .leaflet-control-container {
          display: none;
        }
        
        /* Golden street lines effect */
        .custom-gold-city-map::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 25% 25%, rgba(255, 204, 0, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 75% 75%, rgba(255, 204, 0, 0.03) 0%, transparent 40%);
          background-size: 150px 150px, 200px 200px;
          pointer-events: none;
          z-index: 999;
          opacity: 0.6;
          animation: cityPulse 6s ease-in-out infinite alternate;
        }
        
        @keyframes cityPulse {
          0% { opacity: 0.4; }
          100% { opacity: 0.8; }
        }
        
        /* Improve road visibility */
        .custom-gold-city-map .leaflet-tile-container {
          /* Remove the overly strong filter */
        }
      `}</style>
    </div>
  )
}
