
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext
} from "@/components/ui/carousel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InventoryHeader } from '@/components/inventory/InventoryHeader';
import { LastUpdatedAlert } from '@/components/inventory/LastUpdatedAlert';
import { InventoryContent } from '@/components/inventory/InventoryContent';
import { AnalysisContent } from '@/components/inventory/AnalysisContent';
import { OrderContent } from '@/components/inventory/OrderContent';
import { DeliveryContent } from '@/components/inventory/DeliveryContent';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white relative">
      <Carousel>
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
        
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
};

export default Index;
