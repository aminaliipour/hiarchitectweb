import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Listen for changes
    mql.addEventListener("change", onChange)
    
    // Cleanup
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Hook جدید برای تشخیص نوع دستگاه
export function useDeviceType() {
  const [deviceType, setDeviceType] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDeviceType = () => {
      const width = window.innerWidth
      if (width < 768) {
        setDeviceType('mobile')
      } else if (width < 1024) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    // Initial check
    updateDeviceType()

    // Listen for resize
    window.addEventListener('resize', updateDeviceType)
    
    // Cleanup
    return () => window.removeEventListener('resize', updateDeviceType)
  }, [])

  return deviceType
}

// Hook برای تشخیص touch device
export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(hasTouch)
  }, [])

  return isTouchDevice
}
