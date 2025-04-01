
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Edit, Check } from 'lucide-react';
import { formatDate } from './utils';
import NoteIconButton from '@/components/notes/NoteIconButton';
import NoteEditor from '@/components/notes/NoteEditor';
import { useNoteEditor } from '@/hooks/useNoteEditor';

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
  note?: string | null;
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
  isEditing,
  onCancelEdit
}) => {
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  const { 
    note, 
    isEditing: isEditingNote, 
    isUpdating: isUpdatingNote,
    noteType,
    handleEdit: handleEditNote,
    handleCancel: handleCancelNote,
    handleSave: handleSaveNote
  } = useNoteEditor({
    itemId: item.id,
    initialNote: item.note || null,
    tableType: 'Low stock product'
  });

  return (
    <>
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
        <TableCell className="text-center">
          <NoteIconButton 
            hasNote={!!note}
            noteType={noteType}
            onClick={() => {
              if (isEditingNote) {
                handleCancelNote();
              } else {
                setIsNoteExpanded(!isNoteExpanded);
                if (!isNoteExpanded && !isEditingNote) {
                  handleEditNote();
                }
              }
            }}
          />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-1">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {isNoteExpanded && (
        <TableRow className="bg-[#161616]">
          <TableCell colSpan={8} className="py-0 px-4">
            <NoteEditor
              note={note}
              isEditing={isEditingNote}
              isUpdating={isUpdatingNote}
              noteType={noteType}
              onEdit={handleEditNote}
              onCancel={() => {
                handleCancelNote();
                if (!note) {
                  setIsNoteExpanded(false);
                }
              }}
              onSave={handleSaveNote}
              createdAt={item.added}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
