
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'dd MMMM yyyy', { locale: fr });
  } catch (e) {
    return dateString;
  }
};
