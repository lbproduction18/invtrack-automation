
import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type CarouselApi } from "@/components/ui/carousel";

interface NavigationArrowsProps {
  currentStep: number;
  totalSteps: number;
  carouselApi: CarouselApi | null;
}

export const NavigationArrows: React.FC<NavigationArrowsProps> = ({
  currentStep,
  totalSteps,
  carouselApi
}) => {
  return (
    <>
      <button
        onClick={() => carouselApi?.scrollPrev()}
        disabled={currentStep === 0}
        className={cn(
          "carousel-arrow left",
          currentStep === 0 ? "opacity-50" : ""
        )}
        aria-label="Étape précédente"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={() => carouselApi?.scrollNext()}
        disabled={currentStep === totalSteps - 1}
        className={cn(
          "carousel-arrow right",
          currentStep === totalSteps - 1 ? "opacity-50" : ""
        )}
        aria-label="Étape suivante"
      >
        <ChevronRight size={24} />
      </button>
    </>
  );
};
