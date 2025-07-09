
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Heart, Share2 } from 'lucide-react';
import PricingCard from '../features/properties/PricingCard';
import { Property } from '../types';
import { useAuth } from '../hooks/useAuth';
import { propertyService, Property as PropertyType } from '../services/propertyService';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorited, setIsFavorited] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<PropertyType>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  // Mock property data - fix amenities type
  const property: Property = {
    id: id || '1',
    title: 'Modern PG in Koramangala',
    price: 12000,
    location: 'Koramangala, Bangalore',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 450,
    image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg',
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg',
      'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
    ],
    featured: true,
    verified: true,
    owner: {
      id: '1',
      name: 'Rajesh Kumar',
      phone: '+91 9876543210',
      email: 'rajesh@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      verified: true,
      responseTime: '5 mins',
      rating: 4.8
    },
    deposit: 24000,
    totalCost: 36000,
    location_details: {
      address: 'Koramangala 5th Block, Bangalore',
      coordinates: { lat: 12.9352, lng: 77.6245 }
    },
    reviews: {
      overall: 4.8,
      cleanliness: 4.9,
      location: 4.7,
      valueForMoney: 4.6,
      count: 23
    },
    amenities: [
      { icon: '⚡', name: 'Electricity', available: true },
      { icon: '🍳', name: 'Kitchen', available: true },
      { icon: '🚿', name: 'Washroom', available: true },
      { icon: '❄️', name: 'AC', available: true },
      { icon: '💧', name: 'RO Water', available: true },
      { icon: '🍽️', name: 'Food Service', available: true }
    ],
    description: 'A modern and well-maintained PG in the heart of Koramangala, perfect for students and young professionals.',
    propertyType: 'PG',
    genderPreference: 'Male Only',
    availability: { available: true, availableFrom: '2024-02-01' },
    members: 4,
    currentOccupancy: 2,
    rules: ['No smoking', 'No drinking', 'No loud music after 10 PM'],
    nearbyPlaces: ['Koramangala Metro Station', 'Forum Mall', 'Cafe Coffee Day'],
    createdAt: '2024-01-15T00:00:00Z',
    isActive: true
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleEdit = () => {
    setForm({ ...property });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await propertyService.deleteProperty(property._id!);
      setFeedback('Property deleted successfully.');
      setTimeout(() => window.location.href = '/properties', 1000);
    } catch (e: any) {
      setFeedback(e.message || 'Failed to delete property');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await propertyService.updateProperty(property._id!, form);
      setFeedback('Property updated successfully.');
      setShowModal(false);
    } catch (e: any) {
      setFeedback(e.message || 'Failed to update property');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Properties</span>
            </button>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsFavorited(!isFavorited)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorited 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="flex justify-end mb-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2" onClick={handleEdit}>Edit</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={handleDelete}>Delete</button>
        </div>
      )}
      {feedback && <div className="text-center text-green-600 mb-2">{feedback}</div>}
      {/* Property Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Property</h2>
            <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Title" value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Location" value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} required />
            <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Price" type="number" value={form.price || 0} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} required />
            <textarea className="w-full mb-3 px-3 py-2 border rounded" placeholder="Description" value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} required />
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96">
                <img 
                  src={property.images?.[0] || 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  1 / {property.images?.length || 1}
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    ₹{property.price.toLocaleString()}
                  </div>
                  <div className="text-gray-600">per month</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.area}</div>
                  <div className="text-gray-600">sq ft</div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {property.amenities.map((amenity, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {amenity.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PricingCard 
              price={property.price}
              currency="INR"
              rentIncludes={property.amenities.map(a => a.name)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
