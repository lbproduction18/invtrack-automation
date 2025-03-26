
import React from 'react';
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
import { ShoppingCart } from 'lucide-react';

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
    status: 'critical'
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
    status: 'warning'
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
    status: 'critical'
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
    status: 'warning'
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
    status: 'warning'
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
    status: 'critical'
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
    status: 'critical'
  }
];

export const LowStockTable: React.FC = () => {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  
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
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Price</TableHead>
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
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">
                  <span className={item.status === 'critical' ? 'text-danger' : 'text-warning'}>
                    {item.current}
                  </span>
                  {' / '}
                  <span className="text-muted-foreground">{item.minimum}</span>
                </TableCell>
                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant="outline" 
                    className={
                      item.status === 'critical' 
                        ? 'border-danger/50 text-danger bg-danger/10' 
                        : 'border-warning/50 text-warning bg-warning/10'
                    }
                  >
                    {item.status === 'critical' ? 'Critical' : 'Low'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
