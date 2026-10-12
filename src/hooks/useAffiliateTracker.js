import { useCallback } from 'react';

/**
 * Lightweight hook to track outbound affiliate link clicks.
 * Logs structured analytics events to console and dispatches a DOM CustomEvent
 * so Google Analytics 4, Meta Pixel, or PostHog can be integrated easily.
 */
export function useAffiliateTracker() {
  const trackClick = useCallback(({ store, productName, productId, url, price }) => {
    const eventPayload = {
      event: 'affiliate_link_click',
      store,
      productName,
      productId,
      destinationUrl: url,
      price: price || 'N/A',
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent
    };

    // 1. Console log for development & debugging
    console.log(
      `%c[Affiliate Click Tracker]%c Clicked "${productName}" on ${store} (${price || 'no price'})`,
      'background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
      'color: #38bdf8; font-weight: 500;',
      eventPayload
    );

    // 2. Dispatch custom event for window listeners (e.g. GTM / Google Analytics)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('doraemon_affiliate_click', {
          detail: eventPayload
        })
      );

      // Example of optional dataLayer push if Google Tag Manager exists
      if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push(eventPayload);
      }
    }
  }, []);

  return { trackClick };
}
