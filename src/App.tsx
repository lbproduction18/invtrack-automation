
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import AnalysisLogs from "./pages/AnalysisLogs";
import SimulationPage from "./components/analysis/simulation/SimulationPage";
import NotFound from "./pages/NotFound";
import "./index.css";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout><Index /></MainLayout>} />
              <Route path="/inventory" element={<MainLayout><Inventory /></MainLayout>} />
              <Route path="/logs" element={<MainLayout><AnalysisLogs /></MainLayout>} />
              <Route path="/simulation" element={<MainLayout><SimulationPage /></MainLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
