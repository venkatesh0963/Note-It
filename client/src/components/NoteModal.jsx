import React, { useState, useEffect, useContext } from 'react';
import NoteEditor from './NoteEditor';
import { X, Palette, Tag, Folder, Presentation, Plus } from 'lucide-react';
import { BoardsContext } from '../context/BoardsContext';
import { useNavigate } from 'react-router-dom';

const NOTE_COLORS = [
  { label: 'Default', value: '#ffffff', darkValue: '#1e293b' },
  { label: 'Yellow', value: '#fef9c3', darkValue: '#713f12' },
  { label: 'Orange', value: '#ffedd5', darkValue: '#7c2d12' },
  { label: 'Green', value: '#dcfce7', darkValue: '#14532d' },
  { label: 'Blue', value: '#dbeafe', darkValue: '#1e3a8a' },
  { label: 'Purple', value: '#f3e8ff', darkValue: '#581c87' },
  { label: 'Rose', value: '#ffe4e6', darkValue: '#881337' },
];

const CATEGORIES = ['Personal', 'Work', 'Study', 'Project', 'Ideas', 'Tasks'];

const NoteModal = ({ isOpen, onClose, onSave, note }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');
  const [color, setColor] = useState('#ffffff');
  const [tagsInput, setTagsInput] = useState('');
  const [linkedBoardId, setLinkedBoardId] = useState('');

  const { boards, createBoard } = useContext(BoardsContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setCategory(note.category || 'Personal');
      setColor(note.color || '#ffffff');
      setTagsInput(note.tags ? note.tags.join(', ') : '');
      setLinkedBoardId(note.linkedBoardId?._id || note.linkedBoardId || '');
    } else {
      setTitle('');
      setContent('');
      setCategory('Personal');
      setColor('#ffffff');
      setTagsInput('');
      setLinkedBoardId('');
    }
  }, [note, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      title: title.trim(),
      content,
      category,
      color,
      tags,
      linkedBoardId: linkedBoardId || null,
    });
  };

  const handleCreateAndLinkBoard = async () => {
    try {
      const board = await createBoard({
        title: title.trim() ? `${title} (Whiteboard)` : 'Linked Whiteboard',
      });
      setLinkedBoardId(board._id);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[92vh] border border-slate-200 dark:border-slate-700 overflow-hidden"
        style={{ borderTop: `5px solid ${color}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              {note ? 'Edit Note' : 'Create New Note'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Note Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl sm:text-2xl font-bold bg-transparent border-0 border-b border-transparent focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors px-0 py-1"
                required
                autoFocus
              />
            </div>

            {/* Note Editor */}
            <NoteEditor content={content} onChange={setContent} />

            {/* Metadata Rows: Category & Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
                  <Folder size={14} /> Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
                  <Tag size={14} /> Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. project, ideas, priority"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            {/* Color Accent Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                <Palette size={14} /> Note Card Accent
              </label>
              <div className="flex flex-wrap gap-2">
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform flex items-center justify-center ${
                      color === c.value
                        ? 'ring-2 ring-indigo-500 scale-110 border-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Linked Collaborative Whiteboard */}
            <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <label className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <Presentation size={14} /> Linked Whiteboard
                </span>
                {!linkedBoardId && (
                  <button
                    type="button"
                    onClick={handleCreateAndLinkBoard}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} /> Create New Whiteboard
                  </button>
                )}
              </label>

              <div className="flex gap-2">
                <select
                  value={linkedBoardId}
                  onChange={(e) => setLinkedBoardId(e.target.value)}
                  className="input-field text-xs bg-white dark:bg-slate-800"
                >
                  <option value="">No linked whiteboard</option>
                  {boards.map((b) => (
                    <option key={b._id} value={b._id}>
                      🎨 {b.title} ({new Date(b.updatedAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>

                {linkedBoardId && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(`/board/${linkedBoardId}`);
                    }}
                    className="btn-secondary text-xs px-3 py-1.5 whitespace-nowrap"
                  >
                    Open Canvas &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <button type="button" onClick={onClose} className="btn-secondary text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-sm">
              {note ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
