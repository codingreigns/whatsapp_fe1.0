import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addFiles } from "../../app/features/chatSlice";

const LocationIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19S6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M20,19C20,21.21 16.42,23 12,23C7.58,23 4,21.21 4,19C4,17.71 5.22,16.56 7.11,15.94L7.75,16.74C6.67,17.19 6,17.81 6,18.5C6,19.88 8.69,21 12,21C15.31,21 18,19.88 18,18.5C18,17.81 17.33,17.19 16.25,16.74L16.89,15.94C18.78,16.56 20,17.71 20,19Z" />
  </svg>
);

const LocationAttachment = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache location for 1 minute
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          resolve({ latitude, longitude, accuracy });
        },
        (error) => {
          let message;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Location access denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable";
              break;
            case error.TIMEOUT:
              message = "Location request timed out";
              break;
            default:
              message = "An unknown error occurred";
              break;
          }
          reject(new Error(message));
        },
        options
      );
    });
  };

  const getLocationName = async (latitude, longitude) => {
    try {
      // Using a simple reverse geocoding service (you might want to replace with your preferred service)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (!response.ok) {
        throw new Error("Failed to get location name");
      }

      const data = await response.json();
      return (
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        "Unknown Location"
      );
    } catch (error) {
      console.warn("Failed to get location name:", error);
      return "Unknown Location";
    }
  };

  const handleLocationClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { latitude, longitude, accuracy } = await getCurrentLocation();
      const locationName = await getLocationName(latitude, longitude);

      const locationData = {
        latitude,
        longitude,
        accuracy,
        name: locationName,
        timestamp: new Date().toISOString(),
        type: "location",
      };

      // Create a location object that mimics a file structure for consistency
      const locationFile = {
        name: `Location: ${locationName}`,
        type: "location/coordinates",
        size: JSON.stringify(locationData).length,
        lastModified: Date.now(),
        locationData,
      };

      dispatch(
        addFiles({
          file: locationFile,
          fileData: `data:application/json;base64,${btoa(
            JSON.stringify(locationData)
          )}`,
          type: "location",
        })
      );
    } catch (err) {
      setError(err.message);
      console.error("Location error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-500 cursor-pointer transition-colors">
      <button
        className="hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        onClick={handleLocationClick}
        disabled={isLoading}
      >
        <div className="flex gap-3">
          <div className="w-5 h-5 text-green-400">
            {isLoading ? (
              <svg
                className="animate-spin w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
              </svg>
            ) : (
              <LocationIcon />
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white text-sm">
              {isLoading ? "Getting Location..." : "Location"}
            </span>
            {error && (
              <span className="text-red-400 text-xs mt-1">{error}</span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};

export default LocationAttachment;
