import express from 'express';
import {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  duplicateBoard,
} from '../controllers/boardController.js';
import { optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.use(optionalProtect);

router.route('/')
  .get(getBoards)
  .post(createBoard);

router.route('/:id')
  .get(getBoardById)
  .put(updateBoard)
  .delete(deleteBoard);

router.post('/:id/duplicate', duplicateBoard);

export default router;
