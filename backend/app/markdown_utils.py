import markdown
from markdown.extensions import fenced_code, tables, nl2br

def render_markdown_to_html(markdown_text: str) -> str:
    """
    Преобразует Markdown текст в HTML
    
    Поддерживаемые расширения:
    - fenced_code: блоки кода с ``` 
    - tables: таблицы
    - nl2br: переводы строк в <br>
    """
    if not markdown_text:
        return ""
    
    extensions = [
        'fenced_code',   # Кодовые блоки
        'tables',        # Таблицы
        'nl2br',         # Переводы строк
        'sane_lists',    # Умные списки
    ]
    
    html = markdown.markdown(markdown_text, extensions=extensions)
    return html

def get_note_preview(markdown_text: str, length: int = 200) -> str:
    """
    Получает превью заметки (первые N символов без Markdown разметки)
    """
    import re
    # Убираем Markdown разметку
    text = re.sub(r'[#*`_~\[\]()>|!-]', '', markdown_text)
    # Убираем лишние пробелы и переносы
    text = ' '.join(text.split())
    if len(text) > length:
        text = text[:length] + '...'
    return text