
import { type PriorityLevel } from '@/types/product';

export const getPriorityStyles = (priorityBadge?: PriorityLevel) => {
  switch (priorityBadge) {
    case 'prioritaire':
      return {
        bg: "bg-red-950/30",
        hover: "hover:bg-red-950/40",
        border: "border-red-700",
        text: "text-red-400"
      };
    case 'important':
      return {
        bg: "bg-amber-950/30",
        hover: "hover:bg-amber-950/40",
        border: "border-amber-700",
        text: "text-amber-400"
      };
    case 'moyen':
      return {
        bg: "bg-orange-950/30",
        hover: "hover:bg-orange-950/40",
        border: "border-orange-700",
        text: "text-orange-400"
      };
    default:
      return {
        bg: "",
        hover: "",
        border: "",
        text: ""
      };
  }
};
