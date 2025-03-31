
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, MinusCircle, Save, RefreshCw } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SimulationPage: React.FC = () => {
  const [budget, setBudget] = useState<number>(300000);
  const [notes, setNotes] = useState<string>('');
  const [prioritySkus, setPrioritySkus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const { products } = useProducts('all');
  const { toast } = useToast();

  // Load initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch budget settings
        const { data: budgetData, error: budgetError } = await supabase
          .from('budget_settings')
          .select('budget')
          .limit(1)
          .single();
          
        if (budgetError && budgetError.code !== 'PGRST116') {
          console.error('Error fetching budget settings:', budgetError);
        } else if (budgetData) {
          setBudget(budgetData.budget || 300000);
        }
        
        // Fetch priority SKUs
        const { data: priorityData, error: priorityError } = await supabase
          .from('priority_inputs')
          .select('sku_code')
          .eq('is_priority', true);
          
        if (priorityError) {
          console.error('Error fetching priority SKUs:', priorityError);
        } else if (priorityData) {
          setPrioritySkus(priorityData.map(item => item.sku_code));
        }
        
        // Fetch latest notes
        const { data: notesData, error: notesError } = await supabase
          .from('ai_analysis_notes')
          .select('note_text')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (notesError && notesError.code !== 'PGRST116') {
          console.error('Error fetching notes:', notesError);
        } else if (notesData) {
          setNotes(notesData.note_text || '');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Save budget settings
      const { error: budgetError } = await supabase
        .from('budget_settings')
        .upsert([{ budget }], { onConflict: 'id' });
        
      if (budgetError) {
        throw new Error(`Error saving budget: ${budgetError.message}`);
      }
      
      // Update priority SKUs
      // First, remove all existing priority flags
      const { error: clearError } = await supabase
        .from('priority_inputs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy condition to clear all
        
      if (clearError) {
        throw new Error(`Error clearing priority SKUs: ${clearError.message}`);
      }
      
      // Then, insert new priority flags
      if (prioritySkus.length > 0) {
        const priorityRecords = prioritySkus.map(sku_code => ({
          sku_code,
          is_priority: true
        }));
        
        const { error: insertError } = await supabase
          .from('priority_inputs')
          .insert(priorityRecords);
          
        if (insertError) {
          throw new Error(`Error saving priority SKUs: ${insertError.message}`);
        }
      }
      
      // Save notes
      const { error: notesError } = await supabase
        .from('ai_analysis_notes')
        .insert([{ note_text: notes }]);
        
      if (notesError) {
        throw new Error(`Error saving notes: ${notesError.message}`);
      }
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres de simulation ont été enregistrés avec succès.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paramètres.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const togglePrioritySku = (sku: string) => {
    if (prioritySkus.includes(sku)) {
      setPrioritySkus(prioritySkus.filter(s => s !== sku));
    } else {
      setPrioritySkus([...prioritySkus, sku]);
    }
  };

  const formatBudget = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Simulation</h2>
          <div className="w-32 h-8 bg-gray-700 animate-pulse rounded"></div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Budget</h3>
          <div className="h-10 bg-gray-700 animate-pulse rounded"></div>
          <div className="w-full h-32 bg-gray-700 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Simulation</h2>
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les paramètres
            </>
          )}
        </Button>
      </div>
      
      {/* Budget Slider */}
      <div className="space-y-4 p-6 border border-[#272727] rounded-lg bg-[#161616]">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Budget de Restock</h3>
          <div className="text-xl font-bold text-primary">{formatBudget(budget)}</div>
        </div>
        
        <Slider 
          value={[budget]} 
          min={0} 
          max={1000000} 
          step={10000}
          onValueChange={(values) => setBudget(values[0])}
          className="my-6"
        />
        
        <div className="flex justify-between text-sm text-gray-400">
          <span>0 €</span>
          <span>250k €</span>
          <span>500k €</span>
          <span>750k €</span>
          <span>1M €</span>
        </div>
      </div>
      
      {/* Product Priority Selection */}
      <div className="space-y-4 p-6 border border-[#272727] rounded-lg bg-[#161616]">
        <h3 className="text-lg font-medium">Produits Prioritaires</h3>
        <p className="text-sm text-gray-400">
          Sélectionnez les SKUs à prioriser pour l'analyse AI.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {products.map((product) => (
            <div 
              key={product.id}
              className={`
                flex justify-between items-center p-3 rounded-md border 
                ${prioritySkus.includes(product.SKU) 
                  ? 'border-primary bg-primary/10' 
                  : 'border-[#272727] bg-[#1A1A1A]'}
              `}
            >
              <div className="overflow-hidden">
                <div className="font-medium truncate">{product.SKU}</div>
                <div className="text-sm text-gray-400 truncate">{product.product_name}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => togglePrioritySku(product.SKU)}
              >
                {prioritySkus.includes(product.SKU) ? (
                  <MinusCircle className="h-5 w-5 text-primary" />
                ) : (
                  <PlusCircle className="h-5 w-5" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Notes for AI */}
      <div className="space-y-4 p-6 border border-[#272727] rounded-lg bg-[#161616]">
        <h3 className="text-lg font-medium">Notes pour l'Analyse AI</h3>
        <p className="text-sm text-gray-400">
          Ajoutez des instructions ou commentaires pour l'analyse AI.
        </p>
        
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ajoutez vos instructions ou remarques ici..."
          className="min-h-[150px] bg-[#1A1A1A] border-[#272727]"
        />
      </div>
    </div>
  );
};

export default SimulationPage;
