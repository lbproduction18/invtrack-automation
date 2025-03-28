
import React from 'react';

interface ProductNotesProps {
  note: string | null;
}

const ProductNotes: React.FC<ProductNotesProps> = ({ note }) => {
  if (!note) return null;
  
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Notes</h3>
      <div className="bg-[#1A1A1A] p-3 rounded-md text-sm">
        {note}
      </div>
    </div>
  );
};

export default ProductNotes;
