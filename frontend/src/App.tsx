import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';

const DashboardOverview = lazy(() => import('./components/dashboard/Overview'));
const ContentScheduler = lazy(() => import('./components/dashboard/ContentScheduler'));
const Analytics = lazy(() => import('./components/dashboard/Analytics'));
const ReviewQueue = lazy(() => import('./components/dashboard/ReviewQueue'));

function AppContent() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user, loading, login, logout } = useUser();

  const handleLogin = async (token: string, userData: any) => {
    setIsTransitioning(true);
    await login(token, userData);
    setIsTransitioning(false);
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    logout();
    setIsTransitioning(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#2A2A72] to-[#4ECDC4]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-spin">
            <div className="w-full h-full border-4 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-white text-lg font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-all duration-500 ease-out">
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#2A2A72] to-[#4ECDC4]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 animate-spin">
              <div className="w-full h-full border-4 border-white border-t-transparent rounded-full"></div>
            </div>
            <p className="text-white text-lg font-medium">Loading your workspace...</p>
          </div>
        </div>
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={!user ? <LandingPage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" replace />} 
        >
          <Route index element={<Suspense fallback={<div>Loading...</div>}><DashboardOverview /></Suspense>} />
          <Route path="scheduler" element={<Suspense fallback={<div>Loading...</div>}><ContentScheduler /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<div>Loading...</div>}><Analytics /></Suspense>} />
          <Route path="review" element={<Suspense fallback={<div>Loading...</div>}><ReviewQueue /></Suspense>} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;