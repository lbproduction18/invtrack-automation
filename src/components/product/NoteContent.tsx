
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, ClockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type NoteType, getNoteIconInfo, getNoteStyles, formatNoteText } from './utils/noteUtils';
import { formatDate } from './utils/dateUtils';

interface NoteContentProps {
  noteText: string;
  noteType: NoteType;
  createdAt: string;
}

export const NoteContent: React.FC<NoteContentProps> = ({
  noteText,
  noteType,
  createdAt
}) => {
  const [isNoteTreated, setIsNoteTreated] = useState(false);
  
  const noteStyles = getNoteStyles(noteType);
  const { icon: IconComponent, className: iconClassName } = getNoteIconInfo(noteType);
  const formattedNoteText = formatNoteText(noteText);
  const formattedDate = formatDate(createdAt);

  return (
    <div className={cn(
      "m-2 p-4 rounded-lg",
      "bg-white dark:bg-black/20", // Simple white/black background like Notion
      "border border-gray-200 dark:border-gray-800" // Subtle border
    )}>
      <div className="flex flex-col space-y-3">
        {/* En-tête de la note */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className={iconClassName} />
            <span className={cn("font-medium text-sm", `text-${noteStyles.text}`)}>
              {noteType === "warning" ? "Attention Requise" : 
               noteType === "success" ? "Traité & Validé" : 
               noteType === "pending" ? "En Attente de Suivi" : "Note Informative"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isNoteTreated ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                isNoteTreated 
                  ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-300 dark:hover:bg-green-900/30" 
                  : "bg-transparent hover:bg-muted/10"
              )}
              onClick={() => setIsNoteTreated(!isNoteTreated)}
            >
              {isNoteTreated ? (
                <span className="flex items-center gap-1">
                  <CheckIcon className="h-3 w-3" />
                  Traité
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  En attente
                </span>
              )}
            </Badge>
          </div>
        </div>
        
        {/* Contenu de la note */}
        <div className={cn("text-foreground font-normal text-sm px-2 py-1")}>
          <div dangerouslySetInnerHTML={{ __html: formattedNoteText }} />
        </div>
        
        {/* Pied de la note */}
        <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            Ajouté le {formattedDate}
          </div>
          <div>
            Par: Admin
          </div>
        </div>
      </div>
    </div>
  );
};
