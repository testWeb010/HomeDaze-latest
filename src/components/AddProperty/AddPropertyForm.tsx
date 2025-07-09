import React, { useState } from 'react';
import { PropertyFormData, PropertyFormErrors, ApiEndpoints } from '../../types'; // Import ApiEndpoints
import { sanitizeInput } from '../../utils/sanitize';
import LocationSection from './LocationSection';
import ContactSection from './ContactSection';
import PropertyDetailsSection from './PropertyDetailsSection';
import AmenitiesSection from './AmenitiesSection';
import AdditionalInfoSection from './AdditionalInfoSection';
import DescriptionSection from './DescriptionSection';
import ImageUploadSection from './ImageUploadSection';
import SubmitButton from './SubmitButton';
import SuccessMessage from './SuccessMessage';

const AddPropertyForm: React.FC = () => {
  const [formData, setFormData] = useState<PropertyFormData>({
    city: '',
    pincode: '',
    contactNumber: '',
    propertyName: '',
    propertyType: '',
    totalRooms: 1,
    totalRent: 0,
    securityMoney: 0,
    electricityIncluded: false,
    kitchenAvailable: false,
    kitchenShared: false,
    washroomAvailable: false,
    washroomShared: false,
    smokingAlcoholAllowed: false,
    totalMembersAllowed: 1,
    independentProperty: false,
    propertyOwner: true,
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

  const [errors, setErrors] = useState<PropertyFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const propertyTypes = [
    'Apartment',
    'House',
    'Villa',
    'Studio',
    'Shared Room',
    'PG',
    'Hostel',
    'Independent Floor'
  ];

  const genderOptions = [
    'No Preference',
    'Male Only',
    'Female Only',
    'Family'
  ];

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: typeof value === 'string' ? sanitizeInput(value) : value }));

    // Clear error when user starts typing for the specific field
    if (errors[field as keyof PropertyFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Optional: Implement logic to limit file count or size here if not handled by backend
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: PropertyFormErrors = {};

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.propertyName.trim()) {
      newErrors.propertyName = 'Property name is required';
    }

    if (!formData.propertyType) {
      newErrors.propertyType = 'Please select a property type';
    }

    if (formData.totalRooms < 1) {
      newErrors.totalRooms = 'Total rooms must be at least 1';
    }

    if (formData.totalRent <= 0) {
      newErrors.totalRent = 'Rent amount is required';
    }

    if (formData.totalMembersAllowed < 1) {
      newErrors.totalMembersAllowed = 'At least 1 member must be allowed';
    }

    if (!formData.preferredGender) {
      newErrors.preferredGender = 'Please select preferred gender';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Property description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const formPayload = new FormData();

    Object.keys(formData).forEach(key => {
      if (key !== 'images' && key !== 'rules' && key !== 'nearbyPlaces') {
        const value = formData[key as keyof PropertyFormData];
        formPayload.append(key, typeof value === 'string' ? sanitizeInput(value) : String(value));
      }
    });

    formPayload.append('rules', JSON.stringify(formData.rules.map(item => sanitizeInput(item))));
    formPayload.append('nearbyPlaces', JSON.stringify(formData.nearbyPlaces.map(item => sanitizeInput(item))));

    formData.images.forEach((image) => {
      formPayload.append('images', image);
    });

    try {
      const apiEndpoints: ApiEndpoints = {
        auth: { register: '/api/auth/register', login: '/api/auth/login', verifyEmail: '/api/auth/verify-email', forgotPassword: '/api/auth/forgot-password', resetPassword: '/api/auth/reset-password', googleRequest: '/api/auth/google-request', google: '/api/auth/google' },
        posts: { addPost: '/api/posts/addpost', getPosts: '/api/posts/getpost', getPostById: '/api/posts/get-post-by-id/:id', getPopularPosts: '/api/posts/get-popular-posts', getPostByUser: '/api/posts/get-post-by-user/:userId', getPostByLocation: '/api/posts/get-post-by-location/:city', activatePost: '/api/posts/activate-post/:postid', deletePost: '/api/posts/delete-post/:postid', subscription: '/api/posts/subscription/:postid', uniqueCities: '/api/posts/unique-cities', addMedia: '/api/posts/add-media/:postid', editPost: '/api/posts/edit-post/:postId' },
        user: { getUserById: '/api/user/get-user-by-id/:id', getUser: '/api/user/', changePassword: '/api/user/change-password', checkUsername: '/api/user/check-username' },
        payment: { pay: '/api/payment/pay', verify: '/api/payment/verify', changePlan: '/api/payment/change-plan/:planId' },
        contact: { contactUs: '/api/contact/contact-us', subscribers: '/api/contact/Subscribers' },
        coupon: { getAllCoupons: '/api/coupon/get-all-coupons', generateCoupon: '/api/coupon/generate-coupon', deleteCoupon: '/api/coupon/delete-coupon/:couponId', toggleCouponStatus: '/api/coupon/toggle-coupon-status/:couponId', verifyCoupon: '/api/coupon/verify-coupon' },
        membership: { getMemberships: '/api/membership/' },
        admin: { getStats: '/api/admin/get-stats', getAllUsers: '/api/admin/get-all-user', getAllMembershipUsers: '/api/admin/get-all-membership-users', getAllMemberships: '/api/admin/get-all-memberships', deleteUser: '/api/admin/delete-user-by-id/:userId', updatePost: '/api/admin/update-post/:postId', updateUser: '/api/admin/update-user-by-id/:id', getAllPosts: '/api/admin/get-all-posts', getPostByUserId: '/api/admin/get-post-by-user-id/:userId', deletePost: '/api/admin/delete-post-by-id/:postId', getAllPendingPosts: '/api/admin/get-all-pending-posts', updateMemberships: '/api/admin/update-memberships/:membershipId', getAllContacts: '/api/admin/get-all-contacts', getAllOrders: '/api/admin/get-all-orders', getAllAdmins: '/api/admin/get-all-admins', removeAdminRole: '/api/admin/remove-admin-role', recentAdminActivities: '/api/admin/recent-admin-activities' }
     };

      const response = await fetch(apiEndpoints.posts.addPost, {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add property');
      }

      const result = await response.json();
      console.log('Property added successfully:', result);

      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          city: '',
          pincode: '',
          contactNumber: '',
          propertyName: '',
          propertyType: '',
          totalRooms: 1,
          totalRent: 0,
          securityMoney: 0,
          electricityIncluded: false,
          kitchenAvailable: false,
          kitchenShared: false,
          washroomAvailable: false,
          washroomShared: false,
          smokingAlcoholAllowed: false,
          totalMembersAllowed: 1,
          independentProperty: false,
          propertyOwner: true,
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
        setErrors({}); 
      }, 3000); 

    } catch (error) {
      console.error('Error submitting property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return <SuccessMessage onListAnother={() => {
        setSubmitSuccess(false);
         setFormData({
            city: '',
            pincode: '',
            contactNumber: '',
            propertyName: '',
            propertyType: '',
            totalRooms: 1,
            totalRent: 0,
            securityMoney: 0,
            electricityIncluded: false,
            kitchenAvailable: false,
            kitchenShared: false,
            washroomAvailable: false,
            washroomShared: false,
            smokingAlcoholAllowed: false,
            totalMembersAllowed: 1,
            independentProperty: false,
            propertyOwner: true,
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
          setErrors({});
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Add A Property
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            List your property and connect with potential tenants. Fill out the form below with accurate details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          <LocationSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          <ContactSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          <PropertyDetailsSection
            formData={formData}
            errors={errors}
            propertyTypes={propertyTypes}
            handleInputChange={handleInputChange}
          />

          <AmenitiesSection
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <AdditionalInfoSection
            formData={formData}
            genderOptions={genderOptions}
            handleInputChange={handleInputChange}
            errors={errors}
          />

          <DescriptionSection
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />

          <ImageUploadSection
            formData={formData}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
          />

          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
};

export default AddPropertyForm;
