import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Personal',
    },
    tags: [
      {
        type: String,
      },
    ],
    color: {
      type: String,
      default: '#ffffff',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    linkedBoardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;
