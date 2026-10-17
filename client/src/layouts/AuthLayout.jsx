import React, { useContext } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PenTool, CheckCircle2 } from 'lucide-react';

const AuthLayout = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Visual Showcase Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract decorative background blurs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2.5 z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg">
            <PenTool size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Note It</span>
        </div>

        <div className="space-y-6 z-10 my-auto py-12">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase text-indigo-100">
            Next-Gen Productivity Suite
          </span>
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
            Where your thoughts turn into notes and whiteboards.
          </h1>
          <p className="text-indigo-100/80 text-base max-w-lg leading-relaxed">
            Experience the harmony of rich TipTap note-taking and real-time collaborative PaintCraft whiteboards in one unified workspace.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'WYSIWYG TipTap Rich Text Editor with tags & categories',
              'Real-Time Multi-User Collaborative Whiteboard with Socket.IO',
              'Full object manipulation, layers panel, and precision inspector',
              'Seamless Dark & Light mode with instant cloud autosave',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-indigo-100">
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="z-10 text-xs text-indigo-200/60">
          &copy; {new Date().getFullYear()} Note It. All rights reserved.
        </div>
      </div>

      {/* Auth Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile brand header */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <PenTool size={20} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Note<span className="text-indigo-600">It</span>
            </span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
