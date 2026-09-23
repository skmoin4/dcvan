import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript, reverseGeocode } from '../../utils/loadGoogleMaps';
import GOOGLE_MAPS_API_KEY from '../../config/googleMaps';

const hasValidGoogleKey = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY_HERE';

const LocationPicker = ({ onLocationSelect, initialLocation = null, height = '320px', showCoordinates = true }) => {
  const mapNode = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [mode, setMode] = useState(hasValidGoogleKey ? 'map' : 'manual');
  const [loading, setLoading] = useState(false);
  const [mapError, setMapError] = useState('');
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [manualAddress, setManualAddress] = useState(initialLocation?.address || '');
  const [coords, setCoords] = useState(initialLocation?.lat && initialLocation?.lng ? { lat: initialLocation.lat, lng: initialLocation.lng } : null);

  useEffect(() => {
    if (mode !== 'map' || !hasValidGoogleKey || mapInstance.current) return;

    let mounted = true;
    const initMap = async () => {
      try {
        setLoading(true);
        await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY);
        if (!mounted || !mapNode.current) return;

        const center = coords || { lat: 28.6139, lng: 77.2090 };
        mapInstance.current = new window.google.maps.Map(mapNode.current, {
          center,
          zoom: coords ? 16 : 12,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });

        const setMapLocation = async (lat, lng) => {
          const nextCoords = { lat, lng };
          setCoords(nextCoords);

          if (!markerInstance.current) {
            markerInstance.current = new window.google.maps.Marker({
              position: nextCoords,
              map: mapInstance.current,
              draggable: true,
            });
            markerInstance.current.addListener('dragend', async () => {
              const position = markerInstance.current.getPosition();
              await setMapLocation(position.lat(), position.lng());
            });
          } else {
            markerInstance.current.setPosition(nextCoords);
          }

          mapInstance.current.panTo(nextCoords);
          const resolvedAddress = await reverseGeocode(lat, lng);
          const nextAddress = resolvedAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setAddress(nextAddress);
          setManualAddress(nextAddress);
          onLocationSelect({ address: nextAddress, lat, lng, source: 'google_map' });
        };

        mapInstance.current.addListener('click', async (event) => {
          await setMapLocation(event.latLng.lat(), event.latLng.lng());
        });

        setMapError('');
      } catch (err) {
        setMapError('Map could not load. Please enter address manually.');
        setMode('manual');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initMap();
    return () => { mounted = false; };
  }, [coords, mode, onLocationSelect]);

  const confirmManualAddress = () => {
    const value = manualAddress.trim();
    if (!value) return;
    setAddress(value);
    setCoords(null);
    onLocationSelect({ address: value, lat: null, lng: null, source: 'manual' });
  };

  const clear = () => {
    setAddress('');
    setManualAddress('');
    setCoords(null);
    if (markerInstance.current) {
      markerInstance.current.setMap(null);
      markerInstance.current = null;
    }
    onLocationSelect(null);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={!hasValidGoogleKey}
          onClick={() => setMode('map')}
          className={`rounded-lg px-3 py-2 text-sm font-bold transition ${mode === 'map' ? 'bg-navy-900 text-white shadow-soft' : 'bg-white text-slate-600 hover:bg-slate-100'} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Google Map
        </button>
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`rounded-lg px-3 py-2 text-sm font-bold transition ${mode === 'manual' ? 'bg-navy-900 text-white shadow-soft' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          Manual Address
        </button>
      </div>

      {mapError && <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{mapError}</p>}
      {!hasValidGoogleKey && <p className="mb-3 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">Google Maps API key is not configured, so manual address is active.</p>}

      {mode === 'map' && (
        <div className="relative">
          <div ref={mapNode} style={{ height }} className="w-full rounded-md border border-slate-200 bg-slate-200" />
          {loading && <div className="absolute inset-0 grid place-items-center rounded-md bg-white/80 text-sm font-semibold text-slate-700">Loading map...</div>}
        </div>
      )}

      {mode === 'manual' && (
        <div className="space-y-3">
          <textarea
            className="input-field min-h-24 resize-none"
            value={manualAddress}
            onChange={(event) => setManualAddress(event.target.value)}
            placeholder="House number, street, area, city, pincode"
          />
          <button type="button" onClick={confirmManualAddress} disabled={!manualAddress.trim()} className="btn-secondary w-full">
            Confirm Address
          </button>
        </div>
      )}

      {address && (
        <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 text-sm">
          <p className="font-bold text-emerald-800">Selected Address</p>
          <p className="mt-1 text-slate-600">{address}</p>
          {showCoordinates && coords && <p className="mt-2 text-xs text-slate-500">Lat {coords.lat.toFixed(6)}, Lng {coords.lng.toFixed(6)}</p>}
          <button type="button" onClick={clear} className="mt-2 text-sm font-bold text-red-600 hover:text-red-700">Clear</button>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
