
import { type Product } from '@/types/product';

// Get styles based on priority
export const getPriorityStyles = (priority: Product['priority_badge']) => {
  switch (priority) {
    case 'prioritaire':
      return {
        bg: "bg-red-50 dark:bg-red-950/20",  // Much lighter background
        hover: "hover:bg-red-100 dark:hover:bg-red-900/30",  // Subtle hover effect
        border: "border-red-200 dark:border-red-800/30",  // Lighter border
        text: "text-red-800 dark:text-red-300"  // Still distinctive text
      };
    case 'moyen':
      return {
        bg: "bg-orange-50 dark:bg-orange-950/20",  // Lighter orange background
        hover: "hover:bg-orange-100 dark:hover:bg-orange-900/30",
        border: "border-orange-200 dark:border-orange-800/30",
        text: "text-orange-800 dark:text-orange-300"
      };
    case 'standard':
    default:
      return {
        bg: "",
        hover: "hover:bg-muted/30",
        border: "",
        text: ""  // Default text color for standard priority
      };
  }
};
