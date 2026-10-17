import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Presentation,
  Star,
  Archive,
  Trash2,
  Plus,
  PenTool,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose, onNewNote, onNewBoard }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={19} /> },
    { name: 'All Notes', path: '/notes', icon: <FileText size={19} /> },
    { name: 'Whiteboards', path: '/whiteboards', icon: <Presentation size={19} /> },
    { name: 'Favorites', path: '/favorites', icon: <Star size={19} /> },
    { name: 'Archive', path: '/archive', icon: <Archive size={19} /> },
    { name: 'Trash', path: '/trash', icon: <Trash2 size={19} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-50 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <PenTool size={19} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Note<span className="text-indigo-600 dark:text-indigo-400">It</span>
              </h1>
              <span className="text-[10px] text-slate-400 -mt-1 block font-medium">Notes & Whiteboard</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-4 space-y-2 border-b border-slate-100 dark:border-slate-700/60">
          <button
            onClick={() => {
              if (onClose) onClose();
              if (onNewNote) onNewNote();
            }}
            className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm shadow-indigo-600/20"
          >
            <Plus size={16} /> New Note
          </button>
          <button
            onClick={() => {
              if (onClose) onClose();
              if (onNewBoard) onNewBoard();
            }}
            className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200/60 dark:border-slate-600"
          >
            <Presentation size={15} /> New Whiteboard
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-3 px-3">
          <div className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-2 tracking-wider">
            Workspace
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <span
                    className={`mr-3 flex-shrink-0 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card in Sidebar Footer */}
        {user && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-3">
            <img
              className="w-9 h-9 rounded-full bg-indigo-100 object-cover border border-indigo-200 dark:border-indigo-800"
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=4f46e5&color=fff`
              }
              alt={user.name}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
