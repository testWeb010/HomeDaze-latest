import React from 'react';
import { ArrowLeft, Heart, Share2, MapPin } from 'lucide-react';

interface PropertyHeaderProps {
  title: string;
  location: string;
  isFavorited: boolean;
  onBackClick: () => void;
  onFavoriteClick: () => void;
  onShareClick: () => void;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  title,
  location,
  isFavorited,
  onBackClick,
  onFavoriteClick,
  onShareClick,
}) => {
  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                {title}
              </h1>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onFavoriteClick}
              className={`p-2 rounded-full transition-colors ${
                isFavorited ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onShareClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;
