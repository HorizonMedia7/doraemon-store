import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('doraemon_user_theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      // Browser / OS default preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      if (metaTheme) metaTheme.setAttribute('content', '#090a0f');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      if (metaTheme) metaTheme.setAttribute('content', '#ffffff');
    }
  }, [theme]);

  // Listen for browser / OS system color scheme changes if user hasn't explicitly set a preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      const saved = localStorage.getItem('doraemon_user_theme');
      // If user hasn't manually chosen a specific theme, follow system
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('doraemon_user_theme', next);
      return next;
    });
  };

  return { theme, toggleTheme, isDark: theme === 'dark' };
}
