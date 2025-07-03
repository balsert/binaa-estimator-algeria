import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import ProjectResults from "./pages/ProjectResults";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Analytics from "./pages/Analytics";
import Tools from "./pages/Tools";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import Layout from "./components/Layout";
import MobileOptimized from "./components/MobileOptimized";
import NetworkStatus from "./components/NetworkStatus";
import ErrorBoundary from "./components/ui/error-boundary";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const showBottomNav = !location.pathname.includes('/project/');

  return (
    <ErrorBoundary>
      <MobileOptimized>
        <NetworkStatus />
        <Layout>
          <div className={showBottomNav ? "pb-20" : ""}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/project/:projectId" element={<ProjectResults />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/about" element={<About />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          {showBottomNav && <BottomNav />}
        </Layout>
      </MobileOptimized>
    </ErrorBoundary>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;