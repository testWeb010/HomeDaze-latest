import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  currentImageIndex: number;
  title: string;
  verified: boolean;
  featured: boolean;
  nextImage: () => void;
  prevImage: () => void;
  setCurrentImageIndex: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  currentImageIndex,
  title,
  verified,
  featured,
  nextImage,
  prevImage,
  setCurrentImageIndex,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex space-x-2">
            {verified && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Verified
              </span>
            )}
            {featured && (
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="p-4 bg-gray-50">
          <div className="flex space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
