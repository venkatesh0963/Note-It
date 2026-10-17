import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Save,
  Users,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Toolbar from '../components/Toolbar';
import Canvas from '../components/Canvas';
import LayersPanel from '../components/LayersPanel';
import useStore from '../store/useStore';
import { useSocket } from '../hooks/useSocket';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Whiteboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [boardTitle, setBoardTitle] = useState('Untitled Board');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { elements, setElements, undo, redo, selectedElement, setSelectedElement } = useStore();
  const {
    collaborators,
    remoteCursors,
    broadcastElements,
    broadcastCursor,
  } = useSocket(id, user);

  // Load board data from server
  useEffect(() => {
    let isMounted = true;
    const loadBoard = async () => {
      try {
        const { data } = await api.get(`/boards/${id}`);
        if (isMounted) {
          setBoardTitle(data.title || 'Untitled Board');
          if (data.elements && Array.isArray(data.elements)) {
            setElements(data.elements);
            useStore.getState().pushToHistory(data.elements);
          }
        }
      } catch (error) {
        console.error('Failed to load board:', error);
        toast.error('Could not load board elements');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBoard();
    return () => {
      isMounted = false;
    };
  }, [id, setElements]);

  // Save board to MongoDB
  const saveBoard = useCallback(async () => {
    setIsSaving(true);
    try {
      await api.put(`/boards/${id}`, {
        title: boardTitle,
        elements,
      });
      toast.success('Whiteboard saved to cloud!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save whiteboard');
    } finally {
      setIsSaving(false);
    }
  }, [id, boardTitle, elements]);

  // Broadcast elements whenever local elements change
  useEffect(() => {
    if (!loading && elements.length >= 0) {
      broadcastElements(elements);
    }
  }, [elements, broadcastElements, loading]);

  // Copy shareable link
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success('Collaboration invite link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S, Delete)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveBoard();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement) {
          e.preventDefault();
          const newElements = elements.filter((el) => el.id !== selectedElement.id);
          setElements(newElements);
          useStore.getState().pushToHistory(newElements);
          setSelectedElement(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveBoard, selectedElement, elements, setElements, setSelectedElement]);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 dark:bg-slate-900 overflow-hidden select-none">
      {/* Studio Top Navigation Bar */}
      <header className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 shadow-xs z-30 flex-shrink-0">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/whiteboards"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
            title="Back to Whiteboards"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="flex flex-col min-w-0">
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              onBlur={saveBoard}
              className="font-bold text-sm sm:text-base text-slate-900 dark:text-white bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500 focus:outline-none transition-colors px-1 py-0.5 truncate max-w-xs sm:max-w-md"
              title="Click to rename board"
            />
            <span className="text-[10px] text-slate-400 px-1 font-mono">
              Room: {id.slice(-6)}
            </span>
          </div>
        </div>

        {/* Right: Collaborators, Theme, Share, Save */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Collaborators count & pills */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-700/60 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
            <Users size={13} className="text-indigo-500" />
            <span>{Math.max(1, collaborators.length)} Online</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="btn-secondary text-xs py-1.5 px-3 font-semibold"
            title="Share Whiteboard link"
          >
            {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Save Button */}
          <button
            onClick={saveBoard}
            disabled={isSaving}
            className="btn-primary text-xs py-1.5 px-3.5 font-semibold"
            title="Save to Database (Ctrl+S)"
          >
            <Save size={14} />
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Toolbar */}
        <Toolbar onSave={saveBoard} />

        {/* Center Canvas */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent mb-3" />
            <p className="text-xs font-semibold text-slate-500">Preparing Whiteboard Studio...</p>
          </div>
        ) : (
          <Canvas
            onCursorMove={(cursor) => broadcastCursor(cursor)}
            remoteCursors={remoteCursors}
          />
        )}

        {/* Right Layers Panel & Properties Inspector */}
        <LayersPanel />
      </div>
    </div>
  );
};

export default Whiteboard;
