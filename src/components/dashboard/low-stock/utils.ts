
/**
 * Formats a date string to DD/MM format (without the year)
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }
  
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

/**
 * Cycles through status values in a specific order
 */
export const getNextStatus = (currentStatus: 'high' | 'medium' | 'low' | null): 'high' | 'medium' | 'low' => {
  if (currentStatus === null || currentStatus === 'high') {
    return 'low';
  } else if (currentStatus === 'low') {
    return 'medium';
  } else {
    return 'high';
  }
};
