
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseNoteEditorProps {
  itemId: string;
  initialNote: string | null;
  tableType: 'analysis_items' | 'Low stock product';
}

export function useNoteEditor({ itemId, initialNote, tableType }: UseNoteEditorProps) {
  const [note, setNote] = useState<string | null>(initialNote);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [noteType, setNoteType] = useState<'info' | 'warning'>('info');
  const { toast } = useToast();

  const determineNoteType = (noteText: string | null): 'info' | 'warning' => {
    if (!noteText) return 'info';
    
    const lowerCase = noteText.toLowerCase();
    if (
      lowerCase.includes('attention') || 
      lowerCase.includes('urgence') || 
      lowerCase.includes('problème') ||
      lowerCase.includes('probleme') ||
      lowerCase.includes('urgent') ||
      lowerCase.includes('warning') ||
      lowerCase.includes('alerte')
    ) {
      return 'warning';
    }
    
    return 'info';
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (newNote: string) => {
    if (newNote === note) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from(tableType)
        .update({ note: newNote })
        .eq('id', itemId);
      
      if (error) throw error;
      
      setNote(newNote);
      setNoteType(determineNoteType(newNote));
      toast({
        title: "Note enregistrée",
        description: "La note a été mise à jour avec succès."
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la note. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
    }
  };

  return {
    note,
    isEditing,
    isUpdating,
    noteType: determineNoteType(note),
    handleEdit,
    handleCancel,
    handleSave
  };
}
