
import { useState, useEffect } from 'react';

type AlertColorScheme = {
  gradient: string;
  iconColor: string;
  name: string;
};

export const alertColorSchemes: Record<string, AlertColorScheme> = {
  purple: {
    gradient: 'from-[#8B5CF6]/10',
    iconColor: 'text-[#8B5CF6]',
    name: 'Violet'
  },
  green: {
    gradient: 'from-[#3ECF8E]/10',
    iconColor: 'text-[#3ECF8E]',
    name: 'Vert'
  },
  blue: {
    gradient: 'from-[#0EA5E9]/10',
    iconColor: 'text-[#0EA5E9]',
    name: 'Bleu'
  },
  orange: {
    gradient: 'from-[#F97316]/10',
    iconColor: 'text-[#F97316]',
    name: 'Orange'
  },
  pink: {
    gradient: 'from-[#D946EF]/10',
    iconColor: 'text-[#D946EF]',
    name: 'Rose'
  },
  red: {
    gradient: 'from-[#ea384c]/10',
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
