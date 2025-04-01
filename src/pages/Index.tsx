
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselApi
} from "@/components/ui/carousel";
import { ProgressSteps } from '@/components/carousel/ProgressSteps';
import { CarouselNavigationArrows } from '@/components/carousel/CarouselNavigationArrows';
import { InventoryCarouselContent } from '@/components/carousel/InventoryCarouselContent';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

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
        <ProgressSteps 
          steps={steps} 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          onStepClick={handleStepClick} 
        />
      </div>
      
      {/* Container principal avec position relative pour les flèches */}
      <div className="relative max-w-[calc(100%-80px)] mx-auto">
        {/* Carousel principal */}
        <Carousel 
          className="w-full" 
          setApi={setCarouselApi}
        >
          <CarouselContent>
            <InventoryCarouselContent />
          </CarouselContent>
        </Carousel>
      </div>
      
      {/* Flèches de navigation */}
      <CarouselNavigationArrows 
        currentStep={currentStep}
        totalSteps={totalSteps}
        carouselApi={carouselApi}
      />

      {/* Navigation pagination au bas de la page */}
      <div className="fixed bottom-8 left-0 right-0">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentStep > 0 && handleStepClick(currentStep - 1)}
                className={currentStep === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {steps.map((step, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  isActive={currentStep === index}
                  onClick={() => handleStepClick(index)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentStep < totalSteps - 1 && handleStepClick(currentStep + 1)}
                className={currentStep === totalSteps - 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Index;
