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
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;