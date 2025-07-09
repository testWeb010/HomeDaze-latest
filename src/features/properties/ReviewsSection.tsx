import React from 'react';
import { Star } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: {
    overall: number;
    cleanliness: number;
    location: number;
    valueForMoney: number;
    count: number;
  };
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
}) => {
  // Utility function to render stars, moved here for now
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Property Reviews</h3>

      {/* Overall Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {reviews.overall}
          </div>
          {renderStars(reviews.overall)}
          <p className="text-sm text-gray-600 mt-2">
            Based on {reviews.count} reviews
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cleanliness</span>
            <div className="flex items-center">
              {renderStars(reviews.cleanliness)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Location</span>
            <div className="flex items-center">
              {renderStars(reviews.location)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Value for Money</span>
            <div className="flex items-center">
              {renderStars(reviews.valueForMoney)}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        {reviews.count === 0 ? (
          <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this property!</p>
        ) : (
           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View All Reviews
          </button>
        )}
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-2">
          Write a Review
        </button>

      </div>
    </div>
  );
};

export default ReviewsSection;
