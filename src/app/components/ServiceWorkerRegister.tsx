"use client";

import { useEffect } from 'react';

/**
 * Registers the service worker located at /service-worker.js
 * Handles basic lifecycle logging & update detection.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        });
        console.log('✅ Service Worker registered:', registration.scope);

        // Reload the page once when the new SW takes control
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });

        // Listen for updates
        if (registration.waiting) {
          console.log('ℹ️ SW waiting (new version ready). Skipping waiting...');
          registration.waiting.postMessage('skipWaiting');
        }
        registration.addEventListener('updatefound', () => {
          console.log('🔄 New Service Worker found, installing...');
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('⚠️ New version installed. Skipping waiting to activate immediately.');
                  // Force activate the new SW
                  newWorker.postMessage('skipWaiting');
                } else {
                  console.log('✅ Service Worker installed for the first time.');
                }
              }
            });
          }
        });
      } catch (err) {
        console.warn('❌ Service Worker registration failed:', err);
      }
    };

    // Delay a bit to avoid blocking first paint
    const timeout = setTimeout(registerSW, 1200);
    return () => clearTimeout(timeout);
  }, []);

  return null;
}
