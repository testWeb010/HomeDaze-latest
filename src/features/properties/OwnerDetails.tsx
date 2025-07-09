import React from 'react';
import { Phone, Mail, CheckCircle } from 'lucide-react';

interface OwnerDetailsProps {
  owner: {
    name: string;
    phone: string;
    email: string;
    avatar: string;
    verified: boolean;
  };
  onRevealContactInfoClick: () => void;
}

const OwnerDetails: React.FC<OwnerDetailsProps> = ({
  owner,
  onRevealContactInfoClick,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>

      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <img
            src={owner.avatar}
            alt={owner.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {owner.verified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{owner.name}</h4>
          <p className="text-sm text-gray-600">Property Owner</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* These will likely be hidden or partially masked initially */}
        <div className="flex items-center text-gray-600">
          <Phone className="h-4 w-4 mr-3" />
          <span className="text-sm">+91 ••••• ••••0</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Mail className="h-4 w-4 mr-3" />
          <span className="text-sm">••••••@email.com</span>
        </div>
      </div>

      <button
        onClick={onRevealContactInfoClick}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Reveal Contact Info
      </button>
    </div>
  );
};

export default OwnerDetails;
