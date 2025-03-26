
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  // Fetch budget settings
  const { 
    data: budgetSettings, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['budgetSettings'],
    queryFn: async () => {
      console.log('Fetching budget settings from Supabase...');
      try {
        const { data, error } = await supabase
          .from('budget_settings')
          .select('*')
          .limit(1)
          .single();
          
        if (error) {
          // If no settings exist yet, create default ones
          if (error.code === 'PGRST116') {
            const defaultSettings = {
              total_budget: 300000,
              deposit_percentage: 50,
              notes: 'Budget initial'
            };
            
            const { data: newData, error: insertError } = await supabase
              .from('budget_settings')
              .insert(defaultSettings)
              .select()
              .single();
              
            if (insertError) throw insertError;
            
            return newData;
          }
          
          throw error;
        }
        
        return data;
      } catch (err) {
        console.error('Exception when fetching budget settings:', err);
        throw err;
      }
    }
  });

  // Update budget settings
  const updateBudgetSettings = useMutation({
    mutationFn: async (updates: Partial<BudgetSettings>) => {
      if (!budgetSettings?.id) throw new Error('No budget settings found to update');
      
      const { data, error } = await supabase
        .from('budget_settings')
        .update(updates)
        .eq('id', budgetSettings.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
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
