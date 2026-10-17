import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NotesContext } from '../context/NotesContext';
import { BoardsContext } from '../context/BoardsContext';
import { AuthContext } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';
import BoardCard from '../components/BoardCard';
import NoteModal from '../components/NoteModal';
import {
  FileText,
  Presentation,
  Star,
  Trash2,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const StatCard = ({ title, count, icon, colorClass, link }) => (
  <Link
    to={link}
    className="card hover:-translate-y-1 transition-all duration-200 flex items-center justify-between p-5 group"
  >
    <div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-2xl sm:text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">
        {count}
      </p>
    </div>
    <div
      className={`p-3.5 rounded-xl ${colorClass} transition-transform group-hover:scale-110`}
    >
      {icon}
    </div>
  </Link>
);

const Dashboard = () => {
  const { notes, fetchNotes, loading: notesLoading, createNote, updateNote } = useContext(NotesContext);
  const { boards, fetchBoards, loading: boardsLoading, createBoard } = useContext(BoardsContext);
  const { user } = useContext(AuthContext);

  const [activeNoteModal, setActiveNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
    fetchBoards();
  }, [fetchNotes, fetchBoards]);

  const activeNotes = notes.filter((n) => !n.isArchived && !n.isDeleted);
  const favoriteNotes = activeNotes.filter((n) => n.isPinned);
  const trashNotes = notes.filter((n) => n.isDeleted);

  const recentNotes = activeNotes.slice(0, 4);
  const recentBoards = boards.slice(0, 4);

  const handleSaveNote = async (data) => {
    if (editingNote) {
      await updateNote(editingNote._id, data);
    } else {
      await createNote(data);
    }
    setActiveNoteModal(false);
    setEditingNote(null);
  };

  const handleCreateBoard = async () => {
    const board = await createBoard({ title: 'Untitled Whiteboard' });
    navigate(`/board/${board._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} className="text-amber-300" />
            Note It Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Creator'}! 👋
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base mt-2 leading-relaxed">
            Create rich notes, sketch concepts on real-time collaborative whiteboards, and organize your ideas seamlessly.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => {
                setEditingNote(null);
                setActiveNoteModal(true);
              }}
              className="bg-white hover:bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus size={16} /> New Note
            </button>
            <button
              onClick={handleCreateBoard}
              className="bg-indigo-500/40 hover:bg-indigo-500/60 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg backdrop-blur-sm border border-white/20 flex items-center gap-2 transition-all"
            >
              <Presentation size={16} /> New Whiteboard
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Active Notes"
          count={activeNotes.length}
          icon={<FileText size={22} />}
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
          link="/notes"
        />
        <StatCard
          title="Whiteboards"
          count={boards.length}
          icon={<Presentation size={22} />}
          colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
          link="/whiteboards"
        />
        <StatCard
          title="Favorites"
          count={favoriteNotes.length}
          icon={<Star size={22} />}
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
          link="/favorites"
        />
        <StatCard
          title="Trash Bin"
          count={trashNotes.length}
          icon={<Trash2 size={22} />}
          colorClass="bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
          link="/trash"
        />
      </div>

      {/* Recent Notes Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Notes</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quickly continue writing your latest ideas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingNote(null);
                setActiveNoteModal(true);
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> New Note
            </button>
            <Link
              to="/notes"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {notesLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : recentNotes.length === 0 ? (
          <div className="card text-center py-10 border-dashed border-2">
            <FileText size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No notes yet! Write your first note.
            </p>
            <button
              onClick={() => {
                setEditingNote(null);
                setActiveNoteModal(true);
              }}
              className="btn-primary text-xs mt-3 py-1.5 px-3"
            >
              Create Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={(n) => {
                  setEditingNote(n);
                  setActiveNoteModal(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent Whiteboards Section */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Whiteboards
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live collaborative drawing boards with shape tools & layers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateBoard}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> New Board
            </button>
            <Link
              to="/whiteboards"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {boardsLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : recentBoards.length === 0 ? (
          <div className="card text-center py-10 border-dashed border-2">
            <Presentation size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No whiteboards created yet. Launch your first collaborative canvas!
            </p>
            <button
              onClick={handleCreateBoard}
              className="btn-primary text-xs mt-3 py-1.5 px-3"
            >
              Launch Whiteboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentBoards.map((board) => (
              <BoardCard key={board._id} board={board} />
            ))}
          </div>
        )}
      </section>

      {/* Note Modal */}
      <NoteModal
        isOpen={activeNoteModal}
        onClose={() => {
          setActiveNoteModal(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        note={editingNote}
      />
    </div>
  );
};

export default Dashboard;
