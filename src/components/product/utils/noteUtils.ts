
import { AlertTriangle, CheckCircle, Clock, InfoIcon } from 'lucide-react';
import React from 'react';

// Note type definition
export type NoteType = "warning" | "info" | "success" | "pending";

// Déterminer le type de note basé sur son contenu
export const getNoteType = (noteText: string): NoteType => {
  const lowerText = noteText.toLowerCase();
  
  if (lowerText.includes("urgent") || lowerText.includes("attention") || lowerText.includes("problème") || lowerText.includes("alerte")) {
    return "warning";
  } else if (lowerText.includes("validé") || lowerText.includes("traité") || lowerText.includes("résolu") || lowerText.includes("ok")) {
    return "success";
  } else if (lowerText.includes("attente") || lowerText.includes("en cours") || lowerText.includes("suivi")) {
    return "pending";
  } else {
    return "info";
  }
};

// Define NoteIcon type to store icon information
export type NoteIconInfo = {
  icon: typeof AlertTriangle | typeof CheckCircle | typeof Clock | typeof InfoIcon;
  className: string;
};

// Obtenir l'icône de la note en fonction de son type
export const getNoteIconInfo = (type: NoteType): NoteIconInfo => {
  switch (type) {
    case "warning":
      return { icon: AlertTriangle, className: "h-5 w-5 text-warning" };
    case "success":
      return { icon: CheckCircle, className: "h-5 w-5 text-success" };
    case "pending":
      return { icon: Clock, className: "h-5 w-5 text-info" };
    case "info":
    default:
      return { icon: InfoIcon, className: "h-5 w-5 text-info" };
  }
};

// Obtenir les styles de la note en fonction de son type
export const getNoteStyles = (type: NoteType) => {
  switch (type) {
    case "warning":
      return {
        bg: "bg-warning/5",  // Much lighter backgrounds (5% opacity)
        hover: "hover:bg-warning/10",
        border: "border-warning/30", // More transparent borders
        text: "text-warning-foreground",
        cardBg: "bg-warning/5"
      };
    case "success":
      return {
        bg: "bg-success/5",
        hover: "hover:bg-success/10",
        border: "border-success/30",
        text: "text-success-foreground",
        cardBg: "bg-success/5"
      };
    case "pending":
      return {
        bg: "bg-info/5",
        hover: "hover:bg-info/10",
        border: "border-info/30",
        text: "text-info-foreground",
        cardBg: "bg-info/5"
      };
    case "info":
    default:
      return {
        bg: "bg-primary/5",
        hover: "hover:bg-primary/10",
        border: "border-primary/30",
        text: "text-primary-foreground",
        cardBg: "bg-primary/5"
      };
  }
};

// Formater le texte de la note pour mettre en évidence certains mots clés
export const formatNoteText = (text: string) => {
  if (!text) return "";
  
  // Liste des mots-clés à mettre en gras
  const keywords = ["urgent", "attention", "validé", "traité", "résolu", "en attente", "suivi", "ok", "problème", "alerte", "dossier"];
  
  // Split le texte en fragments et mettre en gras les mots-clés
  let formattedText = text;
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    formattedText = formattedText.replace(regex, '<strong>$1</strong>');
  });
  
  return formattedText;
};
