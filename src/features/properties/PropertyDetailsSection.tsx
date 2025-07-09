import React from 'react';
import { Home, AlertCircle } from 'lucide-react';
import { PropertyFormData, PropertyFormErrors } from '../../types';

interface PropertyDetailsSectionProps {
  formData: PropertyFormData;
  errors: PropertyFormErrors;
  handleInputChange: (field: keyof PropertyFormData, value: any) => void;
  propertyTypes: string[];
}

const PropertyDetailsSection: React.FC<PropertyDetailsSectionProps> = ({
  formData,
  errors,
  handleInputChange,
  propertyTypes,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Home className="h-5 w-5 mr-2 text-blue-600" />
        Property Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Name *
          </label>
          <input
            type="text"
            value={formData.propertyName}
            onChange={(e) => handleInputChange('propertyName', e.target.value)}
            placeholder="Enter Property Name"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.propertyName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.propertyName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.propertyName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type *
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) => handleInputChange('propertyType', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.propertyType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Property Type</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.propertyType && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.propertyType}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Rooms *
          </label>
          <input
            type="number"
            min="1"
            value={formData.totalRooms}
            onChange={(e) => handleInputChange('totalRooms', parseInt(e.target.value))}
            placeholder="Enter total number of rooms"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.totalRooms ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.totalRooms && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.totalRooms}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Rent *
          </label>
          <input
            type="number"
            min="0"
            value={formData.totalRent}
            onChange={(e) => handleInputChange('totalRent', parseInt(e.target.value))}
            placeholder="Enter total rent"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.totalRent ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.totalRent && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.totalRent}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Security Money
          </label>
          <input
            type="number"
            min="0"
            value={formData.securityMoney}
            onChange={(e) => handleInputChange('securityMoney', parseInt(e.target.value))}
            placeholder="Enter Security Money"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsSection;
