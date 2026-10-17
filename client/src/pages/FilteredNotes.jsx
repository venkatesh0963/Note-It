import React, { useContext, useEffect, useState } from 'react';
import { NotesContext } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import { Star, Archive, Trash2, Search, RotateCcw } from 'lucide-react';

const FilteredNotes = ({ title, emptyMessage, filterFn, isTrashView = false }) => {
  const { notes, fetchNotes, updateNote, deleteNote, loading } = useContext(NotesContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const targetNotes = notes.filter(filterFn);

  const filteredNotes = targetNotes.filter((note) => {
    return (
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (note.tags && note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  });

  const handleSaveNote = async (data) => {
    if (editingNote) {
      await updateNote(editingNote._id, data);
    }
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const handleEmptyTrash = async () => {
    if (
      window.confirm('Are you sure you want to permanently delete all notes in Trash? This cannot be undone.')
    ) {
      for (const n of targetNotes) {
        await deleteNote(n._id);
      }
    }
  };

  const getHeaderIcon = () => {
    switch (title.toLowerCase()) {
      case 'favorites':
        return <Star size={24} className="text-amber-500 fill-amber-500" />;
      case 'archive':
        return <Archive size={24} className="text-indigo-500" />;
      case 'trash':
        return <Trash2 size={24} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {getHeaderIcon()}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {targetNotes.length} {targetNotes.length === 1 ? 'note' : 'notes'} found
            </p>
          </div>
        </div>

        {isTrashView && targetNotes.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="btn-secondary text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 py-2 px-3.5"
          >
            <Trash2 size={14} /> Empty Trash
          </button>
        )}
      </div>

      {/* Search Input */}
      {targetNotes.length > 0 && (
        <div className="relative max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 text-xs sm:text-sm"
          />
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center p-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="card text-center py-16 border-dashed border-2">
          <div className="opacity-40 flex justify-center mb-2">{getHeaderIcon()}</div>
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            {searchQuery ? `No notes matching "${searchQuery}"` : emptyMessage}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={(n) => {
                setEditingNote(n);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Edit Modal (if not deleted) */}
      {!isTrashView && (
        <NoteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingNote(null);
          }}
          onSave={handleSaveNote}
          note={editingNote}
        />
      )}
    </div>
  );
};

export default FilteredNotes;
