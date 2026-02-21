import { useEffect } from 'react';

export function ThemeInitializer() {
  useEffect(() => {
    // Initialize dark mode from localStorage
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return null;
}
