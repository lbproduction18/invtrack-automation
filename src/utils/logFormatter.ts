
/**
 * Format a date string to a more readable format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
}

/**
 * Format the field changes between old and new values
 */
export function formatChanges(oldValues: Record<string, any> | null, newValues: Record<string, any> | null): string {
  if (!oldValues || !newValues) return 'No details available';
  
  const changes: string[] = [];
  
  // Get all keys from both objects
  const allKeys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);
  
  allKeys.forEach(key => {
    const oldValue = oldValues[key];
    const newValue = newValues[key];
    
    // Skip if values are the same or both undefined/null
    if (oldValue === newValue) return;
    if (oldValue === undefined && newValue === null) return;
    if (oldValue === null && newValue === undefined) return;
    
    // Skip certain fields that are typically not interesting to show
    if (['id', 'created_at', 'updated_at'].includes(key)) return;
    
    // Format the change description
    const oldValueStr = oldValue !== undefined && oldValue !== null ? oldValue.toString() : 'N/A';
    const newValueStr = newValue !== undefined && newValue !== null ? newValue.toString() : 'N/A';
    
    changes.push(`${formatFieldName(key)}: ${oldValueStr} → ${newValueStr}`);
  });
  
  return changes.length ? changes.join(', ') : 'No significant changes';
}

/**
 * Format field names to be more readable
 */
export function formatFieldName(fieldName: string): string {
  switch (fieldName) {
    case 'sku_code': return 'SKU';
    case 'product_name': return 'Product';
    case 'stock': return 'Stock';
    case 'threshold': return 'Threshold';
    case 'price_1000': return 'Price (1000)';
    case 'price_2000': return 'Price (2000)';
    case 'price_3000': return 'Price (3000)';
    case 'price_4000': return 'Price (4000)';
    case 'price_5000': return 'Price (5000)';
    case 'price_8000': return 'Price (8000)';
    case 'note': return 'Note';
    case 'last_order_date': return 'Last Order Date';
    case 'status': return 'Status';
    case 'priority_badge': return 'Priority';
    default: return fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}

/**
 * Get color for action type badge
 */
export function getActionTypeColor(actionType: string): string {
  switch (actionType.toUpperCase()) {
    case 'INSERT':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'UPDATE':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'DELETE':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
}

/**
 * Format log entry details
 */
export function formatLogEntry(log: any): string {
  if (log.action_type === 'UPDATE' && log.old_values && log.new_values) {
    return formatChanges(log.old_values, log.new_values);
  } else if (log.action_type === 'INSERT') {
    return 'New item created';
  } else if (log.action_type === 'DELETE') {
    return 'Item deleted';
  }
  return log.note || 'No details available';
}
