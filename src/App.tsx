
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <React.StrictMode>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/process" element={<MainLayout><Index /></MainLayout>} />
            <Route path="/inventory" element={<MainLayout><Inventory /></MainLayout>} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </React.StrictMode>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
