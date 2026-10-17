import asyncHandler from 'express-async-handler';
import Board from '../models/Board.js';

// @desc    Get all boards for user (or recent boards)
// @route   GET /api/boards
// @access  Public / Optional Auth
export const getBoards = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user) {
    // Return boards created by user or boards without explicit userId
    query = {
      $or: [
        { userId: req.user._id },
        { userId: { $exists: false } },
        { userId: null },
      ],
    };
  }

  const boards = await Board.find(query)
    .select('-elements') // Exclude elements array to keep payload lightweight
    .sort({ updatedAt: -1 });

  res.json(boards);
});

// @desc    Get board by ID
// @route   GET /api/boards/:id
// @access  Public
export const getBoardById = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (board) {
    res.json(board);
  } else {
    res.status(404);
    throw new Error('Board not found');
  }
});

// @desc    Create a new board
// @route   POST /api/boards
// @access  Public / Optional Auth
export const createBoard = asyncHandler(async (req, res) => {
  const { title, createdBy, canvasWidth, canvasHeight, elements } = req.body;

  const board = new Board({
    title: title || 'Untitled Board',
    createdBy: req.user?.name || createdBy || 'Anonymous',
    userId: req.user?._id || null,
    canvasWidth: canvasWidth || 1920,
    canvasHeight: canvasHeight || 1080,
    elements: elements || [],
  });

  const createdBoard = await board.save();
  res.status(201).json(createdBoard);
});

// @desc    Update a board
// @route   PUT /api/boards/:id
// @access  Public / Optional Auth
export const updateBoard = asyncHandler(async (req, res) => {
  const { title, elements, canvasWidth, canvasHeight, isFavorite } = req.body;
  const board = await Board.findById(req.params.id);

  if (board) {
    if (title !== undefined) board.title = title;
    if (elements !== undefined) board.elements = elements;
    if (canvasWidth !== undefined) board.canvasWidth = canvasWidth;
    if (canvasHeight !== undefined) board.canvasHeight = canvasHeight;
    if (isFavorite !== undefined) board.isFavorite = isFavorite;

    const updatedBoard = await board.save();
    res.json(updatedBoard);
  } else {
    res.status(404);
    throw new Error('Board not found');
  }
});

// @desc    Delete a board
// @route   DELETE /api/boards/:id
// @access  Public / Optional Auth
export const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (board) {
    await board.deleteOne();
    res.json({ message: 'Board removed successfully' });
  } else {
    res.status(404);
    throw new Error('Board not found');
  }
});

// @desc    Duplicate a board
// @route   POST /api/boards/:id/duplicate
// @access  Public / Optional Auth
export const duplicateBoard = asyncHandler(async (req, res) => {
  const sourceBoard = await Board.findById(req.params.id);

  if (sourceBoard) {
    const newBoard = new Board({
      title: `${sourceBoard.title} (Copy)`,
      createdBy: req.user?.name || sourceBoard.createdBy,
      userId: req.user?._id || sourceBoard.userId,
      canvasWidth: sourceBoard.canvasWidth,
      canvasHeight: sourceBoard.canvasHeight,
      elements: sourceBoard.elements,
    });

    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } else {
    res.status(404);
    throw new Error('Original board not found');
  }
});
