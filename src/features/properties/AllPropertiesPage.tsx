import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useProperties, usePropertyFilters, useUniqueCities } from '../../hooks/useProperties';
import PropertyFilterSidebar from './PropertyFilterSidebar';
import PropertyListContainer from './PropertyListContainer';
import LoadingSpinner from '../LoadingSpinner';
import { PropertySearchParams } from '../../services/propertyService';

interface LocalSearchFilters {
  propertyType: string;
  genderPreference: string;
  bedrooms: string;
  priceRange: { min: number; max: number };
  location: string;
  amenities: string[];
  availableFrom?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface AllPropertiesPageProps {
  onPropertyClick: () => void;
}

const AllPropertiesPage: React.FC<AllPropertiesPageProps> = ({ onPropertyClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<LocalSearchFilters>({
    propertyType: '',
    genderPreference: '',
    bedrooms: '',
    priceRange: { min: 0, max: 50000 },
    location: '',
    amenities: [],
    availableFrom: ''
  });

  // API hooks
  const propertiesHook = useProperties({
    page: 1,
    limit: 12,
  });

  const propertyFilters = usePropertyFilters();
  const { data: cities } = useUniqueCities();

  // Filter options
  const propertyTypes = ['Apartment', 'Single Room', 'PG', 'House', 'Villa'];
  const genderOptions = ['Male', 'Female', 'Family', 'No Preference'];
  const bedroomOptions = ['1', '2', '3', '4', '5+'];
  const amenityOptions = ['Verified', 'Smoking & Drinking', 'Independent', 'Electricity', 'AC', 'WiFi', 'Parking'];

  // Load initial properties
  useEffect(() => {
    propertiesHook.loadPage(1);
  }, []);

  // Handle search query change
  useEffect(() => {
    if (searchQuery.trim()) {
      const searchFilters = {
        location: searchQuery,
        priceRange: filters.priceRange,
        propertyType: filters.propertyType,
        genderPreference: filters.genderPreference,
        amenities: filters.amenities,
        availableFrom: filters.availableFrom,
        bedrooms: filters.bedrooms,
        city: searchQuery,
        minPrice: filters.priceRange.min,
        maxPrice: filters.priceRange.max,
      };
      propertyFilters.debouncedSearch(searchFilters);
    } else {
      propertiesHook.loadPage(1);
    }
  }, [searchQuery, filters]);

  const handleFilterChange = (key: keyof LocalSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      genderPreference: '',
      bedrooms: '',
      priceRange: { min: 0, max: 50000 },
      location: '',
      amenities: [],
      availableFrom: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>

              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <span className="text-sm text-gray-600">
                {propertiesHook.data?.length || propertyFilters.results?.data?.length || 0} Properties Found
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <PropertyFilterSidebar
            showFilters={showFilters}
            filters={filters}
            propertyTypes={propertyTypes}
            genderOptions={genderOptions}
            bedroomOptions={bedroomOptions}
            amenityOptions={amenityOptions}
            handleFilterChange={handleFilterChange}
            handleAmenityToggle={handleAmenityToggle}
            clearFilters={clearFilters}
          />

          {/* Properties Grid/List Container */}
          {(propertiesHook.loading || propertyFilters.loading) ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <PropertyListContainer
              properties={searchQuery.trim() ? 
                (propertyFilters.results?.data || []) : 
                (propertiesHook.data || [])
              }
              viewMode={viewMode}
              currentPage={propertiesHook.pagination.page}
              totalPages={propertiesHook.pagination.totalPages}
              onViewModeChange={setViewMode}
              onPageChange={(page: number) => propertiesHook.goToPage(page)}
              onPropertyClick={onPropertyClick}
              searchQuery={searchQuery}
              filters={filters}
              loading={propertiesHook.loading || propertyFilters.loading}
              error={propertiesHook.error || propertyFilters.error}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPropertiesPage;
