import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from './layouts/Navigation';
import Footer from './layouts/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AllPropertiesPage = lazy(() => import('./features/properties/AllPropertiesPage'));
const AddPropertyForm = lazy(() => import('./features/properties/AddPropertyForm'));
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'));
const BlogPage = lazy(() => import('./features/blog/BlogPage'));
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
                <Route path="/chat" element={
                  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat Feature Coming Soon</h2>
                      <p className="text-gray-600">We're working on bringing you the best chat experience with property owners.</p>
                    </div>
                  </div>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
