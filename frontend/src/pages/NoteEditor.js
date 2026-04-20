import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notesAPI } from '../api';
import ReactMarkdown from 'react-markdown';

function NoteEditor() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isMarkdown, setIsMarkdown] = useState(true);
    const [previewMode, setPreviewMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            loadNote();
        }
    }, [id]);

    const loadNote = async () => {
        try {
            setLoading(true);
            const response = await notesAPI.getOne(id);
            setTitle(response.data.title);
            setContent(response.data.content);
            setIsMarkdown(response.data.is_markdown);
        } catch (err) {
            setError('Ошибка загрузки заметки');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Введите заголовок');
            return;
        }
        if (!content.trim()) {
            setError('Введите содержание');
            return;
        }

        setSaving(true);
        setError('');

        try {
            if (isEditing) {
                await notesAPI.update(id, { title, content, is_markdown: isMarkdown });
            } else {
                await notesAPI.create({ title, content, is_markdown: isMarkdown });
            }
            navigate('/');
        } catch (err) {
            setError('Ошибка сохранения заметки');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading">Загрузка заметки...</div>;
    }

    return (
        <div className="editor-container">
            <div className="editor-header">
                <button onClick={() => navigate('/')} className="back-btn">
                    ← Назад
                </button>
                <h1>{isEditing ? 'Редактирование заметки' : 'Новая заметка'}</h1>
                <div className="editor-actions">
                    <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="preview-toggle"
                    >
                        {previewMode ? '✏️ Редактировать' : '👁️ Предпросмотр'}
                    </button>
                    <label className="markdown-toggle">
                        <input
                            type="checkbox"
                            checked={isMarkdown}
                            onChange={(e) => setIsMarkdown(e.target.checked)}
                        />
                        Markdown
                    </label>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {previewMode ? (
                <div className="preview-container">
                    <h2>{title || 'Без заголовка'}</h2>
                    <div className="markdown-preview">
                        <ReactMarkdown>{content || '*Пустая заметка*'}</ReactMarkdown>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="editor-form">
                    <input
                        type="text"
                        placeholder="Заголовок заметки..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="title-input"
                    />
                    <textarea
                        placeholder={
                            isMarkdown
                                ? '# Заголовок\n\n**Жирный текст**\n*Курсив*\n\n- Список 1\n- Список 2\n\n[Ссылка](https://example.com)'
                                : 'Введите текст заметки...'
                        }
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="content-textarea"
                        rows={15}
                    />
                    {isMarkdown && (
                        <div className="markdown-hint">
                            <span><strong>#</strong> Заголовок</span>
                            <span><strong>##</strong> Подзаголовок</span>
                            <span><strong>**текст**</strong> → <strong>текст</strong></span>
                            <span><strong>*текст*</strong> → <em>текст</em></span>
                            <span><strong>-</strong> список</span>
                            <span><strong>1.</strong> нумерованный</span>
                            <span><strong>[текст](url)</strong> ссылка</span>
                        </div>
                    )}
                    <div className="editor-buttons">
                        <button type="button" onClick={() => navigate('/')} className="cancel-btn">
                            Отмена
                        </button>
                        <button type="submit" disabled={saving} className="save-btn">
                            {saving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default NoteEditor;