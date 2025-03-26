
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
      "m-2 p-4 rounded-lg shadow-sm",
      noteStyles.cardBg,
      "border border-" + noteStyles.border
    )}>
      <div className="flex flex-col space-y-3">
        {/* En-tête de la note */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className={iconClassName} />
            <span className={cn("font-bold text-sm uppercase tracking-wider", `text-${noteStyles.text}`)}>
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
                isNoteTreated ? "bg-success hover:bg-success/80" : "border-muted-foreground hover:bg-muted/20"
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
        <div className={cn("text-foreground font-medium text-sm px-2 py-1")}>
          <div dangerouslySetInnerHTML={{ __html: formattedNoteText }} />
        </div>
        
        {/* Pied de la note */}
        <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border/30">
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
