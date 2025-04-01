
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Info, AlertTriangle, Loader2, X, Save } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDate } from '@/components/dashboard/low-stock/utils';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  note: string | null;
  isEditing: boolean;
  isUpdating: boolean;
  noteType: 'info' | 'warning';
  onEdit: () => void;
  onCancel: () => void;
  onSave: (note: string) => void;
  createdAt?: string;
  author?: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  isEditing,
  isUpdating,
  noteType = 'info',
  onEdit,
  onCancel,
  onSave,
  createdAt,
  author = 'Admin',
}) => {
  const [value, setValue] = useState(note || '');
  
  const handleSave = () => {
    onSave(value);
  };

  // Background and border colors based on note type
  const colors = {
    info: {
      bg: 'bg-sky-950/10',
      border: 'border-sky-700',
      text: 'text-sky-500',
      title: 'NOTE INFORMATIVE'
    },
    warning: {
      bg: 'bg-amber-950/10',
      border: 'border-amber-700',
      text: 'text-amber-500',
      title: 'ATTENTION REQUISE'
    }
  };

  if (isEditing) {
    return (
      <div className={cn(
        "p-3 border-l-4 rounded-md my-2",
        colors[noteType].bg,
        colors[noteType].border
      )}>
        <div className="flex items-center gap-2 mb-2">
          {noteType === 'info' ? (
            <Info className={colors[noteType].text} size={18} />
          ) : (
            <AlertTriangle className={colors[noteType].text} size={18} />
          )}
          <span className={cn("font-semibold", colors[noteType].text)}>
            {colors[noteType].title}
          </span>
        </div>
        
        <Textarea 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ajouter une note..."
          className="min-h-[100px] bg-[#1A1A1A] border-[#272727] mb-2"
        />
        
        <div className="flex justify-between mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="text-xs border-[#272727] bg-[#161616]"
          >
            <X className="mr-1 h-3 w-3" />
            Annuler
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isUpdating}
            className="text-xs border-[#272727] bg-[#161616]"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-1 h-3 w-3" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className={cn(
      "p-3 border-l-4 rounded-md my-2",
      colors[noteType].bg,
      colors[noteType].border
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {noteType === 'info' ? (
            <Info className={colors[noteType].text} size={18} />
          ) : (
            <AlertTriangle className={colors[noteType].text} size={18} />
          )}
          <span className={cn("font-semibold", colors[noteType].text)}>
            {colors[noteType].title}
          </span>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onEdit}
                className="h-6 w-6 p-0"
              >
                <span className="sr-only">Modifier</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Modifier la note</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="text-sm mb-1">
        {note}
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {createdAt && (
          <div>Ajouté le {formatDate(createdAt)}</div>
        )}
        {author && (
          <div>Par: {author}</div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
