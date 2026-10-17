import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store/useStore';

export const useSocket = (boardId, user) => {
  const socketRef = useRef(null);
  const [collaborators, setCollaborators] = useState([]);
  const [remoteCursors, setRemoteCursors] = useState({});
  const { setElements } = useStore();

  useEffect(() => {
    if (!boardId) return;

    const socketUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : window.location.origin;

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.emit('join-board', { boardId, user });

    socket.on('update-elements', (newElements) => {
      setElements(newElements);
    });

    socket.on('element-updated', (element) => {
      useStore.getState().updateElement(element.id, element);
    });

    socket.on('collaborators-update', (users) => {
      setCollaborators(users);
    });

    socket.on('cursor-update', (data) => {
      setRemoteCursors((prev) => ({
        ...prev,
        [data.socketId]: data,
      }));
    });

    socket.on('user-disconnected', ({ socketId }) => {
      setRemoteCursors((prev) => {
        const copy = { ...prev };
        delete copy[socketId];
        return copy;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [boardId, user, setElements]);

  const broadcastElements = useCallback(
    (elements) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('draw-elements', { boardId, elements });
      }
    },
    [boardId]
  );

  const broadcastElementUpdate = useCallback(
    (element) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('update-element', { boardId, element });
      }
    },
    [boardId]
  );

  const broadcastCursor = useCallback(
    (cursor) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('cursor-move', { boardId, cursor });
      }
    },
    [boardId]
  );

  return {
    socket: socketRef.current,
    collaborators,
    remoteCursors,
    broadcastElements,
    broadcastElementUpdate,
    broadcastCursor,
  };
};
