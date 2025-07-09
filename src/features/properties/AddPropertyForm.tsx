import React, { useState } from 'react';
import {
  // Keep necessary imports, none of these seem to be directly used here anymore
} from 'lucide-react';
import { PropertyFormData, PropertyFormErrors, ApiEndpoints } from '../../types'; // Import ApiEndpoints
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

    // Add validation for other fields if needed, e.g., availableFrom, rules, nearbyPlaces

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error field if needed for better UX
      return;
    }

    setIsSubmitting(true);

    const formPayload = new FormData();

    // Append text/number/boolean data
    Object.keys(formData).forEach(key => {
        if (key !== 'images' && key !== 'rules' && key !== 'nearbyPlaces') {
            formPayload.append(key, formData[key as keyof PropertyFormData] as string | Blob);
        }
    });

    // Append rules and nearbyPlaces arrays (assuming backend expects stringified JSON or similar)
    // Adjust this based on your backend's expected format for arrays
    formPayload.append('rules', JSON.stringify(formData.rules));
    formPayload.append('nearbyPlaces', JSON.stringify(formData.nearbyPlaces));


    // Append image files
    formData.images.forEach((image) => {
        formPayload.append(`images`, image); // Append each file
    });


    try {
      // Use the API endpoint from types
      const apiEndpoints: ApiEndpoints = { // Assuming ApiEndpoints is defined as a const object
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
        body: formPayload, // FormData handles Content-Type and boundary
        // Optional: include headers like Authorization if required by your API
        // headers: { 'Authorization': `Bearer YOUR_AUTH_TOKEN` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add property');
      }

      // Assuming success returns a JSON response
      const result = await response.json();
      console.log('Property added successfully:', result);

      setSubmitSuccess(true);

      // Reset form after successful submission
      // You might want to wait for user action instead of a fixed timeout
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
        setErrors({}); // Clear errors on success
      }, 3000); // Auto-hide success message after 3 seconds

    } catch (error) {
      console.error('Error submitting property:', error);
      // Optional: Set an error state to display a user-friendly error message on the form
      // setErrors({ apiError: 'Failed to submit property. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the success message if submitted successfully
  if (submitSuccess) {
    return <SuccessMessage onListAnother={() => {
        setSubmitSuccess(false);
         // You might want to reset form state here as well if not done in the timeout
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Add A Property
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            List your property and connect with potential tenants. Fill out the form below with accurate details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* Render section components */}
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
            handleInputChange={handleInputChange}
            propertyTypes={propertyTypes}
          />

          <AmenitiesSection
             formData={formData}
             handleInputChange={handleInputChange}
          />

           <AdditionalInfoSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            genderOptions={genderOptions}
           />

          <DescriptionSection
             formData={formData}
             errors={errors}
             handleInputChange={handleInputChange}
          />

          <ImageUploadSection
            formData={formData}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
          />

          {/* Submit Button */}
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
};

export default AddPropertyForm;
