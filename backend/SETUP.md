# Настройка AI Chat Bot с MCP

## Быстрый старт

### 1. Установка зависимостей

```bash
cd backend
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` в папке `backend/`:

```env
# Server Configuration
PORT=3001

# OpenAI API Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini

# MCP Server Configuration (опционально для начала)
CONTEXT7_MCP_URL=http://localhost:3002
CONTEXT7_MCP_API_KEY=your_context7_key_here

DATABASE_MCP_URL=http://localhost:3003
DATABASE_MCP_API_KEY=your_database_mcp_key_here

# Session Configuration
SESSION_SECRET=your_random_secret_here
SESSION_TIMEOUT=3600000
```

**Важно:** Получите API ключ OpenAI на https://platform.openai.com/api-keys

### 3. Запуск сервера

```bash
# Development режим (с автоперезагрузкой)
npm run dev

# Production режим
npm start
```

Сервер запустится на `http://localhost:3001`

## Использование API

### POST /api/ai/chat

Отправка сообщения AI ассистенту:

```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Хочу поехать в Японию, бюджет до 3000 долларов",
    "sessionId": "user-123"
  }'
```

**Ответ:**
```json
{
  "success": true,
  "response": "Я нашел несколько подходящих туров в Японию...",
  "tours": [...],
  "recommendations": [...],
  "sessionId": "user-123"
}
```

## Архитектура

### Компоненты:

1. **AIAgent** (`ai-agent/agent.js`)
   - Основной класс агента
   - Интеграция с OpenAI API
   - Обработка инструментов (tools)

2. **MCPClient** (`ai-agent/mcp-client.js`)
   - Клиент для подключения к MCP серверам
   - Обработка вызовов инструментов

3. **Chat Handler** (`api/ai/chat.js`)
   - HTTP endpoint для обработки запросов
   - Интеграция с AIAgent

### MCP Серверы:

- **Context7 MCP** - управление контекстом и предпочтениями
- **Database MCP** - работа с данными туров

## Доступные инструменты (Tools)

AI агент может использовать следующие инструменты:

1. **search_tours** - поиск туров по критериям
2. **get_tour_details** - детали тура
3. **compare_tours** - сравнение туров
4. **save_user_preferences** - сохранение предпочтений

## Настройка MCP серверов

MCP серверы настраиваются в `config/mcp-config.json`.

Для начала работы MCP серверы не обязательны - агент будет работать с локальными данными.

## Troubleshooting

### Ошибка "OpenAI API key not found"
- Убедитесь, что создали `.env` файл
- Проверьте, что `OPENAI_API_KEY` установлен правильно

### Ошибка "MCP server not available"
- Это нормально, если MCP серверы не запущены
- Агент будет использовать fallback логику

### Агент не находит туры
- Проверьте, что данные туров загружаются через `/api/tours`
- Убедитесь, что критерии поиска корректны

## Дальнейшая настройка

1. **Настройка реальных MCP серверов:**
   - Установите и запустите Context7 MCP
   - Установите и запустите Database MCP
   - Обновите URL в `config/mcp-config.json`

2. **Оптимизация промпта:**
   - Редактируйте `ai-agent/prompts/system-prompt.md`
   - Перезапустите сервер

3. **Добавление новых инструментов:**
   - Добавьте инструмент в `getAvailableTools()` в `agent.js`
   - Добавьте обработку в `processToolCalls()`
   - Обновите MCP клиент при необходимости

