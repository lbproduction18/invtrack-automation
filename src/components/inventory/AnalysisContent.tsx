
import React, { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpIcon, ArrowDownIcon, CheckCircle2, Clock, AlertTriangle, Info, FileText, Calendar, DollarSign, PercentIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type QuantityOption = 1000 | 2000 | 3000 | 4000 | 5000;

interface ProductAnalysis {
  id: string;
  sku: string;
  productName: string;
  currentStock: number;
  threshold: number;
  priceTiers: Record<QuantityOption, number>;
  selectedQuantity: QuantityOption | null;
  lastOrderQuantity: number | null;
  lastOrderDate: Date | null;
  labStatus: string | null;
  estimatedDeliveryDate: Date | null;
  priorityBadge: string;
  note: string | null;
  createdAt: string;
}

interface BudgetSettings {
  id: string;
  totalBudget: number;
  depositPercentage: number;
  notes: string;
}

export const AnalysisContent: React.FC = () => {
  const { products, isLoading, refetch } = useProducts();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<ProductAnalysis | null>(null);
  const [analysisData, setAnalysisData] = useState<ProductAnalysis[]>([]);
  const [budgetSettings, setBudgetSettings] = useState<BudgetSettings>({
    id: '',
    totalBudget: 300000,
    depositPercentage: 50,
    notes: ''
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch budget settings
  useEffect(() => {
    const fetchBudgetSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('budget_settings')
          .select('*')
          .single();
        
        if (error) throw error;
        
        if (data) {
          setBudgetSettings({
            id: data.id,
            totalBudget: data.total_budget,
            depositPercentage: data.deposit_percentage,
            notes: data.notes || ''
          });
        }
      } catch (error) {
        console.error('Error fetching budget settings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres de budget",
          variant: "destructive"
        });
      }
    };

    fetchBudgetSettings();
  }, [toast]);

  // Transform products data to analysis data
  useEffect(() => {
    if (products && products.length > 0) {
      const transformed: ProductAnalysis[] = products.map(product => ({
        id: product.id,
        sku: product.SKU,
        productName: product.product_name || product.SKU,
        currentStock: product.current_stock,
        threshold: product.threshold,
        priceTiers: {
          1000: product.price_1000 || 0,
          2000: product.price_2000 || 0,
          3000: product.price_3000 || 0,
          4000: product.price_4000 || 0,
          5000: product.price_5000 || 0
        },
        selectedQuantity: null,
        lastOrderQuantity: product.last_order_quantity || null,
        lastOrderDate: product.last_order_date ? new Date(product.last_order_date) : null,
        labStatus: product.lab_status || null,
        estimatedDeliveryDate: product.estimated_delivery_date ? new Date(product.estimated_delivery_date) : null,
        priorityBadge: product.priority_badge,
        note: product.note,
        createdAt: product.created_at
      }));
      
      setAnalysisData(transformed);
    }
  }, [products]);

  const handleProductClick = (product: ProductAnalysis) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleQuantityChange = (productId: string, quantity: QuantityOption) => {
    setAnalysisData(prevData => 
      prevData.map(product => 
        product.id === productId 
          ? { ...product, selectedQuantity: quantity } 
          : product
      )
    );
  };

  const handleProductUpdate = async () => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase
        .from('Low stock product')
        .update({
          product_name: selectedProduct.productName,
          last_order_quantity: selectedProduct.lastOrderQuantity,
          last_order_date: selectedProduct.lastOrderDate,
          lab_status: selectedProduct.labStatus,
          estimated_delivery_date: selectedProduct.estimatedDeliveryDate
        })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Produit mis à jour avec succès"
      });

      // Update local state
      setAnalysisData(prevData => 
        prevData.map(product => 
          product.id === selectedProduct.id ? selectedProduct : product
        )
      );

      setDrawerOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
        variant: "destructive"
      });
    }
  };

  const handleBudgetNotesChange = async (notes: string) => {
    setBudgetSettings(prev => ({ ...prev, notes }));

    try {
      const { error } = await supabase
        .from('budget_settings')
        .update({ notes })
        .eq('id', budgetSettings.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating budget notes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les notes",
        variant: "destructive"
      });
    }
  };

  // Calculate totals
  const calculateTotalOrderAmount = () => {
    return analysisData.reduce((total, product) => {
      if (product.selectedQuantity) {
        return total + (product.priceTiers[product.selectedQuantity] || 0);
      }
      return total;
    }, 0);
  };

  const totalOrderAmount = calculateTotalOrderAmount();
  const depositAmount = (totalOrderAmount * budgetSettings.depositPercentage) / 100;
  const remainingBudget = budgetSettings.totalBudget - totalOrderAmount;
  const budgetUsedPercentage = (totalOrderAmount / budgetSettings.totalBudget) * 100;

  const getLabStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    switch(status.toLowerCase()) {
      case 'ok':
        return <Badge variant="outline" className="flex items-center gap-1 bg-green-900/20 text-green-400 border-green-800">
                <CheckCircle2 className="h-3 w-3" />OK
               </Badge>;
      case 'à commander':
      case 'a commander':
        return <Badge variant="outline" className="flex items-center gap-1 bg-yellow-900/20 text-yellow-400 border-yellow-800">
                <AlertTriangle className="h-3 w-3" />À commander
               </Badge>;
      case 'manquante':
        return <Badge variant="outline" className="flex items-center gap-1 bg-red-900/20 text-red-400 border-red-800">
                <AlertTriangle className="h-3 w-3" />Manquante
               </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const quantityOptions: QuantityOption[] = [1000, 2000, 3000, 4000, 5000];

  return (
    <CardContent className="p-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-2">Simulation de coût et commande</h3>
        <p className="text-sm text-gray-400 mb-4">
          Sélectionnez les quantités pour chaque produit pour simuler le coût total de la commande.
        </p>
      </div>

      {/* Main table */}
      <div className="mb-8 overflow-x-auto">
        <Table className="border border-[#272727]">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Produit</TableHead>
              {quantityOptions.map(qty => (
                <TableHead key={qty} className="text-center">
                  Prix pour {qty}
                </TableHead>
              ))}
              <TableHead className="text-center">Quantité choisie</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="w-[80px]">Détails</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Chargement des données...
                </TableCell>
              </TableRow>
            ) : analysisData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Aucun produit trouvé
                </TableCell>
              </TableRow>
            ) : (
              analysisData.map((product) => {
                const selectedPrice = product.selectedQuantity ? product.priceTiers[product.selectedQuantity] : 0;
                
                return (
                  <TableRow key={product.id} className="hover:bg-[#1a1a1a]">
                    <TableCell className="font-medium">{product.productName || product.sku}</TableCell>
                    
                    {/* Price tiers */}
                    {quantityOptions.map(qty => (
                      <TableCell key={qty} className="text-center">
                        {product.priceTiers[qty] ? (
                          <span>${product.priceTiers[qty].toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                    ))}
                    
                    {/* Quantity selector */}
                    <TableCell>
                      <Select
                        value={product.selectedQuantity?.toString() || ''}
                        onValueChange={(value) => {
                          const qty = parseInt(value) as QuantityOption;
                          handleQuantityChange(product.id, qty);
                        }}
                      >
                        <SelectTrigger className="w-full bg-[#121212] border-[#272727]">
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#161616] border-[#272727]">
                          <SelectItem value="">Aucune</SelectItem>
                          {quantityOptions.map(qty => (
                            <SelectItem key={qty} value={qty.toString()}>
                              {qty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    
                    {/* Total */}
                    <TableCell className="text-center font-semibold">
                      {product.selectedQuantity ? (
                        <span>${selectedPrice.toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    
                    {/* Details button */}
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleProductClick(product)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Budget summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <div className="bg-[#161616] p-4 rounded-lg border border-[#272727]">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-green-400" /> Budget Total
            </h4>
            <p className="text-2xl font-bold text-white">${budgetSettings.totalBudget.toLocaleString()}</p>
          </div>
          
          <div className="bg-[#161616] p-4 rounded-lg border border-[#272727]">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-blue-400" /> Total Commande
            </h4>
            <p className="text-2xl font-bold text-white">${totalOrderAmount.toLocaleString()}</p>
          </div>
          
          <div className="bg-[#161616] p-4 rounded-lg border border-[#272727]">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              <PercentIcon className="h-4 w-4 mr-1 text-yellow-400" /> Dépôt à Payer ({budgetSettings.depositPercentage}%)
            </h4>
            <p className="text-2xl font-bold text-white">${depositAmount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-[#161616] p-4 rounded-lg border border-[#272727]">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-purple-400" /> Budget Restant
            </h4>
            <p className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-red-400' : 'text-white'}`}>
              ${remainingBudget.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-[#161616] p-4 rounded-lg border border-[#272727]">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              <PercentIcon className="h-4 w-4 mr-1 text-blue-400" /> Budget Utilisé
            </h4>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${budgetUsedPercentage > 100 ? 'bg-red-500' : 'bg-green-500'}`} 
                  style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-300">{budgetUsedPercentage.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="bg-[#161616] p-4 rounded-lg border border-[#272727]">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-1 text-gray-400" /> Notes
            </h4>
            <textarea 
              className="w-full bg-[#121212] border border-[#272727] rounded-md p-2 text-white"
              rows={3}
              value={budgetSettings.notes}
              onChange={(e) => handleBudgetNotesChange(e.target.value)}
              placeholder="Ajouter des notes concernant cette commande..."
            />
          </div>
        </div>
      </div>

      {/* Product detail drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="bg-[#121212] text-white border-t border-[#272727]">
          <div className="max-w-4xl mx-auto w-full">
            <DrawerHeader>
              <DrawerTitle className="text-xl font-bold">
                Détails du produit: {selectedProduct?.productName || selectedProduct?.sku}
              </DrawerTitle>
              <DrawerDescription className="text-gray-400">
                Consultez et modifiez les informations détaillées du produit
              </DrawerDescription>
            </DrawerHeader>
            
            {selectedProduct && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column - Product info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b border-[#272727] pb-2">
                      Informations du produit
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">SKU</p>
                        <p className="font-medium">{selectedProduct.sku}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Nom du produit</p>
                        <Input 
                          className="bg-[#161616] border-[#272727]"
                          value={selectedProduct.productName || ''}
                          onChange={(e) => setSelectedProduct({
                            ...selectedProduct,
                            productName: e.target.value
                          })}
                        />
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Stock actuel</p>
                        <p className="font-medium">{selectedProduct.currentStock}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Seuil</p>
                        <p className="font-medium">{selectedProduct.threshold}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Date d'ajout</p>
                        <p className="font-medium">
                          {format(new Date(selectedProduct.createdAt), 'dd/MM/yyyy')}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400">Priorité</p>
                        <Badge 
                          variant={
                            selectedProduct.priorityBadge === 'prioritaire' ? 'destructive' : 
                            selectedProduct.priorityBadge === 'moyen' ? 'outline' : 'secondary'
                          }
                        >
                          {selectedProduct.priorityBadge === 'prioritaire' ? 'Haute' : 
                           selectedProduct.priorityBadge === 'moyen' ? 'Moyenne' : 'Basse'}
                        </Badge>
                      </div>
                    </div>
                    
                    {selectedProduct.note && (
                      <div>
                        <p className="text-sm text-gray-400">Note</p>
                        <p className="bg-[#161616] p-2 rounded-md border border-[#272727]">
                          {selectedProduct.note}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right column - Order info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b border-[#272727] pb-2">
                      Informations de commande
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Quantité dernière commande</p>
                        <Input 
                          type="number"
                          className="bg-[#161616] border-[#272727]"
                          value={selectedProduct.lastOrderQuantity || ''}
                          onChange={(e) => setSelectedProduct({
                            ...selectedProduct,
                            lastOrderQuantity: e.target.value ? Number(e.target.value) : null
                          })}
                          placeholder="Entrez la quantité"
                        />
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Date dernière commande</p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-[#161616] border-[#272727]",
                                !selectedProduct.lastOrderDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {selectedProduct.lastOrderDate ? (
                                format(selectedProduct.lastOrderDate, "PPP")
                              ) : (
                                <span>Choisir une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-[#161616] border-[#272727]">
                            <CalendarComponent
                              mode="single"
                              selected={selectedProduct.lastOrderDate || undefined}
                              onSelect={(date) => setSelectedProduct({
                                ...selectedProduct,
                                lastOrderDate: date || null
                              })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Étiquette au laboratoire</p>
                        <Select
                          value={selectedProduct.labStatus || ''}
                          onValueChange={(value) => setSelectedProduct({
                            ...selectedProduct,
                            labStatus: value || null
                          })}
                        >
                          <SelectTrigger className="w-full bg-[#161616] border-[#272727]">
                            <SelectValue placeholder="Choisir un statut" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#161616] border-[#272727]">
                            <SelectItem value="">Aucun</SelectItem>
                            <SelectItem value="OK">OK</SelectItem>
                            <SelectItem value="À commander">À commander</SelectItem>
                            <SelectItem value="Manquante">Manquante</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Date de livraison estimée</p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-[#161616] border-[#272727]",
                                !selectedProduct.estimatedDeliveryDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {selectedProduct.estimatedDeliveryDate ? (
                                format(selectedProduct.estimatedDeliveryDate, "PPP")
                              ) : (
                                <span>Choisir une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-[#161616] border-[#272727]">
                            <CalendarComponent
                              mode="single"
                              selected={selectedProduct.estimatedDeliveryDate || undefined}
                              onSelect={(date) => setSelectedProduct({
                                ...selectedProduct,
                                estimatedDeliveryDate: date || null
                              })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DrawerFooter className="border-t border-[#272727]">
              <Button onClick={handleProductUpdate}>Enregistrer les modifications</Button>
              <DrawerClose asChild>
                <Button variant="outline">Annuler</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </CardContent>
  );
};
