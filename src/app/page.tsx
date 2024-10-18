



// src/app/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
import { HiMoon, HiSun } from 'react-icons/hi';

const HomePage = () => {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(true);
  const { darkMode, toggleDarkMode } = useTheme();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const notifyError = (message: string) => {
    toast.error(message);
  };

  const notifySuccess = (message: string) => {
    toast.success(message);
  };


  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* <h1 className="text-4xl ">Welcome to the Task Management App</h1> */}






      {showLogin ? (
        <>
        <button
      onClick={toggleDarkMode}
      className={`flex items-center justify-center w-10 h-10 mb-[-20px] z-10 rounded-full transition-colors duration-300 ${
        darkMode ? "bg-yellow-400" : "bg-gray-400"
      }`}
    >
        {darkMode ? <HiSun className="text-yellow-600 text-xl" /> : <HiMoon className="text-gray-100 text-xl" />}
    </button>
    <LoginForm setShowLogin={setShowLogin} notifyError={notifyError} notifySuccess={notifySuccess} />
        </>

      ) : (
        <>
          <button
      onClick={toggleDarkMode}
      className={`flex items-center justify-center w-10 h-10 mb-[-20px] z-10 rounded-full transition-colors duration-300 ${
        darkMode ? "bg-yellow-400" : "bg-gray-400"
      }`}
    >
        {darkMode ? <HiSun className="text-yellow-600 text-xl" /> : <HiMoon className="text-gray-100 text-xl" />}
    </button>
         <RegisterForm setShowLogin={setShowLogin} notifyError={notifyError} notifySuccess={notifySuccess} />
        </>

      )}
      <Toaster />

    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <HomePage />
  </ThemeProvider>
);

export default App;
