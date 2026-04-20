from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from . import models
from .routers import notes, auth

# Создаем таблицы в базе данных
Base.metadata.create_all(bind=engine)

# Создаем приложение
app = FastAPI(title="Сервис заметок", description="API для работы с заметками в Markdown", version="1.0.0")

# Настраиваем CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(auth.router)
app.include_router(notes.router)

# Корневой маршрут
@app.get("/")
def root():
    return {"message": "Сервис заметок работает! Поддержка Markdown включена"}

# Проверка здоровья
@app.get("/health")
def health():
    return {"status": "ok"}