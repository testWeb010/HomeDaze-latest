import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  onListAnother: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  onListAnother
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Listed Successfully!</h2>
        <p className="text-gray-600 mb-6">
          Your property has been submitted for review. We'll notify you once it's approved and live on the platform.
        </p>
        <button
          onClick={onListAnother}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          List Another Property
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
