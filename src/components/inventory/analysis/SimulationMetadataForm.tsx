
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SimulationMetadata } from '@/types/simulationMetadata';
import { Loader2 } from 'lucide-react';

interface SimulationMetadataFormProps {
  simulation?: SimulationMetadata | null;
  onCreateSimulation: (data: { budget_max: number; ai_notes: string | null; simulation_name: string | null }) => Promise<void>;
  onUpdateSimulation?: (id: string, data: { budget_max: number; ai_notes: string | null; simulation_name: string | null }) => Promise<void>;
  isCreating?: boolean;
  isUpdating?: boolean;
}

const SimulationMetadataForm: React.FC<SimulationMetadataFormProps> = ({
  simulation,
  onCreateSimulation,
  onUpdateSimulation,
  isCreating = false,
  isUpdating = false
}) => {
  const [formData, setFormData] = useState({
    simulation_name: simulation?.simulation_name || 'Nouvelle simulation',
    budget_max: simulation?.budget_max || 300000,
    ai_notes: simulation?.ai_notes || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget_max' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (simulation?.id && onUpdateSimulation) {
      await onUpdateSimulation(simulation.id, {
        budget_max: formData.budget_max,
        ai_notes: formData.ai_notes || null,
        simulation_name: formData.simulation_name || null
      });
    } else {
      await onCreateSimulation({
        budget_max: formData.budget_max,
        ai_notes: formData.ai_notes || null,
        simulation_name: formData.simulation_name || null
      });
    }
  };

  return (
    <Card className="mb-6 border border-[#272727] bg-[#161616]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">
          {simulation ? 'Modifier la simulation' : 'Nouvelle simulation'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="simulation_name">Nom de la simulation</Label>
            <Input
              id="simulation_name"
              name="simulation_name"
              value={formData.simulation_name || ''}
              onChange={handleInputChange}
              className="bg-[#121212] border-[#272727]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget_max">Budget maximum (CAD)</Label>
            <Input
              id="budget_max"
              name="budget_max"
              type="number"
              value={formData.budget_max}
              onChange={handleInputChange}
              className="bg-[#121212] border-[#272727]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ai_notes">Notes pour l'analyse AI</Label>
            <Textarea
              id="ai_notes"
              name="ai_notes"
              value={formData.ai_notes || ''}
              onChange={handleInputChange}
              placeholder="Entrez des notes ou instructions spécifiques pour l'analyse AI..."
              rows={4}
              className="bg-[#121212] border-[#272727]"
            />
          </div>
          
          <Button 
            type="submit"
            disabled={isCreating || isUpdating}
            className="w-full"
          >
            {(isCreating || isUpdating) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {simulation ? 'Mise à jour...' : 'Création...'}
              </>
            ) : (
              simulation ? 'Mettre à jour la simulation' : 'Créer une simulation'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimulationMetadataForm;
