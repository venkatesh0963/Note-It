import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePinNote,
  toggleArchiveNote,
  trashNote,
  restoreNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all note routes
router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

router.patch('/pin/:id', togglePinNote);
router.patch('/archive/:id', toggleArchiveNote);
router.patch('/trash/:id', trashNote);
router.patch('/restore/:id', restoreNote);

export default router;
