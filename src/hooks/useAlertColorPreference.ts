
// Ce hook est maintenant simplifié puisque nous utilisons toujours la couleur orange
import { useState } from 'react';

export function useAlertColorPreference() {
  // Retourne toujours orange
  return { 
    colorScheme: 'orange',
    changeColorScheme: () => {}, // Fonction vide
    currentScheme: {
      background: 'bg-[#3D1F0D]',
      iconColor: 'text-[#F97316]',
      name: 'Orange'
    }
  };
}
