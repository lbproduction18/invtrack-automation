
import React from 'react';
import { TableCell } from "@/components/ui/table";
import { Info } from 'lucide-react';

interface NoteCellProps {
  note: string | null;
  toggleNoteExpansion: (e: React.MouseEvent) => void;
}

const NoteCell: React.FC<NoteCellProps> = ({ note, toggleNoteExpansion }) => {
  return (
    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
      {note ? (
        <div className="flex justify-center">
          <button 
            onClick={toggleNoteExpansion}
            className="inline-flex items-center justify-center rounded-full p-1 transition-colors bg-sky-500/10 hover:bg-sky-500/20 text-sky-500"
            aria-label="Voir la note"
          >
            <Info className="h-4 w-4 text-sky-500" />
          </button>
        </div>
      ) : (
        <span className="text-gray-500">-</span>
      )}
    </TableCell>
  );
};

export default NoteCell;
