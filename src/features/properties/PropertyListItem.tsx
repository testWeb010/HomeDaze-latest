
import React from 'react';
import { MapPin, MessageCircle, Phone, Star, Edit, Trash2 } from 'lucide-react';
import { Property } from '../../types';

interface PropertyListItemProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (id: string) => void;
}

const PropertyListItem: React.FC<PropertyListItemProps> = ({ property, onEdit, onDelete }) => {
  const amenityIcons = [
    { icon: '⚡', name: 'Electricity', available: true },
    { icon: '🍳', name: 'Kitchen', available: true },
    { icon: '🚿', name: 'Washroom', available: true },
    { icon: '❄️', name: 'AC', available: true },
    { icon: '💧', name: 'RO Water', available: true },
    { icon: '🍽️', name: 'Food Service', available: true },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(rating) 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600 font-medium">({rating})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative">
      {/* Admin Controls */}
      {(onEdit || onDelete) && (
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          {onEdit && (
            <button onClick={e => { e.stopPropagation(); onEdit(property); }} className="p-1 bg-blue-100 hover:bg-blue-200 rounded-full">
              <Edit className="w-4 h-4 text-blue-600" />
            </button>
          )}
          {onDelete && (
            <button onClick={e => { e.stopPropagation(); onDelete(property._id!); }} className="p-1 bg-red-100 hover:bg-red-200 rounded-full">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/3">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
        </div>
        
        <div className="flex-1 p-6">
          {/* Price & Title */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(property.price)}
              </span>
              <span className="text-gray-600 text-sm">/month</span>
            </div>
            {property.propertyType && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                {property.propertyType}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">{property.location}</span>
          </div>
          
          {/* Amenities */}
          <div className="flex flex-wrap gap-1 mb-4">
            {amenityIcons.slice(0, 6).map((amenity) => (
              <span
                key={amenity.name}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium flex items-center space-x-1"
              >
                <span>{amenity.icon}</span>
                <span>{amenity.name}</span>
              </span>
            ))}
          </div>

          {/* Owner Info & Actions */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {property.owner?.name?.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{property.owner?.name}</p>
                  <div className="flex items-center space-x-2">
                    {property.owner?.rating !== undefined && renderStars(property.owner?.rating)}
                    <span className="text-xs text-gray-500">• Responds in {property.owner?.responseTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all text-sm font-semibold flex items-center justify-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Chat Now</span>
              </button>
              <button className="flex-1 border-2 border-blue-600 text-blue-600 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm font-semibold flex items-center justify-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Call</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListItem;
