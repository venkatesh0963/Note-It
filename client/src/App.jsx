import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import { BoardsProvider } from './context/BoardsContext';

import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Whiteboards from './pages/Whiteboards';
import Whiteboard from './pages/Whiteboard';
import FilteredNotes from './pages/FilteredNotes';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BoardsProvider>
          <NotesProvider>
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: '10px',
                    background: '#1e293b',
                    color: '#fff',
                    fontSize: '13px',
                  },
                }}
              />

              <Routes>
                {/* Public Authentication Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                {/* Full-Screen Whiteboard Studio */}
                <Route path="/board/:id" element={<Whiteboard />} />

                {/* Protected Workspace Layout Routes */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/whiteboards" element={<Whiteboards />} />

                  <Route
                    path="/favorites"
                    element={
                      <FilteredNotes
                        title="Favorites"
                        emptyMessage="You haven't pinned any notes to favorites yet."
                        filterFn={(n) => !n.isDeleted && !n.isArchived && n.isPinned}
                      />
                    }
                  />

                  <Route
                    path="/archive"
                    element={
                      <FilteredNotes
                        title="Archive"
                        emptyMessage="Your archive is currently empty."
                        filterFn={(n) => !n.isDeleted && n.isArchived}
                      />
                    }
                  />

                  <Route
                    path="/trash"
                    element={
                      <FilteredNotes
                        title="Trash"
                        emptyMessage="Trash is empty. Deleted notes will appear here."
                        isTrashView={true}
                        filterFn={(n) => n.isDeleted}
                      />
                    }
                  />

                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </NotesProvider>
        </BoardsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
