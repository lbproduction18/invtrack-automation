
import { type Product } from '@/types/product';

// Get styles based on priority
export const getPriorityStyles = (priority: Product['priority_badge']) => {
  switch (priority) {
    case 'prioritaire':
      return {
        bg: "bg-red-950/50",  // Plus foncé et plus visible
        hover: "hover:bg-red-950/60",  // Encore plus foncé au survol
        border: "border-red-600",      // Bordure plus visible
        text: "text-red-500"           // Texte rouge clair pour meilleur contraste
      };
    case 'moyen':
      return {
        bg: "bg-orange-400/30",        // Orange plus vif et visible
        hover: "hover:bg-orange-400/40", 
        border: "border-orange-500",   // Bordure orange vif
        text: "text-orange-500"        // Texte orange
      };
    case 'standard':
    default:
      return {
        bg: "",
        hover: "hover:bg-muted/30",
        border: "",
        text: "text-slate-500"         // Texte gris-bleu pour standard
      };
  }
};
