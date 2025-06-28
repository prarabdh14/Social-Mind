import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SidebarProvider } from "../components/ui/sidebar";

export function Layout() {
  const mainRef = useRef<HTMLElement>(null);
  const [skipLinkTarget, setSkipLinkTarget] = useState<HTMLElement | null>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []);

  // Handle skip link functionality
  const handleSkipLink = () => {
    if (mainRef.current) {
      mainRef.current.focus();
      mainRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleSkipLink}
        >
          Skip to main content
        </a>
        
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main 
            ref={mainRef}
            id="main-content"
            className="flex-1 p-6 overflow-auto focus:outline-none"
            tabIndex={-1}
            role="main"
            aria-label="Main content area"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
