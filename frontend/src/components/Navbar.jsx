import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 border-b-0 border-brand-gold/30 dark:border-b-brand-gold/30 shadow-xl dark:shadow-2xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Area */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-brand-dark font-black text-lg shadow-[0_0_20px_rgba(251,191,36,0.4)] transition transform hover:scale-105">
              XI
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">
              ZIM<span className="text-brand-gold">XI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-600 dark:text-gray-300">
            <Link to="/dashboard" className={`transition px-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md py-1 ${isActive('/dashboard') ? 'text-gray-900 dark:text-white border-b-2 border-brand-gold' : 'hover:text-gray-900 dark:hover:text-white'}`}>Dashboard</Link>
            <Link to="/my-team" className={`transition px-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md py-1 ${isActive('/my-team') ? 'text-gray-900 dark:text-white border-b-2 border-brand-gold' : 'hover:text-gray-900 dark:hover:text-white'}`}>My Team</Link>
            <Link to="/transfers" className={`transition px-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md py-1 ${isActive('/transfers') ? 'text-gray-900 dark:text-white border-b-2 border-brand-gold' : 'hover:text-gray-900 dark:hover:text-white'}`}>Transfers</Link>
            <Link to="/leaderboard" className={`transition px-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md py-1 ${isActive('/leaderboard') ? 'text-gray-900 dark:text-white border-b-2 border-brand-gold' : 'hover:text-gray-900 dark:hover:text-white'}`}>Leagues</Link>
            <Link to="/comparison" className={`transition px-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md py-1 ${isActive('/comparison') ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-brand-gold hover:text-yellow-500 dark:hover:text-yellow-300'}`}>Compare</Link>
          </div>

          {/* User Actions & Theme Toggle */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            {/* Theme Toggle Button */}
            <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 transition-colors duration-300 flex items-center justify-center text-gray-800 dark:text-yellow-300 shadow-sm"
                title="Toggle Theme"
            >
                {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-[10px] text-brand-green uppercase font-bold tracking-widest">Manager</span>
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{user.name}</span>
                </div>
                
                {user.role === 'admin' && (
                  <Link to="/admin/points" className="bg-brand-gold text-brand-dark px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-300 shadow-[0_0_15px_rgba(251,191,36,0.3)] transition transform hover:scale-105">
                    Admin Panel
                  </Link>
                )}

                <button 
                  onClick={logout} 
                  className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-gray-800 dark:text-white px-5 py-2 rounded-lg text-xs font-bold transition transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-bold text-sm transition">
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-brand-green text-brand-dark px-5 py-2 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}