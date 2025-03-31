
import { AlertCircle, AlertTriangle, HelpCircle, Info } from 'lucide-react';

// Define note type
export type NoteType = "info" | "warning" | "error" | "help" | "success" | "pending";

// Determine the note type based on the note content
export const getNoteType = (note: string): NoteType => {
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
export const getNoteIconInfo = (noteType: NoteType) => {
  switch (noteType) {
    case "error":
      return { icon: AlertCircle, className: "h-4 w-4 text-red-500" };
    case "warning":
      return { icon: AlertTriangle, className: "h-4 w-4 text-amber-500" };
    case "help":
      return { icon: HelpCircle, className: "h-4 w-4 text-blue-500" };
    case "success":
      return { icon: Info, className: "h-4 w-4 text-green-500" };
    case "pending":
      return { icon: Info, className: "h-4 w-4 text-orange-500" };
    case "info":
    default:
      return { icon: Info, className: "h-4 w-4 text-sky-500" };
  }
};

// Get note styling based on type
export const getNoteStyles = (noteType: NoteType) => {
  switch (noteType) {
    case "error":
      return { cardBg: "bg-red-950/10", border: "red-700", text: "red-500" };
    case "warning":
      return { cardBg: "bg-amber-950/10", border: "amber-700", text: "amber-500" };
    case "help":
      return { cardBg: "bg-blue-950/10", border: "blue-700", text: "blue-500" };
    case "success":
      return { cardBg: "bg-green-950/10", border: "green-700", text: "green-500" };
    case "pending":
      return { cardBg: "bg-orange-950/10", border: "orange-700", text: "orange-500" };
    case "info":
    default:
      return { cardBg: "bg-sky-950/10", border: "sky-700", text: "sky-500" };
  }
};

// Format note text with basic formatting
export const formatNoteText = (text: string): string => {
  if (!text) return '';
  
  // Replace URLs with clickable links
  const withLinks = text.replace(
    /(https?:\/\/[^\s]+)/g, 
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>'
  );
  
  // Replace new lines with <br> tags
  const withLineBreaks = withLinks.replace(/\n/g, '<br />');
  
  // Basic formatting (bold, italic)
  const withFormatting = withLineBreaks
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/__(.*?)__/g, '<u>$1</u>');
  
  return withFormatting;
};
