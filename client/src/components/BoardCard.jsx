import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Palette,
  Trash2,
  Copy,
  Share2,
  ExternalLink,
  Star,
} from 'lucide-react';
import { BoardsContext } from '../context/BoardsContext';
import toast from 'react-hot-toast';

const BoardCard = ({ board }) => {
  const navigate = useNavigate();
  const { deleteBoard, duplicateBoard, toggleFavoriteBoard } = useContext(BoardsContext);

  const handleCopyLink = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/board/${board._id}`;
    navigator.clipboard.writeText(url);
    toast.success('Whiteboard collaboration link copied!');
  };

  const handleDuplicate = async (e) => {
    e.stopPropagation();
    await duplicateBoard(board._id);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${board.title}"?`)) {
      await deleteBoard(board._id);
    }
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    await toggleFavoriteBoard(board._id, board.isFavorite);
  };

  return (
    <div
      onClick={() => navigate(`/board/${board._id}`)}
      className="card hover:shadow-lg transition-all duration-200 group relative overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1 border border-slate-200/80 dark:border-slate-700/80"
    >
      {/* Top Floating Actions */}
      <div className="absolute top-2.5 right-2.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50 z-10">
        <button
          onClick={handleFavorite}
          className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
            board.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Favorite"
        >
          <Star size={14} className={board.isFavorite ? 'fill-current' : ''} />
        </button>

        <button
          onClick={handleCopyLink}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-indigo-600"
          title="Copy Collaboration Link"
        >
          <Share2 size={14} />
        </button>

        <button
          onClick={handleDuplicate}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-indigo-600"
          title="Duplicate Whiteboard"
        >
          <Copy size={14} />
        </button>

        <button
          onClick={handleDelete}
          className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-slate-400 hover:text-red-500"
          title="Delete Whiteboard"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Visual Canvas Banner */}
      <div className="aspect-[16/9] w-full bg-gradient-to-br from-indigo-50/70 via-slate-50 to-indigo-100/50 dark:from-slate-800 dark:via-slate-800 dark:to-indigo-950/40 rounded-lg mb-3 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-indigo-400/40 transition-colors border border-slate-100 dark:border-slate-700/40">
        <Palette
          size={36}
          className="text-indigo-400/80 dark:text-indigo-400/60 group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 dark:bg-slate-800/95 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <ExternalLink size={12} /> Launch Studio
          </span>
        </div>
      </div>

      {/* Board Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {board.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            By {board.createdBy || 'Anonymous'}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>{board.elements ? `${board.elements.length} elements` : 'Live canvas'}</span>
          <span>{new Date(board.updatedAt || Date.now()).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
