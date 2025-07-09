
import React from 'react';
import {
  Zap,
  ChefHat,
  Bath,
  Cigarette,
  Droplets,
  Wind,
  UtensilsCrossed,
  Users // Added Users icon
} from 'lucide-react';
import { PropertyFormData } from '../../types';

interface AmenitiesSectionProps {
  formData: PropertyFormData;
  handleInputChange: (field: keyof PropertyFormData, value: any) => void;
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Zap className="h-5 w-5 mr-2 text-blue-600" />
        Amenities & Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={formData.electricityIncluded}
            onChange={(e) => handleInputChange('electricityIncluded', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <Zap className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">Electricity Included</span>
        </label>

        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={formData.kitchenAvailable}
            onChange={(e) => handleInputChange('kitchenAvailable', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <ChefHat className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">Kitchen Available</span>
        </label>

        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={formData.kitchenShared}
            onChange={(e) => handleInputChange('kitchenShared', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <Users className="h-5 w-5 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">Kitchen Shared</span>
        </label>

        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={formData.washroomAvailable}
            onChange={(e) => handleInputChange('washroomAvailable', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <Bath className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Washroom Available</span>
        </label>

        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={formData.washroomShared}
            onChange={(e) => handleInputChange('washroomShared', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <Users className="h-5 w-5 text-teal-500" />
          <span className="text-sm font-medium text-gray-700">Washroom Shared</span>
        </label>

        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={formData.smokingAlcoholAllowed}
            onChange={(e) => handleInputChange('smokingAlcoholAllowed', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <Cigarette className="h-5 w-5 text-red-500" />
          <span className="text-sm font-medium text-gray-700">Smoking & Alcohol Allowed</span>
        </label>

        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={formData.roWater}
            onChange={(e) => handleInputChange('roWater', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <Droplets className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-medium text-gray-700">RO Water</span>
        </label>

        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={formData.ac}
            onChange={(e) => handleInputChange('ac', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <Wind className="h-5 w-5 text-cyan-500" />
          <span className="text-sm font-medium text-gray-700">AC</span>
        </label>

        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={formData.foodServiceAvailable}
            onChange={(e) => handleInputChange('foodServiceAvailable', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <UtensilsCrossed className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-gray-700">Food Service Available</span>
        </label>
      </div>
    </div>
  );
};

export default AmenitiesSection;
