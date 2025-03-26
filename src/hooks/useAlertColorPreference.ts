
import { useState, useEffect } from 'react';

type AlertColorScheme = {
  gradient: string;
  background: string;
  iconColor: string;
  name: string;
};

export const alertColorSchemes: Record<string, AlertColorScheme> = {
  purple: {
    gradient: 'bg-gradient-to-r from-[#8B5CF6]/20 to-transparent',
    background: 'bg-[#2C1D52]',
    iconColor: 'text-[#8B5CF6]',
    name: 'Violet'
  },
  green: {
    gradient: 'bg-gradient-to-r from-[#3ECF8E]/20 to-transparent',
    background: 'bg-[#0F3427]',
    iconColor: 'text-[#3ECF8E]',
    name: 'Vert'
  },
  blue: {
    gradient: 'bg-gradient-to-r from-[#0EA5E9]/20 to-transparent',
    background: 'bg-[#0D2B3D]',
    iconColor: 'text-[#0EA5E9]',
    name: 'Bleu'
  },
  orange: {
    gradient: 'bg-gradient-to-r from-[#F97316]/20 to-transparent',
    background: 'bg-[#3D1F0D]',
    iconColor: 'text-[#F97316]',
    name: 'Orange'
  },
  pink: {
    gradient: 'bg-gradient-to-r from-[#D946EF]/20 to-transparent',
    background: 'bg-[#381339]',
    iconColor: 'text-[#D946EF]',
    name: 'Rose'
  },
  red: {
    gradient: 'bg-gradient-to-r from-[#ea384c]/20 to-transparent',
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
