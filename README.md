# Note It - Collaborative Notes & Whiteboard Studio

**Note It** is an all-in-one productivity platform combining **PaintCraft** (real-time collaborative canvas with shape tools, layer management, and Socket.IO syncing) and **Notes4U** (modern full-stack rich-text notes with TipTap, authentication, categories, and tags).

---

## 🌟 Key Features

### 🎨 1. Real-Time Collaborative Whiteboard (PaintCraft Engine)
- **Live Multi-User Collaboration**: Multiple users can join the same board room and sketch simultaneously with real-time cursor tracking via Socket.IO.
- **Rich Drawing Tools**:
  - **Pencil**: Freehand drawing with customizable stroke width & color.
  - **Eraser**: Precision canvas eraser with stroke thickness control.
  - **Shapes**: Rectangles (with rounded corner radius control) and Circles / Ellipses.
  - **Lines**: Straight lines with customizable stroke styles.
  - **Tables**: Dynamic table generator with custom row & column dividers.
  - **Text Input**: Add text annotations anywhere on the canvas.
- **Advanced Object Manipulation & Selection**:
  - Click on any shape or stroke to select, move, and reposition.
  - Interactive corner drag handles for instant shape resizing.
- **Layers Panel**:
  - Visual layer list showing all drawn elements in rendering order.
  - Reorder layers (`Bring Forward` / `Send Backward`).
  - Delete individual layers.
- **Properties Inspector**:
  - Numerical inputs for exact X, Y, Width, Height, Border Radius, Rows, and Columns for absolute geometric precision.
  - Instant live updates for stroke color, fill color, and styles (solid, dashed, dotted, dash-dot).
- **Undo / Redo History**: Full undo/redo stack (`Ctrl+Z` / `Ctrl+Y`).
- **Export & Persistence**: Download canvas as PNG image and save board states directly to MongoDB.

---

### 📝 2. Modern Rich Text Notes (Notes4U Engine)
- **WYSIWYG TipTap Editor**: Headings (H1/H2), bold, italic, strikethrough, inline code, code blocks, blockquotes, bulleted lists, and numbered lists.
- **Organization**:
  - **Color Coding**: 7 distinct card accent colors.
  - **Categories**: Personal, Work, Study, Project, Ideas, Tasks.
  - **Tags**: Multiple comma-separated tags per note.
- **Lifecycle Management**:
  - **Pin to Favorites**: Keep priority notes at top.
  - **Archive**: Declutter your workspace while keeping historical records.
  - **Trash Bin**: Soft delete with restore and permanent delete capabilities.
- **Real-Time Search & Filters**: Search instantly across titles, rich text content, and tags. Filter by category with one-click pills.
- **Note-to-Whiteboard Linkage**: Attach or launch a collaborative whiteboard directly from any note.

---

### 🔐 3. Security, Aesthetics & Tech Stack
- **Authentication**: Secure JWT token authentication with bcrypt password encryption.
- **Themes**: Seamless Dark / Light mode toggle across the entire dashboard and whiteboard studio.
- **Backend**: Node.js, Express 4, MongoDB (Mongoose), Socket.IO 4, Helmet, Morgan.
- **Frontend**: React 18, Vite 6, Tailwind CSS 3, Zustand, Axios, React Hot Toast, Lucide Icons.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ or v20+)
- [MongoDB](https://www.mongodb.com/) running locally on port 27017 (or MongoDB Atlas URI)

### Installation

1. Install root dependencies and concurrently:
   ```bash
   npm install
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Configuration

Create a `.env` file in the `server` directory (or use default values):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/noteit
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

### Running the Application

From the root `Noteit` folder, run both backend and frontend concurrently:
```bash
npm run dev
```

Or run them individually in separate terminal tabs:
- **Server**: `npm run server` (runs on http://localhost:5000)
- **Client**: `npm run client` (runs on http://localhost:5173)

Open your browser at **http://localhost:5173** to start creating notes and whiteboards!
