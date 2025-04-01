
import React from 'react';
import { TableCell } from "@/components/ui/table";
import NoteIconButton from '@/components/notes/NoteIconButton';

interface NoteCellProps {
  note: string | null;
  noteType: 'info' | 'warning';
  toggleNoteExpansion: (e: React.MouseEvent) => void;
}

const NoteCell: React.FC<NoteCellProps> = ({ note, noteType, toggleNoteExpansion }) => {
  return (
    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-center">
        <NoteIconButton
          hasNote={!!note}
          noteType={noteType}
          onClick={(e) => toggleNoteExpansion(e)}
        />
      </div>
    </TableCell>
  );
};

export default NoteCell;
