import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { BoltIcon, SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import logoImage from '../assets/logo.png';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  
  // Theme Logic
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <nav className="sticky top-0 z-[100] bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-b border-indigo-50/50 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img 
              src={logoImage} 
              alt="GEO-Optimizer Logo" 
              className="h-10 w-auto object-contain" 
            />
            <div className="flex flex-col text-slate-900 dark:text-white">
              <span className="text-xl font-black tracking-tight leading-none">
                GEO-Optimizer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">

            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-100 dark:border-slate-700"
              aria-label="Toggle Theme"
            >
              {dark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {user && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-500/20 rounded-full">
                <BoltIcon className="h-4 w-4 text-indigo-500" />
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Credits: 100/100</span>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end hidden sm:flex">
                      <span className="text-xs font-bold text-[#1A1A3A] dark:text-slate-200">{user.email.split('@')[0]}</span>
                      <button 
                        onClick={() => signOut(auth)}
                        className="text-[10px] font-bold text-red-400 hover:text-red-500 uppercase tracking-tighter transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>

                    <div 
                      onClick={() => navigate('/profile')}
                      className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 dark:from-slate-700 dark:to-slate-800 border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                    >
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" />
                      ) : (
                        user.email[0].toUpperCase()
                      )}
                    </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/signin')}
                className="px-6 py-2.5 bg-[#1A1A3A] dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white rounded-xl transition-all font-bold text-sm shadow-xl dark:shadow-none active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;