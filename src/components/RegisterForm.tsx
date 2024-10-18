"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import toast, { Toaster } from 'react-hot-toast';
interface RegisterFormProps {
    setShowLogin: (value: boolean) => void;
    notifyError: (message: string) => void;
    notifySuccess: (message: string) => void;
  }
const RegisterForm = ({ setShowLogin , notifyError, notifySuccess} :RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setusername] = useState('');
  const router = useRouter();
  const { darkMode } = useTheme(); // Access the dark mode state
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    console.log('hit')
    e.preventDefault();
    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      // Registration was successful
      notifySuccess('User Registered successfully')
      setShowLogin(true); // Navigate to login form
    } else {
      console.error('Registration failed');
      notifyError('Registration failed')
    }
  };


  return (
    <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow-md space-y-4 w-96 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
      <h2 className={`text-2xl font-bold text-center ${darkMode ? 'bg-gray-800' : 'bg-white '} `}>Register</h2>
      <div>
        <label htmlFor="username" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>UserName</label>
        <input
          type="username"
          id="username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          required
          className={`mt-1 p-2 border rounded-md w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
          placeholder='Your user name'
        />
      </div>
      <div>
        <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`mt-1 p-2 border rounded-md w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
          placeholder='your email please'
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

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">Register</button>
      <p className="text-center mt-4">
        Already have an account?{' '}
        <button onClick={() => setShowLogin(true)} className="text-blue-500 hover:underline">
          Login
        </button>
      </p>
      <Toaster/>
    </form>
  );
};

export default RegisterForm;
