
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type AnalysisItem, type AnalysisStatus } from "@/types/analysis";

export const useAddToAnalysis = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productIds: string[]) => {
      if (!productIds.length) {
        throw new Error("No products selected");
      }

      // Fetch the products first
      const { data: products, error: productsError } = await supabase
        .from('Low stock product')
        .select('*')
        .in('id', productIds);

      if (productsError) throw productsError;
      if (!products?.length) throw new Error("No products found with the provided IDs");

      // Begin preparing the analysis items to insert
      const analysisItems = products.map(product => ({
        product_id: product.id,
        product_name: product.product_name || product.id,
        sku_code: product.SKU || '',
        priority_badge: product.priority_badge || '',
        current_stock: product.current_stock || 0,
        stock_threshold: product.threshold || 0,
        note: product.note || '',
        date_added: new Date().toISOString(),
        status: 'pending' as AnalysisStatus,
        quantity_to_order: 0,
        price_per_unit: 0,
      }));

      // Insert the analysis items
      const { data: inserted, error: insertError } = await supabase
        .from('analysis_items')
        .insert(analysisItems)
        .select();

      if (insertError) throw insertError;
      
      return inserted;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['analysisItems'] });
      
      toast({
        title: "Produits ajoutés à l'analyse",
        description: `${data.length} produit(s) ont été ajoutés à l'analyse avec succès.`,
      });
    },
    onError: (error) => {
      console.error("Error adding products to analysis:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de l'ajout des produits à l'analyse.",
      });
    }
  });
};
