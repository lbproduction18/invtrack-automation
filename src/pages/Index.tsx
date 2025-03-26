
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  
  const steps = [
    { name: "1. Observation", description: "Produits à faible stock" },
    { name: "2. Analyse", description: "Analyse des besoins et recommandations" },
    { name: "3. Commande", description: "Création et validation du bon de commande" },
    { name: "4. Livraison", description: "Suivi et détails de la livraison" }
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

  const handleStepClick = (index: number) => {
    if (carouselApi) {
      carouselApi.scrollTo(index);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white relative">
      {/* Menu d'étapes amélioré */}
      <div className="mb-8 mt-4">
        <div className="flex flex-col space-y-4">
          {/* Étapes numérotées avec design amélioré */}
          <div className="flex justify-between px-4 items-center">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={cn(
                  "flex flex-col items-center cursor-pointer transition-all duration-300 px-3 py-2 rounded-md", 
                  currentStep === index 
                    ? "bg-[#1E1E1E]/50 text-[#3ECF8E] font-semibold" 
                    : "text-gray-400 hover:text-white hover:bg-[#1E1E1E]/30"
                )}
              >
                <div className="text-base">{step.name}</div>
                <div className={cn(
                  "text-xs mt-1",
                  currentStep === index ? "text-gray-300" : "text-gray-500"
                )}>
                  {step.description}
                </div>
              </button>
            ))}
          </div>
          
          {/* Barre de progression améliorée */}
          <div className="px-4 pt-2">
            <Progress 
              value={(currentStep / (totalSteps - 1)) * 100} 
              className="h-1.5" 
            />
            <div className="flex justify-between mt-1">
              {steps.map((_, index) => (
                <div 
                  key={index}
                  className={cn(
                    "w-4 h-4 rounded-full transition-all duration-300",
                    currentStep >= index ? "bg-[#3ECF8E]" : "bg-[#272727]",
                    index === currentStep && "ring-2 ring-offset-2 ring-offset-[#0F0F0F] ring-[#3ECF8E]/50"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Flèche de gauche */}
      <button
        onClick={() => carouselApi?.scrollPrev()}
        disabled={currentStep === 0}
        className={cn(
          "fixed left-4 top-1/2 transform -translate-y-1/2 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#1E1E1E] border border-[#272727] text-white shadow-md transition-all duration-300",
          currentStep === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#272727] hover:scale-105"
        )}
        aria-label="Étape précédente"
      >
        <ChevronLeft size={24} />
      </button>
      
      {/* Carousel principal */}
      <div className="relative max-w-[calc(100%-80px)] mx-auto">
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
        </Carousel>
      </div>
      
      {/* Flèche de droite */}
      <button
        onClick={() => carouselApi?.scrollNext()}
        disabled={currentStep === totalSteps - 1}
        className={cn(
          "fixed right-4 top-1/2 transform -translate-y-1/2 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#1E1E1E] border border-[#272727] text-white shadow-md transition-all duration-300",
          currentStep === totalSteps - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#272727] hover:scale-105"
        )}
        aria-label="Étape suivante"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Index;
