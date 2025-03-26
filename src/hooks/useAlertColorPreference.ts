
import { useState, useEffect } from 'react';

type AlertColorScheme = {
  background: string;
  iconColor: string;
  name: string;
};

export const alertColorSchemes: Record<string, AlertColorScheme> = {
  purple: {
    background: 'bg-[#2C1D52]',
    iconColor: 'text-[#8B5CF6]',
    name: 'Violet'
  },
  green: {
    background: 'bg-[#0F3427]',
    iconColor: 'text-[#3ECF8E]',
    name: 'Vert'
  },
  blue: {
    background: 'bg-[#0D2B3D]',
    iconColor: 'text-[#0EA5E9]',
    name: 'Bleu'
  },
  orange: {
    background: 'bg-[#3D1F0D]',
    iconColor: 'text-[#F97316]',
    name: 'Orange'
  },
  pink: {
    background: 'bg-[#381339]',
    iconColor: 'text-[#D946EF]',
    name: 'Rose'
  },
  red: {
    background: 'bg-[#3D0D14]',
    iconColor: 'text-[#ea384c]',
    name: 'Rouge'
  }
};

export function useAlertColorPreference() {
  const [colorScheme, setColorScheme] = useState<string>('purple');
  
  // Load saved preference from localStorage
  useEffect(() => {
    const savedColor = localStorage.getItem('alertColorPreference');
    if (savedColor && alertColorSchemes[savedColor]) {
      setColorScheme(savedColor);
    }
  }, []);
  
  // Save preference to localStorage
  const changeColorScheme = (color: string) => {
    if (alertColorSchemes[color]) {
      setColorScheme(color);
      localStorage.setItem('alertColorPreference', color);
    }
  };
  
  return { 
    colorScheme, 
    changeColorScheme,
    currentScheme: alertColorSchemes[colorScheme] || alertColorSchemes.purple
  };
}
