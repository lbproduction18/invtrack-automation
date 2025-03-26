
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Save, Sparkles } from "lucide-react";

interface BudgetSettings {
  id: string;
  total_budget: number;
  deposit_percentage: number;
  notes: string | null;
}

interface BudgetSettingsPanelProps {
  totalOrderAmount: number;
  onCreateOrder: () => void;
}

const BudgetSettingsPanel: React.FC<BudgetSettingsPanelProps> = ({
  totalOrderAmount,
  onCreateOrder
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<BudgetSettings>({
    id: '',
    total_budget: 300000,
    deposit_percentage: 50,
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch budget settings from Supabase
  useEffect(() => {
    const fetchBudgetSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('budget_settings')
          .select('*')
          .limit(1)
          .single();
          
        if (error) {
          console.error('Error fetching budget settings:', error);
          throw error;
        }
        
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to fetch budget settings:', err);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres budgétaires.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBudgetSettings();
  }, [toast]);

  // Handle saving budget settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('budget_settings')
        .update({
          total_budget: settings.total_budget,
          deposit_percentage: settings.deposit_percentage,
          notes: settings.notes
        })
        .eq('id', settings.id);
        
      if (error) throw error;
      
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres budgétaires ont été mis à jour avec succès."
      });
    } catch (err) {
      console.error('Error saving budget settings:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres budgétaires.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate budget metrics
  const depositAmount = totalOrderAmount * (settings.deposit_percentage / 100);
  const remainingBudget = settings.total_budget - totalOrderAmount;
  const budgetPercentage = (totalOrderAmount / settings.total_budget) * 100;

  return (
    <Card className="border border-[#272727] bg-[#161616] shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span>Résumé Budgétaire</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            <Save className="h-3.5 w-3.5 mr-1" />
            Enregistrer
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Budget Input */}
        <div>
          <Label htmlFor="budget" className="text-sm text-gray-400">
            BUDGET POUR LE BON DE COMMANDE
          </Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="budget"
              type="number"
              value={settings.total_budget}
              onChange={(e) => setSettings({...settings, total_budget: parseFloat(e.target.value) || 0})}
              className="bg-[#1A1A1A]"
            />
            <span className="text-sm">€</span>
          </div>
        </div>
        
        {/* Deposit Percentage */}
        <div>
          <Label htmlFor="deposit" className="text-sm text-gray-400">
            POURCENTAGE DU DÉPÔT
          </Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="deposit"
              type="number"
              value={settings.deposit_percentage}
              onChange={(e) => setSettings({...settings, deposit_percentage: parseFloat(e.target.value) || 0})}
              min="0"
              max="100"
              className="bg-[#1A1A1A]"
            />
            <span className="text-sm">%</span>
          </div>
        </div>
        
        {/* Budget Summary */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm border-b border-[#272727] pb-1">
            <span className="text-gray-400">TOTAL DU BON DE COMMANDE</span>
            <span className="font-medium">{totalOrderAmount.toLocaleString()} €</span>
          </div>
          
          <div className="flex justify-between text-sm border-b border-[#272727] pb-1">
            <span className="text-gray-400">TOTAL DÉPÔT ({settings.deposit_percentage}%)</span>
            <span className="font-medium">{depositAmount.toLocaleString()} €</span>
          </div>
          
          <div className="flex justify-between text-sm border-b border-[#272727] pb-1">
            <span className="text-gray-400">BUDGET CASH RESTANT</span>
            <span className={`font-medium ${remainingBudget < 0 ? 'text-red-400' : ''}`}>
              {remainingBudget.toLocaleString()} €
            </span>
          </div>
          
          <div className="text-sm pb-1">
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">% DÉPENSÉ DU BUDGET</span>
              <span className="font-medium">{budgetPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(budgetPercentage, 100)} className="h-2" />
          </div>
        </div>
        
        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="text-sm text-gray-400">
            NOTES
          </Label>
          <Textarea
            id="notes"
            value={settings.notes || ''}
            onChange={(e) => setSettings({...settings, notes: e.target.value})}
            placeholder="Ajoutez des notes concernant le budget..."
            className="mt-1 h-24 bg-[#1A1A1A]"
          />
        </div>
        
        {/* Action buttons */}
        <div className="space-y-2 pt-2">
          <Button 
            className="w-full"
            onClick={onCreateOrder}
            disabled={totalOrderAmount <= 0}
          >
            <ChevronRight className="mr-1 h-4 w-4" />
            Passer à la commande
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            disabled={true} // Will be enabled in future
          >
            <Sparkles className="mr-1 h-4 w-4" />
            Optimiser avec l'IA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSettingsPanel;
