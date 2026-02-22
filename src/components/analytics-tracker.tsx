'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AnalyticsTrackerProps {
  children: React.ReactNode;
}

export default function AnalyticsTracker({ children }: AnalyticsTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    // فقط در محیط تولید یا development فعال باشد
    if (typeof window === 'undefined') return;

    // صفحات مدیریت را ردیابی نکن
    if (pathname.startsWith('/admin')) return;

    const trackPageView = async () => {
      try {
        // Analytics feature disabled - MongoDB migration in progress
        console.debug('Analytics tracking disabled');
        return;

        /* Disabled until MongoDB migration complete
        const trackingData = {
          page_url: pathname,
          page_title: document.title,
          user_agent: navigator.userAgent,
          referer: document.referrer || null,
          country: null,
          city: null
        };

        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trackingData)
        });
        */

      } catch (error) {
        console.debug('Analytics tracking error:', error);
      }
    };

    // تاخیر کمی برای اطمینان از بارگذاری کامل صفحه
    const timer = setTimeout(trackPageView, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}

// Hook برای ردیابی رویدادهای سفارشی
export function useAnalytics() {
  const trackEvent = async (eventData: {
    event_type: string;
    event_data?: Record<string, any>;
    page_url?: string;
  }) => {
    try {
      // Analytics feature disabled - MongoDB migration in progress
      console.debug('Event tracking disabled');
      return;

      /* Disabled until MongoDB migration complete
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          page_url: eventData.page_url || window.location.pathname,
          timestamp: new Date().toISOString()
        })
      });
      */
    } catch (error) {
      console.debug('Event tracking error:', error);
    }
  };

  return { trackEvent };
}