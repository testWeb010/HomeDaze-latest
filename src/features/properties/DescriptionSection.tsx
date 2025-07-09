import React from 'react';
import { AlertCircle } from 'lucide-react';
import { PropertyFormData, PropertyFormErrors } from '../../types';

interface DescriptionSectionProps {
  formData: PropertyFormData;
  errors: PropertyFormErrors;
  handleInputChange: (field: keyof PropertyFormData, value: any) => void;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description *
      </label>
      <textarea
        value={formData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        placeholder="Tell us more about your property..."
        rows={6}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
          errors.description ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      <div className="flex justify-between items-center mt-2">
        {errors.description && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.description}
          </p>
        )}
        <p className="text-sm text-gray-500 ml-auto">
          {formData.description.length}/500 characters
        </p>
      </div>
    </div>
  );
};

export default DescriptionSection;
