import React, { useEffect, useState } from 'react';
import { AdMob } from '@capacitor-community/admob'; // Adjust based on the actual plugin import

const AdMobBanner1 = () => {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    const initializeAdMob = async () => {
      try {
        // Initialize AdMob (usually done once at app start, but good to ensure here)
        await AdMob.initialize({
          requestTrackingAuthorization: true, // For iOS 14+
          testingDevices: [], // Add your test device IDs here for debugging
          initializeForTesting: false, // Set to true for development/testing
        });

        // Prepare and show the banner ad
        await AdMob.showBanner({
          adId: 'ca-app-pub-7055753745584437/3645442365', // Replace with your actual banner ad unit ID
          position: AdMob.AD_POSITION.BOTTOM_CENTER, // Or TOP_CENTER, etc.
          // Optional: size: AdMob.AD_SIZE.BANNER, // Or other sizes like FULL_BANNER, LARGE_BANNER, etc.
          //margin: 0,           is // set a margin from the bottom
        });
        setAdLoaded(true);

      } catch (error) {
        console.error('Error initializing or showing AdMob banner:', error);
      }
    };

    if (window.Capacitor) { // Ensure Capacitor is available (i.e., running on a native platform)
      initializeAdMob();
    }

    return () => {
      // Clean up: hide and remove the banner when the component unmounts
      if (window.Capacitor && adLoaded) {
        AdMob.hideBanner();
        // You might want to also remove the banner if it's no longer needed
        // AdMob.removeBanner();
      }
    };
  }, [adLoaded]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {/* You can add a placeholder or loading indicator here */}
      {adLoaded ? <p>Ad Banner (Native)</p> : <p>Loading Ad...</p>}
    </div>
  );
};

export default AdMobBanner1;