
import React from 'react';
import { MapPin } from 'lucide-react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
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

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer" onClick={onClick}>
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </span>
            <span className="text-gray-600 text-sm">/month</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {amenityIcons.slice(0, 4).map((amenity) => (
            <span
              key={amenity.name}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium flex items-center space-x-1"
            >
              <span>{amenity.icon}</span>
              <span>{amenity.name}</span>
            </span>
          ))}
          {amenityIcons.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{amenityIcons.length - 4} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
