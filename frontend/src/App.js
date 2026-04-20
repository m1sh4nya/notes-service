import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NotesList from './pages/NotesList';
import NoteEditor from './pages/NoteEditor';
import './styles/index.css';

const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <NotesList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/notes/new"
                        element={
                            <ProtectedRoute>
                                <NoteEditor />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/notes/:id"
                        element={
                            <ProtectedRoute>
                                <NoteEditor />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;