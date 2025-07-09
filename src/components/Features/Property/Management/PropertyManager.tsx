import React, { useState, useEffect } from 'react';
import { useUserProperties, useCreateProperty, useUpdateProperty, useDeleteProperty, useTogglePropertyStatus, useUploadPropertyMedia } from '../../../../hooks/useProperties';
import { Property as PropertyType, PropertyFormData } from '../../../../types';

interface PropertyManagerProps {
  userId: string;
}

// Function to map frontend form data to API format
const mapFormDataToApi = (formData: PropertyFormData): any => ({
  city: formData.city || '',
  pincode: formData.pincode || '',
  contactNumber: formData.contactNumber || '',
  propertyName: formData.propertyName || '',
  propertyType: formData.propertyType || '',
  totalRooms: formData.totalRooms || 0,
  totalRent: formData.totalRent || 0,
  securityMoney: formData.securityMoney || 0,
  electricityIncluded: formData.electricityIncluded || false,
  kitchenAvailable: formData.kitchenAvailable || false,
  kitchenShared: formData.kitchenShared || false,
  washroomAvailable: formData.washroomAvailable || false,
  washroomShared: formData.washroomShared || false,
  smokingAlcoholAllowed: formData.smokingAlcoholAllowed || false,
  totalMembersAllowed: formData.totalMembersAllowed || 0,
  independentProperty: formData.independentProperty || false,
  propertyOwner: formData.propertyOwner || false,
  askingForRoommate: formData.askingForRoommate || false,
  roWater: formData.roWater || false,
  ac: formData.ac || false,
  foodServiceAvailable: formData.foodServiceAvailable || false,
  preferredGender: formData.preferredGender || '',
  description: formData.description || '',
  images: formData.images || [],
  availableFrom: formData.availableFrom || '',
  rules: formData.rules || [],
  nearbyPlaces: formData.nearbyPlaces || []
});

