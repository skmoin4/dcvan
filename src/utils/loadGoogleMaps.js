let googleMapsLoaded = false;
let googleMapsPromise = null;

/**
 * Dynamically load Google Maps API script
 * @param {string} apiKey - Google Maps API key
 * @param {string} libraries - Comma-separated list of libraries (default: places)
 * @returns {Promise<void>}
 */
export const loadGoogleMapsScript = (apiKey, libraries = 'places') => {
  // Already loaded
  if (googleMapsLoaded && window.google && window.google.maps) {
    return Promise.resolve();
  }

  // Already loading
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if already loaded via script tag
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
    if (existingScript) {
      googleMapsLoaded = true;
      return resolve();
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      googleMapsLoaded = true;
      console.log('✅ Google Maps API loaded successfully');
      resolve();
    };

    script.onerror = (error) => {
      console.error('❌ Google Maps loading failed:', error);
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

/**
 * Reverse geocode coordinates to address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Formatted address
 */
export const reverseGeocode = (lat, lng) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      return reject(new Error('Google Maps not loaded'));
    }

    const geocoder = new window.google.maps.Geocoder();
    const latLng = { lat, lng };

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        console.warn('Geocoding failed:', status);
        resolve('');
      }
    });
  });
};
