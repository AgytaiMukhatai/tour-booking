# Tour Booking Backend

Backend API для платформы бронирования туров с AI агентом. Поддерживает как простой REST API, так и интеллектуальный AI чат-бот для подбора туров.

## Requirements
- Node.js 18+

## Setup
```bash
npm install
```

## Run

### Development режим:
```bash
npm run dev
```

### Production режим:
```bash
npm start
```

Server runs on `http://localhost:3001` (или порт из .env)

## API Endpoints

### Health Check
- `GET /health` - Проверка работоспособности сервера

### Tours API
- `GET /api/tours` - Получить список туров
- `GET /api/tours/:id` - Получить детали тура

**Query параметры для `/api/tours`:**
- `country` - фильтр по стране
- `category` - фильтр по категории
- `priceMin` / `minPrice` - минимальная цена
- `priceMax` / `maxPrice` - максимальная цена
- `minDuration` / `maxDuration` - длительность
- `search` - поиск по тексту

**Примеры:**
```
GET /api/tours?country=Japan&priceMax=3000
GET /api/tours?category=Adventure&minPrice=2000&maxPrice=4000
```

### AI Chat API
- `POST /api/ai/chat` - Отправить сообщение AI агенту

**Request:**
```json
{
  "message": "Хочу поехать в Японию, бюджет до 3000 долларов",
  "sessionId": "optional-session-id",
  "context": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Я нашел для вас...",
  "tours": [...],
  "recommendations": [...],
  "context": {
    "user_preferences": {...},
    "session_id": "session-id"
  }
}
```

### Bookings API (если используется)
- `POST /api/bookings` - Создать бронирование
- `GET /api/bookings` - Получить список бронирований

## Структура

```
backend/
├── server.js           # Главный Express сервер
├── api/
│   ├── ai/
│   │   └── chat.js     # AI chat handler
│   └── tours.js        # Tours API
└── ai-agent/
    ├── agent.js        # AI Agent логика
    └── features/
        ├── compare-tours.js
        └── tour-details.js
```

## AI Agent Features

- 🔍 **Tour Search** - Search by country, category, budget, dates
- 📊 **Tour Comparison** - Detailed comparison of multiple tours
- 📝 **Personalized Recommendations** - Based on user preferences
- 💾 **Preference Saving** - Remember user preferences
- 💬 **Natural Language** - Natural conversation interface

## MCP Integration

AI agent supports integration with MCP servers:
- Context7 MCP - for context management
- Database MCP - for data operations

## Configuration

Create `.env` file:
```
PORT=3001
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

## Database

Если используется SQLite, файл `data.sqlite` создается автоматически в папке `backend/`.