const PropertyManager: React.FC<PropertyManagerProps> = ({ userId }) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    city: '',
    pincode: '',
    contactNumber: '',
    propertyName: '',
    propertyType: '',
    totalRooms: 0,
    totalRent: 0,
    securityMoney: 0,
    electricityIncluded: false,
    kitchenAvailable: false,
    kitchenShared: false,
    washroomAvailable: false,
    washroomShared: false,
    smokingAlcoholAllowed: false,
    totalMembersAllowed: 0,
    independentProperty: false,
    propertyOwner: false,
    askingForRoommate: false,
    roWater: false,
    ac: false,
    foodServiceAvailable: false,
    preferredGender: '',
    description: '',
    images: [],
    availableFrom: '',
    rules: [],
    nearbyPlaces: []
  });
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const { data: properties = [], isLoading: isLoadingProperties, error, refetch } = useUserProperties(userId);

  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();
  const toggleStatusMutation = useTogglePropertyStatus();
  const uploadMediaMutation = useUploadPropertyMedia();

  useEffect(() => {
    if (editingPropertyId && properties.length > 0) {
      const propertyToEdit = properties.find((p: any) => p.id === editingPropertyId);
      if (propertyToEdit) {
        // Map the Property data (from API) to PropertyFormData structure
        // Use type assertion to handle discrepancies between API data and Property type
        const apiProperty = propertyToEdit as any;
        setFormData({
          city: apiProperty.city || apiProperty.location?.split(",")?.[0] || "",
          pincode: apiProperty.pincode || apiProperty.location?.split(",")?.[1]?.trim() || "",
          contactNumber: apiProperty.contactNumber || "",
          propertyName: apiProperty.propertyName || apiProperty.title || "",
          propertyType: apiProperty.propertyType || "",
          totalRooms: apiProperty.totalRooms || apiProperty.bedrooms || 0,
          totalRent: apiProperty.totalRent || apiProperty.price || 0,
          securityMoney: apiProperty.securityMoney || apiProperty.deposit || 0,
          electricityIncluded: apiProperty.electricityIncluded || false,
          kitchenAvailable: apiProperty.kitchenAvailable || apiProperty.amenities?.includes("Kitchen") || false,
          kitchenShared: apiProperty.kitchenShared || false,
          washroomAvailable: apiProperty.washroomAvailable || apiProperty.amenities?.includes("Bathroom") || false,
          washroomShared: apiProperty.washroomShared || false,
          smokingAlcoholAllowed: apiProperty.smokingAlcoholAllowed || false,
          totalMembersAllowed: apiProperty.totalMembersAllowed || apiProperty.members || 0,
          independentProperty: apiProperty.independentProperty || false,
          propertyOwner: apiProperty.propertyOwner || false,
          askingForRoommate: apiProperty.askingForRoommate || false,
          roWater: apiProperty.roWater || apiProperty.amenities?.includes("RO Water") || false,
          ac: apiProperty.ac || apiProperty.amenities?.includes("Air Conditioning") || false,
          foodServiceAvailable: apiProperty.foodServiceAvailable || apiProperty.amenities?.includes("Food Service") || false,
          preferredGender: apiProperty.preferredGender || apiProperty.genderPreference || "",
          description: apiProperty.description || "",
          images: apiProperty.images ? (Array.isArray(apiProperty.images) ? apiProperty.images : []) : [],
          availableFrom: apiProperty.availableFrom || apiProperty.availability?.availableFrom || apiProperty.availability?.moveInDate || "",
          rules: apiProperty.rules || [],
          nearbyPlaces: apiProperty.nearbyPlaces || []
        });
      }
    } else {
      setFormData({
        city: '',
        pincode: '',
        contactNumber: '',
        propertyName: '',
        propertyType: '',
        totalRooms: 0,
        totalRent: 0,
        securityMoney: 0,
        electricityIncluded: false,
        kitchenAvailable: false,
        kitchenShared: false,
        washroomAvailable: false,
        washroomShared: false,
        smokingAlcoholAllowed: false,
        totalMembersAllowed: 0,
        independentProperty: false,
        propertyOwner: false,
        askingForRoommate: false,
        roWater: false,
        ac: false,
        foodServiceAvailable: false,
        preferredGender: '',
        description: '',
        images: [],
        availableFrom: '',
        rules: [],
        nearbyPlaces: []
      });
    }
  }, [editingPropertyId, properties]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      setMediaFiles(fileArray);
      setFormData(prev => ({ ...prev, images: fileArray as any }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let propertyId = editingPropertyId;
      if (editingPropertyId) {
        await updatePropertyMutation.mutateAsync({
          id: editingPropertyId,
          data: mapFormDataToApi(formData)
        });
      } else {
        const newProperty = await createPropertyMutation.mutateAsync({
          ...mapFormDataToApi(formData),
          owner: userId
        });
        propertyId = newProperty?._id || '';
      }

      if (mediaFiles.length > 0 && propertyId) {
        const uploadData = new FormData();
        mediaFiles.forEach(file => uploadData.append('media', file));
        await uploadMediaMutation.mutateAsync({ id: propertyId, images: mediaFiles });
        setMediaFiles([]);
      }

      setEditingPropertyId(null);
      refetch();
      alert(editingPropertyId ? 'Property updated successfully' : 'Property created successfully');
    } catch (err) {
      console.error('Error submitting property:', err);
      alert(editingPropertyId ? 'Failed to update property' : 'Failed to create property');
    }
  };

  const handleEdit = (propertyId: string) => {
    setEditingPropertyId(propertyId);
  };

  const handleDelete = async (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deletePropertyMutation.mutateAsync(propertyId);
        refetch();
        alert('Property deleted successfully');
      } catch (err) {
        console.error('Error deleting property:', err);
        alert('Failed to delete property');
      }
    }
  };

  const handleToggleStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync({ id: propertyId, activate: !currentStatus });
      refetch();
      alert(currentStatus ? 'Property deactivated' : 'Property activated');
    } catch (err) {
      console.error('Error toggling property status:', err);
      alert('Failed to toggle property status');
    }
  };

  if (isLoadingProperties) return <div>Loading properties...</div>;
  if (error) return <div>Error loading properties: {(error as Error).message}</div>;

  return (
    <div className="property-manager p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Property Management</h2>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">{editingPropertyId ? 'Edit Property' : 'Add New Property'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input type="text" name="city" value={formData.city || ''} onChange={handleInputChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pincode</label>
            <input type="text" name="pincode" value={formData.pincode || ''} onChange={handleInputChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input type="text" name="contactNumber" value={formData.contactNumber || ''} onChange={handleInputChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Name</label>
            <input type="text" name="propertyName" value={formData.propertyName || ''} onChange={handleInputChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Property Type</label>
            <input type="text" name="propertyType" value={formData.propertyType || ''} onChange={handleInputChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Rooms</label>
            <input type="number" name="totalRooms" value={formData.totalRooms || 0} onChange={handleInputChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Rent (₹)</label>
            <input type="number" name="totalRent" value={formData.totalRent || 0} onChange={handleInputChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Security Money (₹)</label>
            <input type="number" name="securityMoney" value={formData.securityMoney || 0} onChange={handleInputChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Gender</label>
            <select name="preferredGender" value={formData.preferredGender || ''} onChange={handleInputChange} className="w-full p-2 border rounded" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="any">Any</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Available From</label>
            <input type="date" name="availableFrom" value={formData.availableFrom || ''} onChange={handleInputChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description || ''} onChange={handleInputChange} className="w-full p-2 border rounded" rows={3} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Images</label>
            <input type="file" name="images" multiple onChange={handleMediaChange} accept="image/*" className="w-full p-2 border rounded" />
          </div>
          <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input type="checkbox" name="electricityIncluded" checked={formData.electricityIncluded || false} onChange={handleInputChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Electricity Included</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="kitchenAvailable" checked={formData.kitchenAvailable || false} onChange={handleInputChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Kitchen Available</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="kitchenShared" checked={formData.kitchenShared || false} onChange={handleInputChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Kitchen Shared</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="washroomAvailable" checked={formData.washroomAvailable || false} onChange={handleInputChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Washroom Available</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="washroomShared" checked={formData.washroomShared || false} onChange={handleInputChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Washroom Shared</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="smokingAlcoholAllowed" checked={formData.smokingAlcoholAllowed || false} onChange={handleInputChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Smoking/Alcohol Allowed</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="independentProperty" checked={formData.independentProperty || false} onChange={handleInputChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Independent Property</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="propertyOwner" checked={formData.propertyOwner || false} onChange={handleInputChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Property Owner</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="askingForRoommate" checked={formData.askingForRoommate || false} onChange={handleInputChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Asking for Roommate</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="roWater" checked={formData.roWater || false} onChange={handleInputChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">RO Water</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="ac" checked={formData.ac || false} onChange={handleInputChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">AC Available</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="foodServiceAvailable" checked={formData.foodServiceAvailable || false} onChange={handleInputChange} className="mr-2" />
              <label className="text-sm font-medium text-gray-700">Food Service Available</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Members Allowed</label>
            <input type="number" name="totalMembersAllowed" value={formData.totalMembersAllowed || 0} onChange={handleInputChange} className="w-full p-2 border rounded" required />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setEditingPropertyId(null)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {editingPropertyId ? 'Update Property' : 'Add Property'}
          </button>
        </div>
      </form>

      <div className="property-list">
        <h3 className="text-xl font-semibold mb-4">Your Properties</h3>
        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <div key={property.id} className="border rounded-lg overflow-hidden shadow-lg">
                {property.images && property.images.length > 0 && (
                  <img src={property.images[0]} alt={property.propertyName} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h4 className="text-lg font-semibold">{property.propertyName}</h4>
                  <p className="text-gray-600">{property.city}, {property.pincode}</p>
                  <p className="text-gray-600">₹{property.totalRent}/month</p>
                  <p className="text-gray-600">Status: {property.isActive ? 'Active' : 'Inactive'}</p>
                  <div className="mt-2 flex justify-between">
                    <button onClick={() => handleEdit(property.id)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Edit
                    </button>
                    <button onClick={() => handleToggleStatus(property.id, property.isActive)} className={`px-3 py-1 text-white rounded ${property.isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}>
                      {property.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(property.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyManager;
