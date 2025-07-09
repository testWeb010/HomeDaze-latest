import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  address: string;
  coordinates: { lat: number; lng: number };
}

const LocationMap: React.FC<LocationMapProps> = ({
  address,
  coordinates,
}) => {
  // In a real application, you would integrate a map library here (e.g., Google Maps, Leaflet)
  // and use the coordinates to display the location.
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Interactive Map View</p>
          <p className="text-sm text-gray-500">{address}</p>
          {/* Display coordinates for now */}
          <p className="text-xs text-gray-400">Lat: {coordinates.lat}, Lng: {coordinates.lng}</p>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
