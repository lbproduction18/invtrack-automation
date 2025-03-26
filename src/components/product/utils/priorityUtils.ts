
import { type Product } from '@/types/product';

// Get styles based on priority
export const getPriorityStyles = (priority: Product['priority_badge']) => {
  switch (priority) {
    case 'prioritaire':
      return {
        bg: "bg-red-900/40",  // Increased opacity/saturation
        hover: "hover:bg-red-900/50",  // Darker hover state
        border: "border-red-900/50"    // More visible border
      };
    case 'moyen':
      return {
        bg: "bg-orange-500/30",  // Changed from orange-900 to orange-500 for more distinction
        hover: "hover:bg-orange-500/40",
        border: "border-orange-500/40"
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
