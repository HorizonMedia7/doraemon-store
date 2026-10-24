import { useCallback } from 'react';
import { recordAffiliateClick } from '../services/supabase';

/**
 * Lightweight hook to track outbound affiliate link clicks.
 * Logs structured analytics events to console, updates Supabase database stats,
 * and dispatches a DOM CustomEvent for external analytics.
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

      if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push(eventPayload);
      }
    }

    // 3. Record click in Supabase (fire and forget, won't slow down click)
    recordAffiliateClick({
      productId,
      productName,
      store,
      url,
      price
    });
  }, []);

  return { trackClick };
}
