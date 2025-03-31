
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { NoteContent } from '@/components/product/NoteContent';

interface ExpandedNoteRowProps {
  note: string;
  dateAdded: string;
}

const ExpandedNoteRow: React.FC<ExpandedNoteRowProps> = ({ note, dateAdded }) => {
  return (
    <TableRow 
      className="border-t border-[#272727] bg-[#161616]/30"
      onClick={(e) => e.stopPropagation()}
    >
      <TableCell colSpan={9} className="p-0">
        <div className="px-4 py-2">
          <NoteContent 
            noteText={note} 
            noteType="info" 
            createdAt={dateAdded}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ExpandedNoteRow;
