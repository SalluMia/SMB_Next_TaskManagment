// src/components/Header.tsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800">
      <h1 className="text-xl font-bold">Task Management App</h1>
      <button onClick={toggleDarkMode} className="text-2xl">
        {darkMode ? <HiSun /> : <HiMoon />}
      </button>
    </header>
  );
};

export default Header;
