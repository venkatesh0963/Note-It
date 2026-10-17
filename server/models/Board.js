import mongoose from 'mongoose';

const ElementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    x: { type: Number },
    y: { type: Number },
    width: { type: Number },
    height: { type: Number },
    color: { type: String, default: '#000000' },
    fillColor: { type: String, default: 'transparent' },
    strokeWidth: { type: Number, default: 2 },
    strokeStyle: { type: String, default: 'solid' },
    borderRadius: { type: Number, default: 0 },
    rows: { type: Number, default: 3 },
    cols: { type: Number, default: 3 },
    text: { type: String, default: '' },
    points: { type: Array, default: [] },
  },
  { _id: false, strict: false }
);

const BoardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled Board',
    },
    elements: [ElementSchema],
    canvasWidth: {
      type: Number,
      default: 1920,
    },
    canvasHeight: {
      type: Number,
      default: 1080,
    },
    createdBy: {
      type: String,
      default: 'Anonymous',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model('Board', BoardSchema);

export default Board;
