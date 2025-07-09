import React from 'react';
import {
  MapPin,
  Bed,
  Bath,
  Users,
  Square,
  CheckCircle,
  X,
  Calendar,
  Clock,
} from 'lucide-react';
import { Property } from '../../types'; // Assuming a types file will be created or exists

interface PropertyDetailsProps {
  property: Property;
  showAllAmenities: boolean;
  setShowAllAmenities: (show: boolean) => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  showAllAmenities,
  setShowAllAmenities,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {property.title}
          </h2>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="text-lg">{property.location_details.address}</span>
          </div>

          {/* Property Type & Gender Badge */}
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {property.propertyType}
            </span>
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
              {property.genderPreference}
            </span>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Bed className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
          <div className="text-sm text-gray-600">Bedrooms</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Bath className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
          <div className="text-sm text-gray-600">Bathrooms</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{property.members}</div>
          <div className="text-sm text-gray-600">Max Members</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Square className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{property.area}</div>
          <div className="text-sm text-gray-600">Sq Ft</div>
        </div>
      </div>

      {/* Rent Includes & Excludes */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Rent Includes & Excludes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {property.amenities.slice(0, showAllAmenities ? property.amenities.length : 6).map((amenity, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg border ${
                amenity.available
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <amenity.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{amenity.name}</span>
              {amenity.available ? (
                <CheckCircle className="h-4 w-4 ml-auto" />
              ) : (
                <X className="h-4 w-4 ml-auto" />
              )}
            </div>
          ))}
        </div>
        {property.amenities.length > 6 && (
          <button
            onClick={() => setShowAllAmenities(!showAllAmenities)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAllAmenities ? 'Show Less' : `Show All ${property.amenities.length} Amenities`}
          </button>
        )}
      </div>

      {/* Description */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
        <p className="text-gray-700 leading-relaxed">{property.description}</p>
      </div>

      {/* Availability */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Availability</h3>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center px-4 py-2 rounded-lg ${
            property.availability.available
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            <Calendar className="h-5 w-5 mr-2" />
            <span className="font-medium">
              {property.availability.available ? 'Available' : 'Not Available'}
            </span>
          </div>
          {property.availability.available && (
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>Available from {new Date(property.availability.availableFrom).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
