
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
import { Eye } from 'lucide-react';

// Mock data for recent orders
const recentOrders = [
  {
    id: 'PO-2023-051',
    date: '2023-10-15',
    supplier: 'Tech Distributors',
    items: 12,
    total: 1450.75,
    status: 'pending',
    expectedDelivery: '2023-10-22'
  },
  {
    id: 'PO-2023-050',
    date: '2023-10-12',
    supplier: 'Fashion Wholesale',
    items: 35,
    total: 3280.99,
    status: 'processing',
    expectedDelivery: '2023-10-24'
  },
  {
    id: 'PO-2023-049',
    date: '2023-10-09',
    supplier: 'Home Essentials Co.',
    items: 8,
    total: 920.50,
    status: 'shipped',
    expectedDelivery: '2023-10-16'
  },
  {
    id: 'PO-2023-048',
    date: '2023-10-05',
    supplier: 'Beauty Essentials',
    items: 15,
    total: 1875.25,
    status: 'delivered',
    expectedDelivery: '2023-10-12'
  },
  {
    id: 'PO-2023-047',
    date: '2023-10-02',
    supplier: 'Sound Systems Inc.',
    items: 6,
    total: 2150.00,
    status: 'delivered',
    expectedDelivery: '2023-10-09'
  }
];

// Status badge component for reusability
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusStyles = {
    pending: 'border-warning/50 text-warning bg-warning/10',
    processing: 'border-info/50 text-info bg-info/10',
    shipped: 'border-primary/50 text-primary bg-primary/10',
    delivered: 'border-success/50 text-success bg-success/10',
    cancelled: 'border-danger/50 text-danger bg-danger/10'
  };
  
  const statusType = status as keyof typeof statusStyles;
  
  return (
    <Badge 
      variant="outline" 
      className={statusStyles[statusType]}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export const RecentOrdersTable: React.FC = () => {
  // Format date to YYYY-MM-DD to MM/DD/YYYY for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-[#161616]">
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead className="text-right">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Expected Delivery</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow key={order.id} className="table-row-glass">
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{formatDate(order.date)}</TableCell>
              <TableCell>{order.supplier}</TableCell>
              <TableCell className="text-right">{order.items}</TableCell>
              <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
              <TableCell>{formatDate(order.expectedDelivery)}</TableCell>
              <TableCell className="text-right">
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
