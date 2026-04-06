\# Backend сервиса заметок



Серверная часть на FastAPI.



\## Зависимости



\- FastAPI - веб-фреймворк

\- Uvicorn - сервер

\- SQLAlchemy - работа с БД

\- python-jose - JWT токены

\- passlib - хэширование паролей



\## Модели базы данных



\### Users

\- id - ID пользователя

\- email - почта

\- hashed\_password - хэш пароля

\- is\_2fa\_enabled - 2FA включена

\- otp\_secret - секрет для 2FA



\### Notes

\- id - ID заметки

\- user\_id - владелец

\- title - заголовок

\- content - содержание

\- created\_at - дата создания



\## API



| Метод | URL | Описание |

|-------|-----|----------|

| POST | /api/register | Регистрация |

| POST | /api/login | Вход |

| POST | /api/2fa/verify | Проверка 2FA |

| GET | /api/notes | Все заметки |

| POST | /api/notes | Создать |

| PUT | /api/notes/{id} | Обновить |

| DELETE | /api/notes/{id} | Удалить |

| GET | /api/notes/search | Поиск |



\## Запуск



python -m venv venv

venv\\Scripts\\activate

pip install -r requirements.txt

python run.py



Сервер: http://localhost:8000

Документация: http://localhost:8000/docs

