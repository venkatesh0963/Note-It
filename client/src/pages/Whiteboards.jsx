import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardsContext } from '../context/BoardsContext';
import BoardCard from '../components/BoardCard';
import { Search, Plus, Presentation } from 'lucide-react';

const Whiteboards = () => {
  const { boards, fetchBoards, createBoard, loading } = useContext(BoardsContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const filteredBoards = boards.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.createdBy && b.createdBy.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateBoard = async () => {
    const newBoard = await createBoard({ title: 'Untitled Whiteboard' });
    navigate(`/board/${newBoard._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Whiteboards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time collaborative drawing boards with shapes, layers, and Socket.IO syncing
          </p>
        </div>

        <button
          onClick={handleCreateBoard}
          className="btn-primary text-sm py-2 px-4 shadow-sm"
        >
          <Plus size={16} /> New Whiteboard
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Search whiteboards by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-9 text-xs sm:text-sm"
        />
      </div>

      {/* Boards Grid */}
      {loading ? (
        <div className="flex justify-center p-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : filteredBoards.length === 0 ? (
        <div className="card text-center py-16 border-dashed border-2">
          <Presentation size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            {searchQuery ? `No whiteboards matching "${searchQuery}"` : 'No whiteboards created yet'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Start a new collaborative canvas to sketch diagrams, freehand illustrations, and tables.
          </p>
          <button
            onClick={handleCreateBoard}
            className="btn-primary text-xs mt-4 py-2 px-4"
          >
            Create New Whiteboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredBoards.map((board) => (
            <BoardCard key={board._id} board={board} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Whiteboards;
