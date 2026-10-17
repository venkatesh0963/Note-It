import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const BoardsContext = createContext();

export const BoardsProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/boards');
      setBoards(data);
    } catch (error) {
      console.error('Error fetching boards:', error);
      // Don't show toast on initial load error if server is booting
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [user, fetchBoards]);

  const createBoard = async (boardData = {}) => {
    try {
      const payload = {
        title: boardData.title || 'Untitled Whiteboard',
        createdBy: user?.name || 'Anonymous',
        ...boardData,
      };
      const { data } = await api.post('/boards', payload);
      setBoards((prev) => [data, ...prev]);
      toast.success('Whiteboard created!');
      return data;
    } catch (error) {
      toast.error('Failed to create whiteboard');
      throw error;
    }
  };

  const deleteBoard = async (id) => {
    try {
      await api.delete(`/boards/${id}`);
      setBoards((prev) => prev.filter((b) => b._id !== id));
      toast.success('Whiteboard deleted');
    } catch (error) {
      toast.error('Failed to delete whiteboard');
      throw error;
    }
  };

  const duplicateBoard = async (id) => {
    try {
      const { data } = await api.post(`/boards/${id}/duplicate`);
      setBoards((prev) => [data, ...prev]);
      toast.success('Whiteboard duplicated!');
      return data;
    } catch (error) {
      toast.error('Failed to duplicate whiteboard');
      throw error;
    }
  };

  const toggleFavoriteBoard = async (id, isFavorite) => {
    try {
      const { data } = await api.put(`/boards/${id}`, { isFavorite: !isFavorite });
      setBoards((prev) => prev.map((b) => (b._id === id ? { ...b, isFavorite: !isFavorite } : b)));
      toast.success(!isFavorite ? 'Saved to favorites' : 'Removed from favorites');
      return data;
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

  return (
    <BoardsContext.Provider
      value={{
        boards,
        loading,
        fetchBoards,
        createBoard,
        deleteBoard,
        duplicateBoard,
        toggleFavoriteBoard,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};
