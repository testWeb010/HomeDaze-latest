import React from 'react';
import { MessageCircle, Calendar, Share2 } from 'lucide-react';

interface QuickActionsProps {
  onChatWithOwnerClick: () => void;
  onBookSiteVisitClick: () => void;
  onSharePropertyClick: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onChatWithOwnerClick,
  onBookSiteVisitClick,
  onSharePropertyClick,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

      <div className="space-y-3">
        <button
          onClick={onChatWithOwnerClick}
          className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Chat with Owner</span>
        </button>

        <button
          onClick={onBookSiteVisitClick}
          className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Calendar className="h-4 w-4" />
          <span>Book Site Visit</span>
        </button>

        <button
          onClick={onSharePropertyClick}
          className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>Share Property</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
