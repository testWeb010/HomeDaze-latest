
import React from 'react';
import { Grid, List } from 'lucide-react';
import PropertyCard from './PropertyCard';
import PropertyListItem from './PropertyListItem';
import Pagination from './Pagination';
import { Property } from '../../types';

interface PropertyListContainerProps {
  properties: Property[];
  viewMode: 'grid' | 'list';
  currentPage: number;
  totalPages: number;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onPageChange: (page: number) => void;
  onPropertyClick: (property: Property) => void;
  searchQuery: string;
  filters: any;
}

const PropertyListContainer: React.FC<PropertyListContainerProps> = ({
  properties,
  viewMode,
  currentPage,
  totalPages,
  onViewModeChange,
  onPageChange,
  onPropertyClick
}) => {
  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
        <p className="text-gray-600">
          Showing {properties.length} properties
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Properties Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onClick={() => onPropertyClick(property)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <PropertyListItem key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default PropertyListContainer;
