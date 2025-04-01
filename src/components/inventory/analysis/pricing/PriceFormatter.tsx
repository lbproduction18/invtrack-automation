
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
  return `$${price.toFixed(2)}`;
};

/**
 * Format a total price for display
 */
export const formatTotalPrice = (price: number): string => {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
