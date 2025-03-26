
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Edit, Check } from 'lucide-react';
import { StockStatusBadge } from '@/components/product/StockStatusBadge';

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

export const LowStockTable: React.FC = () => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const changeStatus = (id: string, newStatus: 'high' | 'medium' | 'low') => {
    setManualStatuses(prev => ({
      ...prev,
      [id]: newStatus
    }));
    setEditingStatus(null);
  };

  return (
    <div>
      {selectedItems.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-md p-2 mb-4 flex justify-between items-center">
          <span className="text-sm">
            {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
          </span>
          <Button size="sm" variant="outline" className="h-8">
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            Order Selected
          </Button>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedItems.length === lowStockItems.length && lowStockItems.length > 0} 
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Minimum</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockItems.map((item) => (
              <TableRow key={item.id} className="table-row-glass">
                <TableCell>
                  <Checkbox 
                    checked={selectedItems.includes(item.id)} 
                    onCheckedChange={() => toggleItem(item.id)}
                    aria-label={`Select ${item.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell className="text-right">
                  <span className={item.current <= 0 ? 'text-danger' : ''}>
                    {item.current}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-muted-foreground">{item.minimum}</span>
                </TableCell>
                <TableCell>{formatDate(item.added)}</TableCell>
                <TableCell className="text-right">
                  {editingStatus === item.id ? (
                    <div className="flex justify-end space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0" 
                        onClick={() => changeStatus(item.id, 'low')}
                      >
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border border-green-900/20 px-2 py-0.5">
                          Basse
                        </Badge>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0" 
                        onClick={() => changeStatus(item.id, 'medium')}
                      >
                        <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border border-yellow-900/20 px-2 py-0.5">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          Moyenne
                        </Badge>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0" 
                        onClick={() => changeStatus(item.id, 'high')}
                      >
                        <Badge variant="outline" className="bg-red-900/30 text-red-400 border border-red-900/20 px-2 py-0.5">
                          <Flag className="h-3 w-3 mr-1" />
                          Haute
                        </Badge>
                      </Button>
                    </div>
                  ) : (
                    <StockStatusBadge 
                      stock={item.current} 
                      threshold={item.minimum} 
                      manualStatus={manualStatuses[item.id] || null} 
                    />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    {editingStatus === item.id ? (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => setEditingStatus(null)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => setEditingStatus(item.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
