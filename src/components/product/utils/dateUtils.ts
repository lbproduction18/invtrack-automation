
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Locale } from 'date-fns';

// Get the number of days since the product was added
export const getDaysSinceAdded = (createdDate: string): number => {
  const created = new Date(createdDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get the color class based on the age of the product
export const getAgingColor = (days: number): string => {
  if (days <= 14) return "text-green-500";
  if (days <= 30) return "text-yellow-500";
  if (days <= 60) return "text-orange-500";
  return "text-red-500";
};

// Format a date string with various options
export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions | { locale?: Locale, month?: string, day?: string, year?: string }) => {
  const date = new Date(dateString);
  
  // Check if options is using Intl.DateTimeFormatOptions or date-fns format options
  if (options && ('locale' in options || 'month' in options || 'day' in options || 'year' in options)) {
    // Using date-fns format
    return format(date, 'dd MMM yyyy', { locale: fr });
  } else {
    // Using Intl.DateTimeFormatOptions
    return new Intl.DateTimeFormat('fr-FR', options as Intl.DateTimeFormatOptions).format(date);
  }
};
