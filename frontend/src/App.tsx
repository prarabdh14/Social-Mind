import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ContentStudio from "./pages/ContentStudio";
import Analytics from "./pages/Analytics";
import Homepage from "./pages/Homepage";
import Onboarding from "./pages/Onboarding";
import ScheduleSetup from "./pages/ScheduleSetup";
import Calendar from "./pages/Calendar";
import Accounts from "./pages/Accounts";
import SocialAccounts from "./pages/SocialAccounts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Focus management for accessibility
  useEffect(() => {
    // Announce page changes to screen readers
    const announcePageChange = () => {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.setAttribute('aria-live', 'polite');
        mainContent.setAttribute('aria-atomic', 'true');
      }
    };

    announcePageChange();

    // Handle focus restoration on navigation
    const handleFocusRestoration = () => {
      const mainContent = document.querySelector('main');
      if (mainContent && mainContent instanceof HTMLElement) {
        // Small delay to ensure content is rendered
        setTimeout(() => {
          mainContent.focus();
        }, 100);
      }
    };

    // Listen for route changes
    window.addEventListener('popstate', handleFocusRestoration);
    
    return () => {
      window.removeEventListener('popstate', handleFocusRestoration);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div 
              className="min-h-screen"
              role="application"
              aria-label="SocialMind - Social Media Management Platform"
            >
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="schedule-setup" element={<ScheduleSetup />} />
                  <Route path="content" element={<ContentStudio />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="accounts" element={<Accounts />} />
                  <Route path="social-accounts" element={<SocialAccounts />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;