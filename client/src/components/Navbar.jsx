import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, Menu, LogOut, Plus, Presentation } from 'lucide-react';

const Navbar = ({ onOpenSidebar, onNewNote, onNewBoard }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center space-x-3">
        {/* Quick Top Create Actions */}
        <button
          onClick={onNewNote}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-900/40"
        >
          <Plus size={14} /> New Note
        </button>

        <button
          onClick={onNewBoard}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
        >
          <Presentation size={14} /> Whiteboard
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors focus:outline-none"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* User profile & Logout */}
        {user ? (
          <div className="flex items-center space-x-2 pl-1">
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {user.name}
              </p>
            </div>
            <img
              className="h-8 w-8 rounded-full bg-indigo-100 object-cover border border-indigo-200 dark:border-indigo-800"
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=4f46e5&color=fff`
              }
              alt={user.name}
            />
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
              title="Sign Out"
            >
              <LogOut size={17} />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <a href="/login" className="btn-secondary text-xs px-3 py-1.5">
              Log in
            </a>
            <a href="/register" className="btn-primary text-xs px-3 py-1.5">
              Sign up
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
