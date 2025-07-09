import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from '../layouts/Navigation';
import Footer from '../layouts/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ChatInbox from '../features/chat/ChatInbox';
import ChatConversation from '../features/chat/ChatConversation';

// Lazy load pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const AllPropertiesPage = lazy(() => import('../features/properties/AllPropertiesPage'));
const AddPropertyForm = lazy(() => import('../features/properties/AddPropertyForm'));
const PropertyDetailPage = lazy(() => import('../pages/PropertyDetailPage'));
const BlogPage = lazy(() => import('../features/blog/BlogPage'));
const MembershipPage = lazy(() => import('../pages/MembershipPage'));
const AdminPanel = lazy(() => import('../components/AdminPannel'));

const AppRoutes: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      {/* Admin routes - no navigation */}
      <Route path="/admin/*" element={<AdminPanel />} />
      {/* Public routes - with navigation */}
      <Route path="/*" element={
        <>
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/properties" element={<AllPropertiesPage onPropertyClick={() => {}} />} />
            <Route path="/add-property" element={<AddPropertyForm />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/chat" element={<ChatInbox />} />
            <Route path="/chat/:userId" element={<ChatConversation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </>
      } />
    </Routes>
  </Suspense>
);

export default AppRoutes;