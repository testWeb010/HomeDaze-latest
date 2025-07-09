import React from 'react';
import { Users, Eye, UserCheck, AlertCircle } from 'lucide-react';
import { PropertyFormData, PropertyFormErrors } from '../../types';

interface AdditionalInfoSectionProps {
  formData: PropertyFormData;
  errors: PropertyFormErrors;
  handleInputChange: (field: keyof PropertyFormData, value: any) => void;
  genderOptions: string[];
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  formData,
  errors,
  handleInputChange,
  genderOptions,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Users className="h-5 w-5 mr-2 text-blue-600" />
        Additional Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Members Allowed *
          </label>
          <input
            type="number"
            min="1"
            value={formData.totalMembersAllowed}
            onChange={(e) => handleInputChange('totalMembersAllowed', parseInt(e.target.value))}
            placeholder="Enter number of members allowed"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.totalMembersAllowed ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.totalMembersAllowed && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.totalMembersAllowed}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Gender *
          </label>
          <select
            value={formData.preferredGender}
            onChange={(e) => handleInputChange('preferredGender', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.preferredGender ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Gender</option>
            {genderOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.preferredGender && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.preferredGender}
            </p>
          )}
        </div>
      </div>

      {/* Property Surveillance */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Eye className="h-5 w-5 mr-2 text-gray-600" />
          Property Surveillance
        </h3>
        <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={formData.independentProperty}
            onChange={(e) => handleInputChange('independentProperty', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Independent Property</span>
        </label>
      </div>

      {/* Ownership */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <UserCheck className="h-5 w-5 mr-2 text-gray-600" />
          Ownership
        </h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="ownership"
              checked={formData.propertyOwner}
              onChange={() => {
                handleInputChange('propertyOwner', true);
                handleInputChange('askingForRoommate', false);
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Property Owner</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="ownership"
              checked={formData.askingForRoommate}
              onChange={() => {
                handleInputChange('askingForRoommate', true);
                handleInputChange('propertyOwner', false);
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Asking for Roommate</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoSection;
