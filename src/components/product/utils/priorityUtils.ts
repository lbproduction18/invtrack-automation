
import { type Product } from '@/types/product';

// Get styles based on priority
export const getPriorityStyles = (priority: Product['priority_badge']) => {
  switch (priority) {
    case 'prioritaire':
      return {
        bg: "bg-red-700/50",  // Stronger red with higher opacity
        hover: "hover:bg-red-700/60",  // More prominent hover
        border: "border-red-600/60",   // Brighter red border
        text: "text-white"             // White text for better contrast on red
      };
    case 'important':
      return {
        bg: "bg-amber-600/50",  // Amber background for important
        hover: "hover:bg-amber-600/60", 
        border: "border-amber-500/60",  
        text: "text-white"      // White text for better contrast on amber
      };
    case 'moyen':
      return {
        bg: "bg-orange-400/40",  // Brighter orange with good opacity
        hover: "hover:bg-orange-400/50",
        border: "border-orange-400/50",
        text: "text-white"       // White text for better contrast on orange
      };
    case 'standard':
    default:
      return {
        bg: "",
        hover: "hover:bg-muted/30",
        border: "",
        text: ""                // Default text color for standard priority
      };
  }
};
