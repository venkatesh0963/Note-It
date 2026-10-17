export const setupSocket = (io) => {
  // Store connected users per board room
  const roomUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // User joins a specific board room
    socket.on('join-board', ({ boardId, user }) => {
      socket.join(boardId);
      socket.boardId = boardId;
      socket.userName = user?.name || 'Anonymous';
      socket.userId = user?._id || socket.id;

      if (!roomUsers.has(boardId)) {
        roomUsers.set(boardId, new Map());
      }
      roomUsers.get(boardId).set(socket.id, {
        id: socket.id,
        name: socket.userName,
        cursor: null,
      });

      // Broadcast updated collaborator list
      const collaborators = Array.from(roomUsers.get(boardId).values());
      io.to(boardId).emit('collaborators-update', collaborators);
      console.log(`[Socket] ${socket.userName} (${socket.id}) joined board ${boardId}`);
    });

    // Handle drawing events (broadcasting elements)
    socket.on('draw-elements', (data) => {
      const { boardId, elements } = data;
      socket.to(boardId).emit('update-elements', elements);
    });

    // Handle specific element updates (e.g. moving/resizing)
    socket.on('update-element', (data) => {
      const { boardId, element } = data;
      socket.to(boardId).emit('element-updated', element);
    });

    // Handle cursor tracking
    socket.on('cursor-move', (data) => {
      const { boardId, cursor } = data;
      if (roomUsers.has(boardId) && roomUsers.get(boardId).has(socket.id)) {
        roomUsers.get(boardId).get(socket.id).cursor = cursor;
      }
      socket.to(boardId).emit('cursor-update', {
        ...cursor,
        socketId: socket.id,
        userName: socket.userName,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
      if (socket.boardId && roomUsers.has(socket.boardId)) {
        roomUsers.get(socket.boardId).delete(socket.id);
        const collaborators = Array.from(roomUsers.get(socket.boardId).values());
        socket.to(socket.boardId).emit('collaborators-update', collaborators);
        socket.to(socket.boardId).emit('user-disconnected', { socketId: socket.id });
      }
    });
  });
};
