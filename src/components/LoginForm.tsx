"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
interface LoginFormProps {
    setShowLogin: (value: boolean) => void;
    notifyError: (message: string) => void;
    notifySuccess: (message: string) => void;
  }
const LoginForm = ({ setShowLogin, notifyError, notifySuccess }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { darkMode } = useTheme(); // Access the dark mode state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      // Store the token and user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));  // Store user info as a string
      notifySuccess('Login Successfully');

      // Navigate to the dashboard
      router.push('/dashboard');
    } else {
      console.error('Login failed');
      notifyError( 'Login failed');
    }
  };


  return (
    <div className="flex items-center justify-center ">
      <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow-md space-y-4 w-96 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
      <h2 className={`text-2xl font-bold text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} `}>Login</h2>
        <div>
          <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={`mt-1 p-2 border rounded-md w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
            placeholder='your username'
          />
        </div>
        <div>
          <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`mt-1 p-2 border rounded-md w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
            placeholder='password please'
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">Login</button>
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <button onClick={() => setShowLogin(false)} className="text-blue-500 hover:underline">
            Register
          </button>
        </p>
      </form>
      <Toaster/>
    </div>
  );
};

export default LoginForm;
