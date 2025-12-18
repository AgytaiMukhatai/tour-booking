# Tour Booking Platform

A full-stack tour booking platform with a modern React frontend and AI-powered tour recommendation system. This project is organized as a monorepo to facilitate frontend and backend integration.

## Features

* **Tour Listings**: Browse through a curated selection of amazing tours worldwide
* **Advanced Filters**: Filter tours by category, location, price range, duration, and search by keywords
* **Tour Details**: View comprehensive information about each tour including highlights, what's included, available dates, and more
* **Booking System**: Complete booking form with guest information, date selection, and booking confirmation
* **AI Chat Assistant**: 🤖 Intelligent AI agent that helps users find the perfect tour based on their preferences, budget, and dates
* **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
* **Modern UI**: Clean, professional design with smooth transitions and hover effects

## Project Structure

```
tour-booking/
├── frontend/                    # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # Navigation header
│   │   │   ├── Footer.jsx          # Site footer
│   │   │   ├── TourCard.jsx        # Tour card component
│   │   │   ├── FilterSection.jsx  # Filter controls
│   │   │   └── AIChat.jsx          # AI chat interface
│   │   ├── pages/
│   │   │   ├── ToursPage.jsx       # Main tours listing page
│   │   │   ├── TourDetailPage.jsx  # Individual tour details
│   │   │   └── BookingPage.jsx     # Booking form and confirmation
│   │   └── ...
│   └── package.json
├── backend/                    # Backend API with AI Agent
│   ├── server.js              # Express server
│   ├── api/
│   │   ├── ai/
│   │   │   └── chat.js        # AI chat endpoint
│   │   └── tours.js           # Tours API
│   └── ai-agent/
│       ├── agent.js            # AI Agent logic
│       ├── mcp-client.js       # MCP client
│       └── features/
│           ├── compare-tours.js    # Sub-agent for comparison
│           └── tour-details.js     # Sub-agent for details
├── ai-rules/                   # AI Assistant rules
│   ├── ai_Gaini_Kutumov.md
│   ├── backend_Gaini_Kutumov.md
│   ├── frontend_Agytai_Mukhatai.md
│   ├── qa_Team.md
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
- **AI Chat Interface** - Floating chat widget for tour recommendations

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

Each team member has created their personal AI rules file:

- **AI Engineer**: [ai-rules/ai_Gaini_Kutumov.md](ai-rules/ai_Gaini_Kutumov.md)
- **Backend Developer**: [ai-rules/backend_Gaini_Kutumov.md](ai-rules/backend_Gaini_Kutumov.md)
- **Frontend Developer**: [ai-rules/frontend_Agytai_Mukhatai.md](ai-rules/frontend_Agytai_Mukhatai.md)
- **QA Engineer**: [ai-rules/qa_Team.md](ai-rules/qa_Team.md)

See template: `ai-rules/ai_template.md`

## MCP Integration

AI agent supports integration with MCP servers using `@modelcontextprotocol/sdk`:
- **Context7 MCP** - for context management and user preferences
- **Database MCP** - for data operations and tour queries

### Sub-agents

The AI agent uses specialized sub-agents for complex tasks:
- **Tour Comparison Sub-agent** - compares multiple tours
- **Tour Details Sub-agent** - provides detailed tour information with personalization

## Documentation

- **Frontend Documentation**: [frontend/frontend_Agytai_Mukhatai.md](frontend/frontend_Agytai_Mukhatai.md)
- **Backend Documentation**: [backend/README.md](backend/README.md)
- **AI Agent Architecture**: [ai-agent/AGENT_ARCHITECTURE.md](ai-agent/AGENT_ARCHITECTURE.md)
- **Workflow & Process**: [WORKFLOW.md](WORKFLOW.md) - полное описание процесса разработки с использованием AI
- **Local Setup Guide**: [LOCAL_SETUP.md](LOCAL_SETUP.md) - инструкция по локальному запуску

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
