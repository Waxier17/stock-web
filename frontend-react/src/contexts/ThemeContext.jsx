import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode por padrão
  const [isLoaded, setIsLoaded] = useState(false);

  // Verificar se existe preferência salva no localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        // Se não há preferência salva, usar dark mode como padrão
        setIsDarkMode(true);
        localStorage.setItem('theme', 'dark');
      }
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      setIsDarkMode(true);
    }
    setIsLoaded(true);
  }, []);

  // Aplicar tema ao documento
  useEffect(() => {
    if (!isLoaded) return;

    try {
      const root = document.documentElement;
      if (isDarkMode) {
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
      } else {
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
      }
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Error setting theme:', error);
    }
  }, [isDarkMode, isLoaded]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? {
      // Dark mode colors
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      background: '#0F172A',
      backgroundSecondary: '#1E293B',
      surface: '#334155',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      border: '#334155',
      borderLight: '#475569',
      shadow: 'rgba(0, 0, 0, 0.25)',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
    } : {
      // Light mode colors
      primary: '#2563EB',
      secondary: '#7C3AED',
      background: '#F8FAFC',
      backgroundSecondary: '#FFFFFF',
      surface: '#F1F5F9',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#64748B',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB',
      border: '#E2E8F0',
      borderLight: '#CBD5E1',
      shadow: 'rgba(0, 0, 0, 0.1)',
      gradient: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}
