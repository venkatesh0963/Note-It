import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/notes');
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Could not fetch notes');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      setNotes([]);
    }
  }, [user, fetchNotes]);

  const createNote = async (noteData) => {
    try {
      const { data } = await api.post('/notes', noteData);
      setNotes((prev) => [data, ...prev]);
      toast.success('Note created!');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create note';
      toast.error(msg);
      throw error;
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const { data } = await api.put(`/notes/${id}`, noteData);
      setNotes((prev) => prev.map((n) => (n._id === id ? data : n)));
      toast.success('Note updated!');
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update note';
      toast.error(msg);
      throw error;
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success('Note permanently deleted');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const togglePin = async (id) => {
    try {
      const { data } = await api.patch(`/notes/pin/${id}`);
      setNotes((prev) => prev.map((n) => (n._id === id ? data : n)));
      toast.success(data.isPinned ? 'Note pinned to Favorites' : 'Note unpinned');
    } catch (error) {
      toast.error('Failed to pin note');
    }
  };

  const toggleArchive = async (id) => {
    try {
      const { data } = await api.patch(`/notes/archive/${id}`);
      setNotes((prev) => prev.map((n) => (n._id === id ? data : n)));
      toast.success(data.isArchived ? 'Note archived' : 'Note unarchived');
    } catch (error) {
      toast.error('Failed to update archive status');
    }
  };

  const trashNote = async (id) => {
    try {
      const { data } = await api.patch(`/notes/trash/${id}`);
      setNotes((prev) => prev.map((n) => (n._id === id ? data : n)));
      toast.success('Note moved to Trash');
    } catch (error) {
      toast.error('Failed to move note to trash');
    }
  };

  const restoreNote = async (id) => {
    try {
      const { data } = await api.patch(`/notes/restore/${id}`);
      setNotes((prev) => prev.map((n) => (n._id === id ? data : n)));
      toast.success('Note restored from Trash');
    } catch (error) {
      toast.error('Failed to restore note');
    }
  };

  const toggleTrash = async (id, isCurrentlyDeleted) => {
    if (isCurrentlyDeleted) {
      await restoreNote(id);
    } else {
      await trashNote(id);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        togglePin,
        toggleArchive,
        toggleTrash,
        trashNote,
        restoreNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
