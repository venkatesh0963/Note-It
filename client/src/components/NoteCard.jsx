import React, { useContext } from 'react';
import { format } from 'date-fns';
import {
  Star,
  Archive,
  Trash2,
  Edit3,
  RotateCcw,
  Presentation,
  Tag,
} from 'lucide-react';
import { NotesContext } from '../context/NotesContext';
import { useNavigate } from 'react-router-dom';

const NoteCard = ({ note, onEdit }) => {
  const { togglePin, toggleArchive, toggleTrash, deleteNote } = useContext(NotesContext);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // If user clicked on a button or action, don't trigger edit
    if (e.target.closest('button')) return;
    if (!note.isDeleted) {
      onEdit(note);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="card hover:shadow-lg transition-all duration-200 group relative overflow-hidden flex flex-col h-full cursor-pointer hover:-translate-y-0.5"
      style={{ borderTop: `4px solid ${note.color || '#4f46e5'}` }}
    >
      {/* Top Action Overlay */}
      <div className="absolute top-2.5 right-2.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50 z-10">
        {!note.isDeleted ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePin(note._id);
              }}
              className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                note.isPinned
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title={note.isPinned ? 'Unpin Note' : 'Pin to Favorites'}
            >
              <Star size={15} className={note.isPinned ? 'fill-current' : ''} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-indigo-600"
              title="Edit Note"
            >
              <Edit3 size={15} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleArchive(note._id);
              }}
              className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                note.isArchived ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title={note.isArchived ? 'Unarchive Note' : 'Archive Note'}
            >
              <Archive size={15} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTrash(note._id, false);
              }}
              className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-slate-400 hover:text-red-500"
              title="Move to Trash"
            >
              <Trash2 size={15} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTrash(note._id, true);
              }}
              className="p-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600"
              title="Restore Note"
            >
              <RotateCcw size={15} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Permanently delete this note? This action cannot be undone.')) {
                  deleteNote(note._id);
                }
              }}
              className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
              title="Delete Forever"
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-base sm:text-lg text-slate-800 dark:text-slate-100 truncate pr-16 mb-2">
          {note.title}
        </h3>

        {/* Content Preview */}
        <div
          className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 prose dark:prose-invert prose-xs mb-3 flex-1"
          dangerouslySetInnerHTML={{
            __html: note.content || '<span class="text-slate-400 italic">No extra content...</span>',
          }}
        />

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1"
              >
                <Tag size={10} /> {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] text-slate-400">+{note.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Linked Whiteboard Pill */}
        {note.linkedBoardId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const boardId = note.linkedBoardId._id || note.linkedBoardId;
              navigate(`/board/${boardId}`);
            }}
            className="mb-3 py-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-indigo-100 dark:border-indigo-900/50 w-fit"
            title="Open Attached Whiteboard"
          >
            <Presentation size={13} />
            <span>Open Whiteboard</span>
          </button>
        )}
      </div>

      {/* Footer: Category & Date */}
      <div className="mt-2 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
          {note.category}
        </span>
        <span className="text-[11px] text-slate-400">
          {format(new Date(note.updatedAt || Date.now()), 'MMM d, yyyy')}
        </span>
      </div>
    </div>
  );
};

export default NoteCard;
