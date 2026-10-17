import React, { useState, useContext } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotesContext } from '../context/NotesContext';
import { BoardsContext } from '../context/BoardsContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import NoteModal from '../components/NoteModal';

const AppLayout = () => {
  const { user, loading } = useContext(AuthContext);
  const { createNote } = useContext(NotesContext);
  const { createBoard } = useContext(BoardsContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent mb-4" />
        <p className="text-sm font-medium text-slate-500">Loading Note It...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCreateNote = async (noteData) => {
    try {
      await createNote(noteData);
      setIsNoteModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBoard = async () => {
    try {
      const newBoard = await createBoard({ title: 'Untitled Whiteboard' });
      navigate(`/board/${newBoard._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewNote={() => setIsNoteModalOpen(true)}
        onNewBoard={handleCreateBoard}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onNewNote={() => setIsNoteModalOpen(true)}
          onNewBoard={handleCreateBoard}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Global Note Creation Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleCreateNote}
        note={null}
      />
    </div>
  );
};

export default AppLayout;
