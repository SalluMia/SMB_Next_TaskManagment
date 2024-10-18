// src/app/layout.tsx
"use client"; // Add this line if you are using client components

import React from 'react';
import { ThemeProvider } from '../context/ThemeContext'; // Adjust the path as necessary
import Header from '../components/Header'; // Ensure Header is imported correctly
import './globals.css'
const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {/* <Header /> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
