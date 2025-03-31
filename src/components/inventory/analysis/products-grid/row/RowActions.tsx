
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';

interface RowActionsProps {
  onView: () => void;
  onRemove: () => void;
}

const RowActions: React.FC<RowActionsProps> = ({ onView, onRemove }) => {
  return (
    <div className="flex items-center justify-center space-x-1">
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-blue-500/10 hover:text-blue-500"
        onClick={(e) => {
          e.stopPropagation();
          onView();
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-red-500/10 hover:text-red-500"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default RowActions;
