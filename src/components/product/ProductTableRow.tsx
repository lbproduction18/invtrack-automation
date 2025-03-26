import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { type Product } from '@/types/product';
import { type ColumnVisibility } from './ColumnVisibilityDropdown';
import { PriorityBadge } from './PriorityBadge';
import { PriorityDialog } from './PriorityDialog';
import { CheckIcon, ClockIcon, InfoIcon, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Helper functions
const getDaysSinceAdded = (createdDate: string): number => {
  const created = new Date(createdDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - created.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getAgingColor = (days: number): string => {
  if (days < 7) {
    return "text-success font-medium"; // Vert pour moins d'une semaine
  } else if (days < 14) {
    return "text-warning font-medium"; // Orange pour 1-2 semaines
  } else {
    return "text-danger font-medium"; // Rouge pour plus de 2 semaines
  }
};

// Déterminer le type de note basé sur son contenu
const getNoteType = (noteText: string): "warning" | "info" | "success" | "pending" => {
  const lowerText = noteText.toLowerCase();
  
  if (lowerText.includes("urgent") || lowerText.includes("attention") || lowerText.includes("problème") || lowerText.includes("alerte")) {
    return "warning";
  } else if (lowerText.includes("validé") || lowerText.includes("traité") || lowerText.includes("résolu") || lowerText.includes("ok")) {
    return "success";
  } else if (lowerText.includes("attente") || lowerText.includes("en cours") || lowerText.includes("suivi")) {
    return "pending";
  } else {
    return "info";
  }
};

// Obtenir l'icône de la note en fonction de son type
const getNoteIcon = (type: "warning" | "info" | "success" | "pending") => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    case "success":
      return <CheckCircle className="h-5 w-5 text-success" />;
    case "pending":
      return <Clock className="h-5 w-5 text-info" />;
    case "info":
    default:
      return <InfoIcon className="h-5 w-5 text-info" />;
  }
};

// Obtenir les styles de la note en fonction de son type
const getNoteStyles = (type: "warning" | "info" | "success" | "pending") => {
  switch (type) {
    case "warning":
      return {
        bg: "bg-warning/10",
        hover: "hover:bg-warning/20",
        border: "border-warning",
        text: "text-warning-foreground",
        cardBg: "bg-warning/15"
      };
    case "success":
      return {
        bg: "bg-success/10",
        hover: "hover:bg-success/20",
        border: "border-success",
        text: "text-success-foreground",
        cardBg: "bg-success/15"
      };
    case "pending":
      return {
        bg: "bg-info/10",
        hover: "hover:bg-info/20",
        border: "border-info",
        text: "text-info-foreground",
        cardBg: "bg-info/15"
      };
    case "info":
    default:
      return {
        bg: "bg-primary/10",
        hover: "hover:bg-primary/20",
        border: "border-primary",
        text: "text-primary-foreground",
        cardBg: "bg-primary/15"
      };
  }
};

// Formater le texte de la note pour mettre en évidence certains mots clés
const formatNoteText = (text: string) => {
  if (!text) return "";
  
  // Liste des mots-clés à mettre en gras
  const keywords = ["urgent", "attention", "validé", "traité", "résolu", "en attente", "suivi", "ok", "problème", "alerte", "dossier"];
  
  // Split le texte en fragments et mettre en gras les mots-clés
  let formattedText = text;
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    formattedText = formattedText.replace(regex, '<strong>$1</strong>');
  });
  
  return formattedText;
};

// Obtenir les styles en fonction de la priorité
const getPriorityStyles = (priority: 'standard' | 'moyen' | 'prioritaire') => {
  switch (priority) {
    case 'prioritaire':
      return {
        bg: "bg-red-900/20",
        hover: "hover:bg-red-900/30",
        border: "border-red-900/30"
      };
    case 'moyen':
      return {
        bg: "bg-orange-900/20",
        hover: "hover:bg-orange-900/30",
        border: "border-orange-900/30"
      };
    case 'standard':
    default:
      return {
        bg: "",
        hover: "hover:bg-muted/30",
        border: ""
      };
  }
};

