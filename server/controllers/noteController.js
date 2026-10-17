import asyncHandler from 'express-async-handler';
import Note from '../models/Note.js';

// @desc    Get user notes
// @route   GET /api/notes
// @access  Private
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ userId: req.user._id })
    .populate('linkedBoardId', 'title')
    .sort({ updatedAt: -1 });
  res.json(notes);
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
export const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id).populate('linkedBoardId');

  if (note && note.userId.toString() === req.user._id.toString()) {
    res.json(note);
  } else {
    res.status(404);
    throw new Error('Note not found or unauthorized');
  }
});

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
export const createNote = asyncHandler(async (req, res) => {
  const { title, content, category, tags, color, linkedBoardId } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  const note = new Note({
    userId: req.user._id,
    title,
    content: content || '',
    category: category || 'Personal',
    tags: tags || [],
    color: color || '#ffffff',
    linkedBoardId: linkedBoardId || null,
  });

  const createdNote = await note.save();
  res.status(201).json(createdNote);
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = asyncHandler(async (req, res) => {
  const { title, content, category, tags, color, linkedBoardId } = req.body;

  const note = await Note.findById(req.params.id);

  if (note && note.userId.toString() === req.user._id.toString()) {
    note.title = title || note.title;
    note.content = content !== undefined ? content : note.content;
    note.category = category || note.category;
    note.tags = tags || note.tags;
    note.color = color || note.color;
    if (linkedBoardId !== undefined) {
      note.linkedBoardId = linkedBoardId || null;
    }

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error('Note not found or unauthorized');
  }
});

// @desc    Delete a note permanently
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.userId.toString() === req.user._id.toString()) {
    await note.deleteOne();
    res.json({ message: 'Note permanently removed' });
  } else {
    res.status(404);
    throw new Error('Note not found or unauthorized');
  }
});

// @desc    Toggle pin note
// @route   PATCH /api/notes/pin/:id
// @access  Private
export const togglePinNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.userId.toString() === req.user._id.toString()) {
    note.isPinned = !note.isPinned;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error('Note not found or unauthorized');
  }
});

// @desc    Toggle archive note
// @route   PATCH /api/notes/archive/:id
// @access  Private
export const toggleArchiveNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.userId.toString() === req.user._id.toString()) {
    note.isArchived = !note.isArchived;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error('Note not found or unauthorized');
  }
});

// @desc    Soft delete (trash) note
// @route   PATCH /api/notes/trash/:id
// @access  Private
export const trashNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.userId.toString() === req.user._id.toString()) {
    note.isDeleted = true;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error('Note not found or unauthorized');
  }
});

// @desc    Restore note from trash
// @route   PATCH /api/notes/restore/:id
// @access  Private
export const restoreNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.userId.toString() === req.user._id.toString()) {
    note.isDeleted = false;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error('Note not found or unauthorized');
  }
});
