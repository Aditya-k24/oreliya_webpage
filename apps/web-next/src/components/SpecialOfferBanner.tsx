'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SPECIAL_OFFER_BANNER_KEY = 'oreliya-special-offer-banner-shown';

export function SpecialOfferBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if banner has been shown before
    const hasSeenBanner = localStorage.getItem(SPECIAL_OFFER_BANNER_KEY);
    
    // For testing - you can comment out the localStorage check below
    // const hasSeenBanner = null; // Uncomment this line to force show banner
    
    if (!hasSeenBanner) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
        setIsLoaded(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const handleBannerClick = () => {
    // Mark banner as shown
    localStorage.setItem(SPECIAL_OFFER_BANNER_KEY, 'true');
    
    // Navigate to special offer page
    router.push('/products?category=special-offer-rings');
    
    // Close banner
    setShowBanner(false);
  };

  const handleCloseBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Mark banner as shown
    localStorage.setItem(SPECIAL_OFFER_BANNER_KEY, 'true');
    
    // Close banner
    setShowBanner(false);
  };

  // Don't render anything until component is loaded
  if (!isLoaded) {
    return null;
  }

  // Don't render if banner shouldn't be shown
  if (!showBanner) {
    // Debug button to force show banner (remove this in production)
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => {
            localStorage.removeItem(SPECIAL_OFFER_BANNER_KEY);
            window.location.reload();
          }}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Show Banner (Debug)
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={handleCloseBanner}
      >
        {/* Banner */}
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          onClick={handleBannerClick}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] cursor-pointer group">
            {/* Close button */}
            <button
              onClick={handleCloseBanner}
              className="absolute -top-4 -right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close banner"
            >
              <svg 
                className="w-6 h-6 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>

            {/* Banner Image */}
            <div className="relative w-full h-auto rounded-2xl overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/images/banners/special-offer-banner.png"
                alt="Diwali Sale - Silver with Lab grown diamond rings at ₹5,999"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
              
              {/* Overlay for better interaction feedback */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
