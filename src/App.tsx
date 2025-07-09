
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AllPropertiesPage = lazy(() => import('./components/Properties/AllPropertiesPage'));
const AddPropertyForm = lazy(() => import('./components/AddProperty/AddPropertyForm'));
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'));
const BlogPage = lazy(() => import('./components/Blog/BlogPage'));
const MembershipPage = lazy(() => import('./pages/MembershipPage'));
const AdminPanel = lazy(() => import('./components/AdminPannel'));

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Helmet>
        <title>HomeDaze - Find Your Dream Home</title>
        <meta name="description" content="Premium real estate platform offering verified properties and seamless rental experience." />
      </Helmet>
      
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Admin routes - no layout */}
          <Route path="/admin/*" element={<AdminPanel />} />
          
          {/* Public routes - with layout */}
          <Route path="/" element={
            <Layout currentPage="home">
              <LandingPage />
            </Layout>
          } />
          
          <Route path="/properties" element={
            <Layout currentPage="properties">
              <AllPropertiesPage onPropertyClick={() => {}} />
            </Layout>
          } />
          
          <Route path="/add-property" element={
            <Layout currentPage="add-property">
              <AddPropertyForm />
            </Layout>
          } />
          
          <Route path="/property/:id" element={
            <Layout currentPage="property">
              <PropertyDetailPage />
            </Layout>
          } />
          
          <Route path="/blog" element={
            <Layout currentPage="blog">
              <BlogPage />
            </Layout>
          } />
          
          <Route path="/membership" element={
            <Layout currentPage="membership">
              <MembershipPage />
            </Layout>
          } />
          
          <Route path="/chat" element={
            <Layout currentPage="chat">
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat Feature Coming Soon</h2>
                  <p className="text-gray-600">We're working on bringing you the best chat experience with property owners.</p>
                </div>
              </div>
            </Layout>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
