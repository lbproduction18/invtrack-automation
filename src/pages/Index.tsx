
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi
} from "@/components/ui/carousel";
import { InventoryHeader } from '@/components/inventory/InventoryHeader';
import { LastUpdatedAlert } from '@/components/inventory/LastUpdatedAlert';
import { InventoryContent } from '@/components/inventory/InventoryContent';
import { AnalysisContent } from '@/components/inventory/AnalysisContent';
import { OrderContent } from '@/components/inventory/OrderContent';
import { DeliveryContent } from '@/components/inventory/DeliveryContent';
import { StepNavigation } from '@/components/inventory/steps/StepNavigation';
import { NavigationArrows } from '@/components/inventory/steps/NavigationArrows';
import { StepContainer } from '@/components/inventory/steps/StepContainer';
import { INVENTORY_STEPS } from '@/components/inventory/steps/stepsConfig';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = INVENTORY_STEPS.length;
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  
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
      {/* Navigation steps */}
      <StepNavigation 
        steps={INVENTORY_STEPS}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />
      
      {/* Main carousel */}
      <div className="relative max-w-[calc(100%-80px)] mx-auto">
        <Carousel 
          className="w-full" 
          setApi={setCarouselApi}
        >
          <CarouselContent>
            {/* Step 1: Low Stock Products */}
            <CarouselItem>
              <div className="space-y-4 p-4">
                <InventoryHeader />
                <LastUpdatedAlert />
                <StepContainer 
                  title={INVENTORY_STEPS[0].title}
                  description={INVENTORY_STEPS[0].detailedDescription}
                >
                  <InventoryContent />
                </StepContainer>
              </div>
            </CarouselItem>

            {/* Step 2: Restock Analysis */}
            <CarouselItem>
              <StepContainer 
                title={INVENTORY_STEPS[1].title}
                description={INVENTORY_STEPS[1].detailedDescription}
              >
                <AnalysisContent />
              </StepContainer>
            </CarouselItem>

            {/* Step 3: Purchase Order */}
            <CarouselItem>
              <StepContainer 
                title={INVENTORY_STEPS[2].title}
                description={INVENTORY_STEPS[2].detailedDescription}
              >
                <OrderContent />
              </StepContainer>
            </CarouselItem>

            {/* Step 4: Delivery Details */}
            <CarouselItem>
              <StepContainer 
                title={INVENTORY_STEPS[3].title}
                description={INVENTORY_STEPS[3].detailedDescription}
              >
                <DeliveryContent />
              </StepContainer>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      
      {/* Navigation arrows */}
      <NavigationArrows 
        currentStep={currentStep}
        totalSteps={totalSteps}
        carouselApi={carouselApi || null}
      />
    </div>
  );
};

export default Index;
