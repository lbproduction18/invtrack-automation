
import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  ArrowDown, 
  ArrowUp,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Mock inventory data
const inventoryData = [
  {
    id: '1',
    name: 'Wireless Earbuds Pro',
    sku: 'WEP-001',
    category: 'Electronics',
    stock: 5,
    threshold: 10,
    price: 89.99,
    status: 'low',
    lastUpdated: '2023-10-12'
  },
  {
    id: '2',
    name: 'Premium Cotton T-Shirt',
    sku: 'PCT-023',
    category: 'Clothing',
    stock: 34,
    threshold: 25,
    price: 24.99,
    status: 'in-stock',
    lastUpdated: '2023-10-14'
  },
  {
    id: '3',
    name: 'Smart Home Hub',
    sku: 'SHH-105',
    category: 'Electronics',
    stock: 3,
    threshold: 15,
    price: 129.95,
    status: 'low',
    lastUpdated: '2023-10-10'
  },
  {
    id: '4',
    name: 'Ceramic Coffee Mug Set',
    sku: 'CCM-042',
    category: 'Home Goods',
    stock: 8,
    threshold: 20,
    price: 35.50,
    status: 'low',
    lastUpdated: '2023-10-13'
  },
  {
    id: '5',
    name: 'Leather Wallet',
    sku: 'LW-078',
    category: 'Accessories',
    stock: 25,
    threshold: 15,
    price: 49.99,
    status: 'in-stock',
    lastUpdated: '2023-10-08'
  },
  {
    id: '6',
    name: 'Portable Bluetooth Speaker',
    sku: 'PBS-112',
    category: 'Electronics',
    stock: 2,
    threshold: 12,
    price: 75.00,
    status: 'low',
    lastUpdated: '2023-10-11'
  },
  {
    id: '7',
    name: 'Moisturizing Face Cream',
    sku: 'MFC-201',
    category: 'Beauty',
    stock: 18,
    threshold: 10,
    price: 28.99,
    status: 'in-stock',
    lastUpdated: '2023-10-09'
  },
  {
    id: '8',
    name: 'Stainless Steel Water Bottle',
    sku: 'SSWB-087',
    category: 'Home Goods',
    stock: 29,
    threshold: 20,
    price: 19.95,
    status: 'in-stock',
    lastUpdated: '2023-10-15'
  },
  {
    id: '9',
    name: 'Wireless Charging Pad',
    sku: 'WCP-056',
    category: 'Electronics',
    stock: 7,
    threshold: 15,
    price: 45.99,
    status: 'low',
    lastUpdated: '2023-10-07'
  },
  {
    id: '10',
    name: 'Designer Sunglasses',
    sku: 'DS-129',
    category: 'Accessories',
    stock: 14,
    threshold: 10,
    price: 129.99,
    status: 'in-stock',
    lastUpdated: '2023-10-13'
  }
];

const Inventory: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Handle item selection
  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // Handle select all
  const toggleAll = () => {
    setSelectedItems(
      selectedItems.length === filteredItems.length 
        ? [] 
        : filteredItems.map(item => item.id)
    );
  };

  // Format date to MM/DD/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // Filter inventory data
  const filteredItems = inventoryData.filter(item => {
    // Apply search filter
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Status badge component
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    if (status === 'low') {
      return <Badge variant="outline" className="border-warning/50 text-warning bg-warning/10">Low Stock</Badge>;
    } else if (status === 'in-stock') {
      return <Badge variant="outline" className="border-success/50 text-success bg-success/10">In Stock</Badge>;
    } else if (status === 'out-of-stock') {
      return <Badge variant="outline" className="border-danger/50 text-danger bg-danger/10">Out of Stock</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage and track your product inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <ArrowDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Card className="card-glass">
        <CardHeader className="px-6">
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            View and manage all your products
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products by name or SKU..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Home Goods">Home Goods</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {selectedItems.length > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-md p-2 mb-4 flex justify-between items-center">
              <span className="text-sm">
                {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8">
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-danger border-danger/20 hover:bg-danger/10">
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0} 
                      onCheckedChange={toggleAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
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
                      <span className={item.stock < item.threshold ? 'text-warning' : ''}>
                        {item.stock}
                      </span>
                      {' / '}
                      <span className="text-muted-foreground">{item.threshold}</span>
                    </TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(item.lastUpdated)}</TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit product</DropdownMenuItem>
                          <DropdownMenuItem>Update stock</DropdownMenuItem>
                          <DropdownMenuItem>View history</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-danger">Delete product</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="h-8 w-8 mb-2 opacity-50" />
                        <p>No products found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {inventoryData.length} products
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary/10">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
