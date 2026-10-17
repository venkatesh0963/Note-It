import React, { useContext, useEffect, useState } from 'react';
import { NotesContext } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import { Search, Plus, Filter, FileText } from 'lucide-react';

const Notes = () => {
  const { notes, fetchNotes, createNote, updateNote, loading } = useContext(NotesContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const activeNotes = notes.filter((n) => !n.isArchived && !n.isDeleted);

  const categories = ['All', ...new Set(activeNotes.map((n) => n.category).filter(Boolean))];

  const filteredNotes = activeNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (note.tags && note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      categoryFilter === 'All' ? true : note.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleSaveNote = async (data) => {
    if (currentNote) {
      await updateNote(currentNote._id, data);
    } else {
      await createNote(data);
    }
    setIsModalOpen(false);
    setCurrentNote(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            All Notes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage, organize, and search all your notes
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentNote(null);
            setIsModalOpen(true);
          }}
          className="btn-primary text-sm py-2 px-4 shadow-sm"
        >
          <Plus size={16} /> New Note
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search notes by title, content or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border-0"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="flex justify-center p-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="card text-center py-16 border-dashed border-2">
          <FileText size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            {searchQuery ? `No notes matching "${searchQuery}"` : 'No notes found'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or create a fresh note to capture your thoughts.
          </p>
          <button
            onClick={() => {
              setCurrentNote(null);
              setIsModalOpen(true);
            }}
            className="btn-primary text-xs mt-4 py-2 px-4"
          >
            Create Note Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={(n) => {
                setCurrentNote(n);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentNote(null);
        }}
        onSave={handleSaveNote}
        note={currentNote}
      />
    </div>
  );
};

export default Notes;
