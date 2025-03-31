
import { AlertCircle, AlertTriangle, HelpCircle, Info } from 'lucide-react';

// Determine the note type based on the note content
export const getNoteType = (note: string): "info" | "warning" | "error" | "help" => {
  const lowerCaseNote = note.toLowerCase();
  
  if (lowerCaseNote.includes('error') || 
      lowerCaseNote.includes('erreur') || 
      lowerCaseNote.includes('urgent') || 
      lowerCaseNote.includes('critical')) {
    return "error";
  } else if (lowerCaseNote.includes('warning') || 
            lowerCaseNote.includes('attention') || 
            lowerCaseNote.includes('avertissement')) {
    return "warning";
  } else if (lowerCaseNote.includes('help') || 
            lowerCaseNote.includes('aide') || 
            lowerCaseNote.includes('question')) {
    return "help";
  } else {
    return "info";
  }
};

// Get the appropriate icon and class based on note type
export const getNoteIconInfo = (noteType: "info" | "warning" | "error" | "help") => {
  switch (noteType) {
    case "error":
      return { icon: AlertCircle, className: "h-4 w-4 text-red-500" };
    case "warning":
      return { icon: AlertTriangle, className: "h-4 w-4 text-amber-500" };
    case "help":
      return { icon: HelpCircle, className: "h-4 w-4 text-blue-500" };
    case "info":
    default:
      return { icon: Info, className: "h-4 w-4 text-sky-500" };
  }
};
