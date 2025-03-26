
import { type Product } from '@/types/product';

// Get styles based on priority
export const getPriorityStyles = (priority: Product['priority_badge']) => {
  switch (priority) {
    case 'prioritaire':
      return {
        bg: "bg-red-100/60",  // Much lighter red background
        hover: "hover:bg-red-100/80",  // Subtle hover effect
        border: "border-red-200/60",   // Lighter border
        text: "text-red-800"           // Darker red text for contrast on light background
      };
    case 'moyen':
      return {
        bg: "bg-orange-100/60",  // Much lighter orange background
        hover: "hover:bg-orange-100/80",
        border: "border-orange-200/60",
        text: "text-orange-800"  // Darker orange text for contrast
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
