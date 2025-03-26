
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface NoteDisplayProps {
  note: string | null | undefined;
}

export const NoteDisplay: React.FC<NoteDisplayProps> = ({ note }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!note) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="focus:outline-none"
        aria-label={isExpanded ? "Hide note" : "Show note"}
      >
        <span className="text-lg" role="img" aria-label="Warning">⚠️</span>
      </button>
      
      {isExpanded && (
        <div className={cn(
          "absolute left-0 z-10 w-96 p-3 mt-2 rounded-md shadow-lg",
          "bg-[#161616] border border-[#272727] text-white text-sm"
        )}>
          <p className="whitespace-pre-wrap">{note}</p>
        </div>
      )}
    </div>
  );
};
