
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InventoryHeader } from '@/components/inventory/InventoryHeader';
import { LastUpdatedAlert } from '@/components/inventory/LastUpdatedAlert';
import { InventoryContent } from '@/components/inventory/InventoryContent';
import { AnalysisContent } from '@/components/inventory/AnalysisContent';
import { OrderContent } from '@/components/inventory/OrderContent';
import { DeliveryContent } from '@/components/inventory/DeliveryContent';
import { Progress } from "@/components/ui/progress";
import { useEffect } from 'react';
import type { CarouselApi } from "@/components/ui/carousel";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  
  const steps = [
    { name: "Observation", description: "Produits à faible stock" },
    { name: "Analyse", description: "Analyse des besoins et recommandations" },
    { name: "Commande", description: "Création et validation du bon de commande" },
    { name: "Livraison", description: "Suivi et détails de la livraison" }
  ];

  useEffect(() => {
    if (!carouselApi) return;
    
    const handleSelect = () => {
      setCurrentStep(carouselApi.selectedScrollSnap());
    };
    
    carouselApi.on("select", handleSelect);
    
    // Cleanup
    return () => {
      carouselApi.off("select", handleSelect);
    };
  }, [carouselApi]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white relative">
      {/* Barre de progression */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between px-4">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`text-xs transition-colors ${currentStep >= index ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {step.name}
            </div>
          ))}
        </div>
        <Progress value={(currentStep / (totalSteps - 1)) * 100} className="h-1" />
      </div>
      
      <Carousel 
        className="w-full" 
        setApi={setCarouselApi}
      >
        <CarouselContent>
          {/* Low Stock Products */}
          <CarouselItem>
            <div className="space-y-4 p-4">
              <InventoryHeader />
              <LastUpdatedAlert />
              <Card className="border border-[#272727] bg-[#121212]/60 backdrop-blur-sm shadow-sm">
                <CardHeader className="px-4 py-3 border-b border-[#272727]">
                  <CardTitle className="text-sm font-medium text-white">Produits à Faible Stock</CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    Étape 1: Identification des produits nécessitant un réapprovisionnement
                  </CardDescription>
                </CardHeader>
                <InventoryContent />
              </Card>
            </div>
          </CarouselItem>

          {/* Restock Analysis */}
          <CarouselItem>
            <div className="space-y-4 p-4">
              <Card className="border border-[#272727] bg-[#121212]/60 backdrop-blur-sm shadow-sm">
                <CardHeader className="px-4 py-3 border-b border-[#272727]">
                  <CardTitle className="text-sm font-medium text-white">Analyse de Restock</CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    Étape 2: Analyse des besoins et recommandations
                  </CardDescription>
                </CardHeader>
                <AnalysisContent />
              </Card>
            </div>
          </CarouselItem>

          {/* Purchase Order */}
          <CarouselItem>
            <div className="space-y-4 p-4">
              <Card className="border border-[#272727] bg-[#121212]/60 backdrop-blur-sm shadow-sm">
                <CardHeader className="px-4 py-3 border-b border-[#272727]">
                  <CardTitle className="text-sm font-medium text-white">Bon de Commande</CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    Étape 3: Création et validation du bon de commande
                  </CardDescription>
                </CardHeader>
                <OrderContent />
              </Card>
            </div>
          </CarouselItem>

          {/* Delivery Details */}
          <CarouselItem>
            <div className="space-y-4 p-4">
              <Card className="border border-[#272727] bg-[#121212]/60 backdrop-blur-sm shadow-sm">
                <CardHeader className="px-4 py-3 border-b border-[#272727]">
                  <CardTitle className="text-sm font-medium text-white">Détails de Livraison</CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    Étape 4: Suivi et détails de la livraison
                  </CardDescription>
                </CardHeader>
                <DeliveryContent />
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
};

export default Index;