interface ProductTableRowProps {
  product: Product;
  columnVisibility: ColumnVisibility[];
  onPriorityChange?: (productId: string, newPriority: 'standard' | 'moyen' | 'prioritaire') => void;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  columnVisibility,
  onPriorityChange = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNoteTreated, setIsNoteTreated] = useState(false);
  
  // Sort columns by order
  const sortedColumns = [...columnVisibility].sort((a, b) => a.order - b.order);

  const toggleExpand = () => {
    if (product.note) {
      setIsExpanded(!isExpanded);
    }
  };

  // Determine if this product has a note to apply special styling
  const hasNote = Boolean(product.note);
  
  // Déterminer le type de note et les styles associés
  const noteType = hasNote ? getNoteType(product.note || "") : "info";
  const noteStyles = getNoteStyles(noteType);
  const noteIcon = getNoteIcon(noteType);
  const formattedNoteText = hasNote ? formatNoteText(product.note || "") : "";

  // Obtenir les styles basés sur la priorité
  const priorityStyles = getPriorityStyles(product.priority_badge);

  // Format de la date pour l'affichage dans la note
  const formattedDate = new Date(product.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <>
      <TableRow className={cn(
        "transition-colors", 
        priorityStyles.bg || (hasNote ? `${noteStyles.bg}` : ""),
        priorityStyles.hover || (hasNote ? `${noteStyles.hover}` : "hover:bg-muted/30"),
        hasNote && `border-l-4 ${priorityStyles.border || `border-l-${noteStyles.border}`}`
      )}>
        {sortedColumns.map(column => {
          if (!column.isVisible) return null;
          
          switch(column.id) {
            case 'SKU':
              return (
                <TableCell key={`${product.id}-${column.id}`} className="font-medium whitespace-nowrap p-1 text-left pl-3">
                  {product.SKU}
                </TableCell>
              );
            case 'date':
              return (
                <TableCell key={`${product.id}-${column.id}`} className="whitespace-nowrap p-1 text-center">
                  {new Date(product.created_at).toLocaleDateString('fr-FR', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
              );
            case 'age':
              return (
                <TableCell 
                  key={`${product.id}-${column.id}`} 
                  className={cn("text-center whitespace-nowrap p-1", getAgingColor(getDaysSinceAdded(product.created_at)))}
                >
                  {getDaysSinceAdded(product.created_at)} j
                </TableCell>
              );
            case 'priority':
              return (
                <TableCell key={`${product.id}-${column.id}`} className="whitespace-nowrap p-1 text-center">
                  <PriorityDialog
                    productId={product.id}
                    currentPriority={product.priority_badge}
                    onPriorityChange={(newPriority) => onPriorityChange(product.id, newPriority)}
                  >
                    <div className="cursor-pointer flex justify-center">
                      <PriorityBadge priority={product.priority_badge} />
                    </div>
                  </PriorityDialog>
                </TableCell>
              );
            case 'stock':
              return (
                <TableCell key={`${product.id}-${column.id}`} className="text-center font-medium whitespace-nowrap p-1">
                  {product.current_stock}
                </TableCell>
              );
            case 'threshold':
              return (
                <TableCell key={`${product.id}-${column.id}`} className="text-center font-medium whitespace-nowrap p-1">
                  {product.threshold}
                </TableCell>
              );
            case 'note':
              return (
                <TableCell key={`${product.id}-${column.id}`} className="text-center whitespace-nowrap p-1">
                  {product.note ? (
                    <button 
                      onClick={toggleExpand}
                      className={cn(
                        "inline-flex items-center justify-center rounded-full p-1 transition-colors animate-pulse",
                        `${noteStyles.bg} hover:${noteStyles.hover} text-${noteStyles.text}`
                      )}
                      aria-label="Voir la note"
                    >
                      {noteIcon}
                    </button>
                  ) : null}
                </TableCell>
              );
            default:
              return null;
          }
        })}
      </TableRow>
      
      {isExpanded && product.note && (
        <TableRow className={cn(
          priorityStyles.bg || `${noteStyles.bg}`,
          "border-t-0",
          `border-l-4 ${priorityStyles.border || `border-l-${noteStyles.border}`}`
        )}>
          <TableCell colSpan={sortedColumns.filter(col => col.isVisible).length} className="p-0">
            <div className={cn(
              "m-2 p-4 rounded-lg shadow-sm",
              noteStyles.cardBg,
              "border border-" + noteStyles.border
            )}>
              <div className="flex flex-col space-y-3">
                {/* En-tête de la note */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {noteIcon}
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
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
