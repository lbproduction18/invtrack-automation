
import React from 'react';

/**
 * Utility functions for price formatting
 */

/**
 * Format a price for display in the price grid
 */
export const formatPrice = (price: number | null): React.ReactNode => {
  if (price === null || price === 0) {
    return <span className="text-gray-500">—</span>;
  }
  return <span className="tabular-nums font-medium">${price.toFixed(2)}</span>;
};

/**
 * Format a total price for display
 */
export const formatTotalPrice = (price: number): string => {
  return price.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' });
};
