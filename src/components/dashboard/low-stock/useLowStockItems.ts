
import { useState } from 'react';

// Mock data for low stock items
const lowStockItems = [
  {
    id: '1',
    name: 'Wireless Earbuds Pro',
    sku: 'WEP-001',
    category: 'Electronics',
    current: 5,
    minimum: 10,
    supplier: 'Tech Distributors',
    price: 89.99,
    status: 'low',
    added: '2023-11-15'
  },
  {
    id: '2',
    name: 'Premium Cotton T-Shirt',
    sku: 'PCT-023',
    category: 'Clothing',
    current: 12,
    minimum: 25,
    supplier: 'Fashion Wholesale',
    price: 24.99,
    status: 'low',
    added: '2023-12-22'
  },
  {
    id: '3',
    name: 'Smart Home Hub',
    sku: 'SHH-105',
    category: 'Electronics',
    current: 3,
    minimum: 15,
    supplier: 'Tech Distributors',
    price: 129.95,
    status: 'low',
    added: '2024-01-10'
  },
  {
    id: '4',
    name: 'Ceramic Coffee Mug Set',
    sku: 'CCM-042',
    category: 'Home Goods',
    current: 8,
    minimum: 20,
    supplier: 'Home Essentials Co.',
    price: 35.50,
    status: 'low',
    added: '2024-02-05'
  },
  {
    id: '5',
    name: 'Leather Wallet',
    sku: 'LW-078',
    category: 'Accessories',
    current: 7,
    minimum: 15,
    supplier: 'Accessory World',
    price: 49.99,
    status: 'low',
    added: '2024-03-18'
  },
  {
    id: '6',
    name: 'Portable Bluetooth Speaker',
    sku: 'PBS-112',
    category: 'Electronics',
    current: 2,
    minimum: 12,
    supplier: 'Sound Systems Inc.',
    price: 75.00,
    status: 'low',
    added: '2024-04-02'
  },
  {
    id: '7',
    name: 'Moisturizing Face Cream',
    sku: 'MFC-201',
    category: 'Beauty',
    current: 4,
    minimum: 10,
    supplier: 'Beauty Essentials',
    price: 28.99,
    status: 'low',
    added: '2024-05-11'
  }
];

export function useLowStockItems() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [manualStatuses, setManualStatuses] = useState<Record<string, 'high' | 'medium' | 'low' | null>>({});
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  
  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  const toggleAll = () => {
    setSelectedItems(
      selectedItems.length === lowStockItems.length 
        ? [] 
        : lowStockItems.map(item => item.id)
    );
  };

  const changeStatus = (id: string, newStatus: 'high' | 'medium' | 'low') => {
    setManualStatuses(prev => ({
      ...prev,
      [id]: newStatus
    }));
    setEditingStatus(null);
  };

  return {
    lowStockItems,
    selectedItems,
    manualStatuses,
    editingStatus,
    toggleItem,
    toggleAll,
    setEditingStatus,
    changeStatus
  };
}
