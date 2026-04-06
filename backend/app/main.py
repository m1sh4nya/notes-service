from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Создаем приложение
app = FastAPI(title="Сервис заметок", description="API для работы с заметками", version="1.0.0")

# Настраиваем CORS (чтобы frontend мог обращаться к backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Корневой маршрут для проверки
@app.get("/")
def root():
    return {"message": "Сервис заметок работает!"}

# Проверка здоровья сервера
@app.get("/health")
def health():
    return {"status": "ok"}