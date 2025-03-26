
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Edit, Check, ArrowUp, Flag } from 'lucide-react';
import { StockStatusBadge } from '@/components/product/StockStatusBadge';
import { formatDate, getNextStatus } from './utils';

interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  current: number;
  minimum: number;
  supplier: string;
  price: number;
  status: string;
  added: string;
}

interface LowStockItemProps {
  item: StockItem;
  isSelected: boolean;
  onToggle: () => void;
  manualStatus: 'high' | 'medium' | 'low' | null;
  isEditing: boolean;
  onChangeStatus: (id: string, status: 'high' | 'medium' | 'low') => void;
  onEditStatus: () => void;
  onCancelEdit: () => void;
}

export const LowStockItem: React.FC<LowStockItemProps> = ({
  item,
  isSelected,
  onToggle,
  manualStatus,
  isEditing,
  onChangeStatus,
  onEditStatus,
  onCancelEdit
}) => {
  // Fonction pour changer le statut lors du clic sur le badge
  const toggleStatus = () => {
    console.log("Badge clicked! Current status:", manualStatus);
    const nextStatus = getNextStatus(manualStatus);
    console.log("Next status will be:", nextStatus);
    onChangeStatus(item.id, nextStatus);
  };

  return (
    <TableRow key={item.id} className="table-row-glass">
      <TableCell>
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={onToggle}
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
        {isEditing ? (
          <StatusSelector 
            itemId={item.id} 
            onChangeStatus={onChangeStatus} 
          />
        ) : (
          <StockStatusBadge 
            stock={item.current} 
            threshold={item.minimum} 
            manualStatus={manualStatus}
            onClick={toggleStatus}
            isClickable={true}
          />
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-1">
          {isEditing ? (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={onCancelEdit}
            >
              <Check className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={onEditStatus}
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
  );
};

interface StatusSelectorProps {
  itemId: string;
  onChangeStatus: (id: string, status: 'high' | 'medium' | 'low') => void;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ itemId, onChangeStatus }) => {
  return (
    <div className="flex justify-end space-x-1">
      <Button 
        size="sm" 
        variant="ghost" 
        className="h-7 w-7 p-0" 
        onClick={() => onChangeStatus(itemId, 'low')}
      >
        <Badge variant="outline" className="bg-green-900/30 text-green-400 border border-green-900/20 px-2 py-0.5">
          Basse
        </Badge>
      </Button>
      <Button 
        size="sm" 
        variant="ghost" 
        className="h-7 w-7 p-0" 
        onClick={() => onChangeStatus(itemId, 'medium')}
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
        onClick={() => onChangeStatus(itemId, 'high')}
      >
        <Badge variant="outline" className="bg-red-900/30 text-red-400 border border-red-900/20 px-2 py-0.5">
          <Flag className="h-3 w-3 mr-1" />
          Haute
        </Badge>
      </Button>
    </div>
  );
};
