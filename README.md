# Tour Booking Platform

A full-stack tour booking platform with a modern React frontend and AI-powered tour recommendation system. This project is organized as a monorepo to facilitate frontend and backend integration.

## Project Structure

```
tour-booking/
├── frontend/                    # Frontend React application
│   ├── frontend_Agytai_Mukhatai.md
│   ├── src/                    # React source code
│   └── package.json
├── backend/                    # Backend API with AI Agent
│   ├── server.js              # Express server
│   ├── api/
│   │   ├── ai/
│   │   │   └── chat.js        # AI chat endpoint
│   │   └── tours.js           # Tours API
│   └── ai-agent/
│       └── agent.js            # AI Agent logic
├── ai-rules/                   # AI Assistant rules
│   └── ai_template.md
├── ai-agent/                   # AI Agent architecture
│   ├── prompts/
│   │   └── system-prompt.md
│   └── AGENT_ARCHITECTURE.md
└── README.md                   # This file
```

## Quick Start

### Frontend Application

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5174

For detailed frontend documentation, see [frontend/frontend_Agytai_Mukhatai.md](frontend/frontend_Agytai_Mukhatai.md)

### Backend (AI API)

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3001`

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, OpenAI API, MCP Integration

## Features

### Frontend
- Browse and filter tours by category, location, price, and duration
- View detailed tour information with images and highlights
- Complete booking system with confirmation
- Responsive design for all devices
- Advanced search functionality

### Backend & AI Agent
- 🤖 **AI Chat Assistant** - Intelligent tour recommendation system
- 🔍 **Tour Search** - Search by country, category, budget, dates
- 📊 **Tour Comparison** - Detailed comparison of multiple tours
- 📝 **Personalized Recommendations** - Based on user preferences
- 💾 **Preference Saving** - Remember user preferences
- 💬 **Natural Language** - Natural conversation interface

## API Endpoints

### GET /api/tours
Get list of tours with optional filters:
- `country` - Filter by country
- `category` - Filter by category
- `priceMin` - Minimum price
- `priceMax` - Maximum price

### POST /api/ai/chat
Send message to AI assistant:
```json
{
  "message": "Хочу поехать в Японию, бюджет до 3000 долларов",
  "sessionId": "optional-session-id"
}
```

## AI Rules

Each team member should create a file `ai-rules/ai_<name>.md` with rules for the AI assistant.

See template: `ai-rules/ai_template.md`

## MCP Integration

AI agent supports integration with MCP servers:
- Context7 MCP - for context management
- Database MCP - for data operations

## Documentation

- **Frontend Documentation**: [frontend/frontend_Agytai_Mukhatai.md](frontend/frontend_Agytai_Mukhatai.md)
- **Backend Documentation**: [backend/README.md](backend/README.md)
- **AI Agent Architecture**: [ai-agent/AGENT_ARCHITECTURE.md](ai-agent/AGENT_ARCHITECTURE.md)

## Development

This is a monorepo structure designed to house both frontend and backend applications.

### Frontend
The frontend is a React-based SPA (Single Page Application) built with Vite for fast development and optimized production builds.

### Backend
The backend provides RESTful API and AI agent integration with OpenAI and MCP servers.

## Repository

GitHub: https://github.com/AgytaiMukhatai/tour-booking

## License

This project is open source and available under the MIT License.

## Contact

For questions or contributions, please visit the [GitHub repository](https://github.com/AgytaiMukhatai/tour-booking).
