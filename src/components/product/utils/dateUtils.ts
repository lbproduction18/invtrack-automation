import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Get days since product was added
export const getDaysSinceAdded = (createdDate: string): number => {
  const created = new Date(createdDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - created.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get color based on age
export const getAgingColor = (days: number): string => {
  if (days < 7) {
    return "text-success font-medium"; // Green for less than a week
  } else if (days < 14) {
    return "text-warning font-medium"; // Orange for 1-2 weeks
  } else {
    return "text-danger font-medium"; // Red for more than 2 weeks
  }
};

// Format date using date-fns (new implementation)
export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions) => {
  try {
    if (options) {
      // If options are provided, use the original implementation
      return new Date(dateString).toLocaleDateString(
        'fr-FR', 
        options
      );
    }
    // Otherwise use the new date-fns implementation
    return format(parseISO(dateString), 'dd MMMM yyyy', { locale: fr });
  } catch (e) {
    return dateString;
  }
};
