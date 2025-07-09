import React from 'react';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting
}) => {
  return (
    <div className="text-center">
      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5'
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Adding Property...</span>
          </div>
        ) : (
          'Add Property'
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
