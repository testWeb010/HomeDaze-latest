import React from 'react';
import { X, Phone, Mail } from 'lucide-react';
import { Property } from '../../types'; // Import the Property interface

interface ContactModalProps {
  show: boolean;
  onClose: () => void;
  owner: Property['owner']; // Use the owner type from the Property interface
}

const ContactModal: React.FC<ContactModalProps> = ({
  show,
  onClose,
  owner,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Contact Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="text-center mb-6">
          <img
            src={owner.avatar}
            alt={owner.name}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
          />
          <h4 className="text-lg font-semibold text-gray-900">{owner.name}</h4>
          <p className="text-gray-600">Property Owner</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-600 mr-3" />
              <span className="font-medium">{owner.phone}</span>
            </div>
            <a href={`tel:${owner.phone}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Call
            </a>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-600 mr-3" />
              <span className="font-medium">{owner.email}</span>
            </div>
             <a href={`mailto:${owner.email}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Email
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ContactModal;
