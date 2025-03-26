
import { type Product } from '@/types/product';

// Get styles based on priority
export const getPriorityStyles = (priority: Product['priority_badge']) => {
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
