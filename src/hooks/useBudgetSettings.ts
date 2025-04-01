
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAISimulationMetadata } from './useAISimulationMetadata';

export interface BudgetSettings {
  id: string;
  total_budget: number;
  deposit_percentage: number;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useBudgetSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { metadata: aiMetadata, isLoading: isLoadingAI } = useAISimulationMetadata();

  // Fetch budget settings using a mock for now
  const { 
    data: budgetSettings, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['budgetSettings'],
    queryFn: async () => {
      console.log('Getting budget settings with AI metadata sync...');
      
      // If we have AI metadata, use that as the source of truth
      if (aiMetadata && !isLoadingAI && aiMetadata.id) {
        return {
          id: '1',
          total_budget: aiMetadata.budget_max || 500000,
          deposit_percentage: 50,
          notes: aiMetadata.ai_note || 'Budget initial',
          created_at: aiMetadata.created_at,
          updated_at: aiMetadata.updated_at
        } as BudgetSettings;
      }
      
      // Return default values since we can't properly type the Supabase query yet
      return {
        id: '1',
        total_budget: 500000,
        deposit_percentage: 50,
        notes: 'Budget initial',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as BudgetSettings;
    },
    enabled: true,
    // Refetch whenever AI metadata changes
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // Mock update budget settings
  const updateBudgetSettings = useMutation({
    mutationFn: async (updates: Partial<BudgetSettings>) => {
      console.log('Updating budget settings:', updates);
      
      // Return a mock response with the updates applied
      return {
        ...budgetSettings,
        ...updates,
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres budgétaires ont été mis à jour avec succès."
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['budgetSettings'] });
    },
    onError: (error) => {
      console.error('Error updating budget settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres budgétaires.",
        variant: "destructive"
      });
    }
  });

  return { 
    budgetSettings, 
    isLoading, 
    error, 
    refetch,
    updateBudgetSettings
  };
}
