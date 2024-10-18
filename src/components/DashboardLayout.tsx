import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { HiMoon, HiSun } from 'react-icons/hi';
import { HiOutlineClipboardList, HiOutlineCog, HiOutlineUser } from 'react-icons/hi'; // Import additional icons
import { SiTask } from 'react-icons/si';
import { IoLogOut } from 'react-icons/io5';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isDarkTheme, setIsDarkTheme] = useState(false); // State for theme

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("user"); // Remove user information
    router.push('/'); // Redirect to login page
  };

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev); // Toggle theme state
    document.documentElement.classList.toggle('dark'); // Apply dark class to the root element
  };

  // Function to determine if the link is active
  const isActiveLink = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className={`flex h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Sidebar */}
      <aside className={`w-64 p-4 ${isDarkTheme ? 'bg-gray-800 border-r border-gray-700' : 'bg-gray-200'}`}>
        <h2 className="text-2xl font-bold mb-8  flex flex-col justify-center items-center">
             <SiTask className='text-9xl'/>
             <span>Task Manager</span>
        </h2>
        <ul>
          <li className="mb-2">
            <Link
              href="/dashboard"
              className={`block p-2 rounded transition-colors ${isActiveLink('/dashboard') ? (isDarkTheme ? 'bg-gray-900 text-white' : 'bg-blue-500 text-white') : 'hover:underline'}`}
              aria-label="View Tasks"
            >
              <HiOutlineClipboardList className="inline-block mr-2 h-5 w-5" /> {/* Icon for Tasks */}
              Tasks
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/settings"
              className={`block p-2 rounded transition-colors ${isActiveLink('/settings') ? (isDarkTheme ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white') : 'hover:underline'}`}
              aria-label="Settings"
            >
              <HiOutlineCog className="inline-block mr-2 h-5 w-5" /> {/* Icon for Settings */}
              Settings
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/profile"
              className={`block p-2 rounded transition-colors ${isActiveLink('/profile') ? (isDarkTheme ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white') : 'hover:underline'}`}
              aria-label="Profile"
            >
              <HiOutlineUser className="inline-block mr-2 h-5 w-5" /> {/* Icon for Profile */}
              Profile
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className={`flex items-center justify-between px-4 shadow-md ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className={`w-64 p-4 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
            <h2 className="text-2xl font-bold">Dashboard</h2>
          </div>

          <div className='flex gap-2 items-center'>
            <div>
              {/* Icons for Dark and Light themes */}
              <span onClick={toggleTheme} className="cursor-pointer flex items-center">
                {!isDarkTheme ? (
                  <HiMoon className="text-gray-500 h-6 w-6" />
                ) : (
                  <HiSun className="text-yellow-600 h-6 w-6" />
                )}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white text-sm rounded-full px-4 py-2 hover:bg-red-600 transition-colors flex gap-1 justify-center items-center "
            >
              <IoLogOut /> Logout
            </button>
          </div>
        </header>

        {/* Children Components */}
        <main className="flex-1 p-4 overflow-y-auto">
          {React.Children.map(children, child => {
            return React.cloneElement(child as React.ReactElement<any>, { isDarkTheme, toggleTheme });
          })}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
