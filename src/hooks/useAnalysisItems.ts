
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAddToAnalysis } from "./analysis/useAddToAnalysis";
import { useUpdateAnalysisItem } from "./analysis/useUpdateAnalysisItem";

export const useAnalysisItems = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Use the custom hooks for add and update operations
  const addToAnalysisMutation = useAddToAnalysis();
  const updateAnalysisItemMutation = useUpdateAnalysisItem();

  const { data: analysisItems, isLoading } = useQuery({
    queryKey: ["analysisItems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analysis_items")
        .select("*")
        .order("date_added", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Delete mutation
  const deleteItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from("analysis_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      return itemId;
    },
    onSuccess: (itemId) => {
      queryClient.invalidateQueries({ queryKey: ["analysisItems"] });
      toast({
        title: "Item Deleted",
        description: "The analysis item has been deleted.",
      });
    },
    onError: (error) => {
      console.error("Error deleting analysis item:", error);
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: "There was an error deleting the analysis item.",
      });
    },
  });

  return {
    analysisItems,
    isLoading,
    addToAnalysis: addToAnalysisMutation.mutate,
    updateAnalysisItem: updateAnalysisItemMutation.mutate,
    deleteItem: deleteItem.mutate,
    isAddingToAnalysis: addToAnalysisMutation.isPending,
    isUpdatingAnalysisItem: updateAnalysisItemMutation.isPending,
    isDeletingItem: deleteItem.isPending,
  };
};
