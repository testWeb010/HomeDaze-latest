
import React from 'react';

interface SearchFilters {
  location: string;
  priceRange: {
    min: number;
    max: number;
  };
  propertyType: string;
  genderPreference: string;
  amenities: string[];
  availableFrom?: string;
  bedrooms?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface PropertyFilterSidebarProps {
  showFilters: boolean;
  filters: SearchFilters;
  propertyTypes: string[];
  genderOptions: string[];
  bedroomOptions: string[];
  amenityOptions: string[];
  handleFilterChange: (key: keyof SearchFilters, value: any) => void;
  handleAmenityToggle: (amenity: string) => void;
  clearFilters: () => void;
}

const PropertyFilterSidebar: React.FC<PropertyFilterSidebarProps> = ({
  showFilters,
  filters,
  propertyTypes,
  genderOptions,
  bedroomOptions,
  amenityOptions,
  handleFilterChange,
  handleAmenityToggle,
  clearFilters
}) => {
  if (!showFilters) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-80 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Filter Properties</h3>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Property Type</label>
        <select
          value={filters.propertyType || ''}
          onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">All Types</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          value={filters.location || ''}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter location"
        />
      </div>

      {/* Gender Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Gender Preference</label>
        <select
          value={filters.genderPreference || ''}
          onChange={(e) => handleFilterChange('genderPreference', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Any</option>
          {genderOptions.map((gender) => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
        <select
          value={filters.bedrooms || ''}
          onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Any</option>
          {bedroomOptions.map((bedroom) => (
            <option key={bedroom} value={bedroom}>{bedroom}</option>
          ))}
        </select>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Amenities</label>
        <div className="space-y-2">
          {amenityOptions.map((amenity) => (
            <div key={amenity} className="flex items-center">
              <input
                id={`amenity-${amenity}`}
                type="checkbox"
                checked={filters.amenities?.includes(amenity) || false}
                onChange={() => handleAmenityToggle(amenity)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Price Range</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={filters.priceRange?.min || ''}
            onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: Number(e.target.value) })}
            className="mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Min"
          />
          <input
            type="number"
            value={filters.priceRange?.max || ''}
            onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: Number(e.target.value) })}
            className="mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default PropertyFilterSidebar;
