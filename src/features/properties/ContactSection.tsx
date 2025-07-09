import React from 'react';
import { Phone, AlertCircle } from 'lucide-react';
import { PropertyFormData, PropertyFormErrors } from '../../types';

interface ContactSectionProps {
  formData: PropertyFormData;
  errors: PropertyFormErrors;
  handleInputChange: (field: keyof PropertyFormData, value: any) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Phone className="h-5 w-5 mr-2 text-blue-600" />
        Contact Information
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Number *
        </label>
        <input
          type="tel"
          value={formData.contactNumber}
          onChange={(e) => handleInputChange('contactNumber', e.target.value)}
          placeholder="Enter Your Contact Number"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.contactNumber ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.contactNumber && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.contactNumber}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactSection;
