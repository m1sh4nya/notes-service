import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesAPI } from '../api';
import ReactMarkdown from 'react-markdown';

function NotesList() {
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loadNotes = async () => {
        try {
            setLoading(true);
            const response = await notesAPI.getAll();
            setNotes(response.data);
            setError('');
        } catch (err) {
            setError('Ошибка загрузки заметок');
        } finally {
            setLoading(false);
        }
    };

    const searchNotes = async () => {
        if (!searchQuery.trim()) {
            loadNotes();
            return;
        }
        try {
            setLoading(true);
            const response = await notesAPI.search(searchQuery);
            setNotes(response.data);
        } catch (err) {
            setError('Ошибка поиска');
        } finally {
            setLoading(false);
        }
    };

    const deleteNote = async (id) => {
        if (window.confirm('Удалить заметку?')) {
            try {
                await notesAPI.delete(id);
                loadNotes();
            } catch (err) {
                setError('Ошибка удаления');
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    useEffect(() => {
        loadNotes();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                searchNotes();
            } else {
                loadNotes();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div className="notes-container">
            <div className="notes-header">
                <h1>📝 Мои заметки</h1>
                <div className="header-actions">
                    <span className="user-email">
                        {localStorage.getItem('userEmail')}
                    </span>
                    <button onClick={logout} className="logout-btn">
                        Выйти
                    </button>
                </div>
            </div>

            <div className="notes-controls">
                <input
                    type="text"
                    placeholder="🔍 Поиск по заметкам..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <button onClick={() => navigate('/notes/new')} className="create-btn">
                    + Новая заметка
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Загрузка заметок...</div>
            ) : notes.length === 0 ? (
                <div className="empty-state">
                    <p>📭 У вас пока нет заметок</p>
                    <button onClick={() => navigate('/notes/new')}>
                        Создать первую заметку
                    </button>
                </div>
            ) : (
                <div className="notes-grid">
                    {notes.map((note) => (
                        <div key={note.id} className="note-card">
                            <div className="note-header">
                                <h3>{note.title}</h3>
                                <div className="note-actions">
                                    <button
                                        onClick={() => navigate(`/notes/${note.id}`)}
                                        className="edit-btn"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className="delete-btn"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div className="note-preview">
                                <ReactMarkdown>
                                    {note.content.slice(0, 150) + (note.content.length > 150 ? '...' : '')}
                                </ReactMarkdown>
                            </div>
                            <div className="note-date">
                                📅 {new Date(note.created_at).toLocaleDateString('ru-RU')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NotesList;