from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, models
from ..database import get_db
from ..markdown_utils import render_markdown_to_html
from ..auth import get_current_user

router = APIRouter(prefix="/api/notes", tags=["notes"])

# Получить все заметки пользователя
@router.get("/", response_model=List[schemas.NoteResponse])
def get_notes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    notes = db.query(models.Note).filter(
        models.Note.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    # Добавляем HTML версию для каждой заметки
    result = []
    for note in notes:
        note_dict = {
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "content_html": render_markdown_to_html(note.content) if note.is_markdown else note.content,
            "is_markdown": note.is_markdown,
            "created_at": note.created_at,
            "updated_at": note.updated_at,
            "user_id": note.user_id
        }
        result.append(schemas.NoteResponse(**note_dict))
    return result

# Получить одну заметку
@router.get("/{note_id}", response_model=schemas.NoteResponse)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Заметка не найдена")
    
    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "content_html": render_markdown_to_html(note.content) if note.is_markdown else note.content,
        "is_markdown": note.is_markdown,
        "created_at": note.created_at,
        "updated_at": note.updated_at,
        "user_id": note.user_id
    }

# Создать заметку
@router.post("/", response_model=schemas.NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note: schemas.NoteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_note = models.Note(
        title=note.title,
        content=note.content,
        is_markdown=note.is_markdown,
        user_id=current_user.id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    
    return {
        "id": db_note.id,
        "title": db_note.title,
        "content": db_note.content,
        "content_html": render_markdown_to_html(db_note.content) if db_note.is_markdown else db_note.content,
        "is_markdown": db_note.is_markdown,
        "created_at": db_note.created_at,
        "updated_at": db_note.updated_at,
        "user_id": db_note.user_id
    }

# Обновить заметку
@router.put("/{note_id}", response_model=schemas.NoteResponse)
def update_note(
    note_id: int,
    note_update: schemas.NoteUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Заметка не найдена")
    
    if note_update.title is not None:
        note.title = note_update.title
    if note_update.content is not None:
        note.content = note_update.content
    if note_update.is_markdown is not None:
        note.is_markdown = note_update.is_markdown
    
    db.commit()
    db.refresh(note)
    
    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "content_html": render_markdown_to_html(note.content) if note.is_markdown else note.content,
        "is_markdown": note.is_markdown,
        "created_at": note.created_at,
        "updated_at": note.updated_at,
        "user_id": note.user_id
    }

# Удалить заметку
@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Заметка не найдена")
    
    db.delete(note)
    db.commit()
    return None

# Поиск заметок с поддержкой Markdown
@router.get("/search/", response_model=List[schemas.NoteResponse])
def search_notes(
    q: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    notes = db.query(models.Note).filter(
        models.Note.user_id == current_user.id,
        (models.Note.title.contains(q)) | (models.Note.content.contains(q))
    ).all()
    
    result = []
    for note in notes:
        # Подсветка найденного текста
        content_preview = note.content
        if q.lower() in content_preview.lower():
            # Простая подсветка (можно улучшить)
            content_preview = content_preview.replace(q, f"**{q}**")
        
        note_dict = {
            "id": note.id,
            "title": note.title,
            "content": content_preview,
            "content_html": render_markdown_to_html(note.content) if note.is_markdown else note.content,
            "is_markdown": note.is_markdown,
            "created_at": note.created_at,
            "updated_at": note.updated_at,
            "user_id": note.user_id
        }
        result.append(schemas.NoteResponse(**note_dict))
    return result