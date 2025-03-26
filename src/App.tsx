
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
          
          {/* App Routes */}
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/inventory" element={<MainLayout><Inventory /></MainLayout>} />
          
          {/* Placeholder Routes - To be implemented */}
          <Route path="/orders" element={<MainLayout><div className="py-10 text-center">Orders Page Coming Soon</div></MainLayout>} />
          <Route path="/logistics" element={<MainLayout><div className="py-10 text-center">Logistics Calendar Coming Soon</div></MainLayout>} />
          <Route path="/stock-entry" element={<MainLayout><div className="py-10 text-center">Stock Entry Coming Soon</div></MainLayout>} />
          <Route path="/settings" element={<MainLayout><div className="py-10 text-center">Settings Page Coming Soon</div></MainLayout>} />
          
          {/* Redirect from / to /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
