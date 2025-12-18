# Архитектура AI агента

## Общая схема

```
User (Frontend)
    ↓
Chat Interface
    ↓
AI Agent API (Backend)
    ↓
┌─────────────────┬─────────────────┐
│   Context7 MCP   │  Database MCP   │
│  (Контекст)      │  (Данные туров) │
└─────────────────┴─────────────────┘
    ↓
LLM (GPT/Claude)
    ↓
Response → User
```

## Компоненты

### 1. Chat Interface (Frontend)
- React компонент чата
- Отправка сообщений пользователя
- Отображение ответов агента

### 2. AI Agent API (Backend)
- Endpoint: `/api/ai/chat`
- Обработка запросов
- Интеграция с MCP серверами
- Вызов LLM

### 3. Context7 MCP
- Управление контекстом диалога
- Сохранение предпочтений пользователя
- История взаимодействий

### 4. Database MCP
- Подключение к БД туров
- Поиск туров по критериям
- Получение деталей туров

### 5. LLM
- Генерация ответов
- Анализ запросов
- Принятие решений о вызове инструментов

## Поток данных

1. **Запрос пользователя** → Frontend отправляет в `/api/ai/chat`
2. **Анализ контекста** → Context7 MCP получает историю и предпочтения
3. **Извлечение параметров** → LLM определяет критерии поиска
4. **Поиск туров** → Database MCP выполняет запрос
5. **Генерация ответа** → LLM создает персонализированный ответ
6. **Сохранение контекста** → Context7 MCP обновляет память
7. **Ответ пользователю** → Frontend отображает результат

## Инструменты (Tools)

### search_tours(params)
- Вход: `{ country, price_min, price_max, dates, duration }`
- Выход: `{ tours: [], total: number }`
- Использует: Database MCP

### get_tour_details(tour_id)
- Вход: `tour_id`
- Выход: `{ tour: {...}, availability: boolean }`
- Использует: Database MCP

### save_user_preferences(preferences)
- Вход: `{ country, budget, dates, preferences }`
- Выход: `{ saved: true }`
- Использует: Context7 MCP

### get_user_history(user_id)
- Вход: `user_id`
- Выход: `{ history: [], preferences: {} }`
- Использует: Context7 MCP

### compare_tours(tour_ids)
- Вход: `[tour_id1, tour_id2, ...]`
- Выход: `{ comparison: {...} }`
- Использует: Database MCP + LLM анализ

## Конфигурация MCP

См. `config/mcp-config.json` для настройки подключений.

