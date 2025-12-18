import { AIAgent } from '../../ai-agent/agent.js';
import { getToursData } from '../tours.js';

/**
 * AI Chat Handler
 * POST /api/ai/chat
 * Body: { message: string, sessionId?: string, context?: object }
 */
export async function aiChatHandler(req, res) {
  try {
    const { message, sessionId, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    // Получаем данные о турах
    const toursData = await getToursData();

    // Создаем или получаем агента для сессии
    const agent = new AIAgent(sessionId || 'default');

    // Обрабатываем сообщение через AI агента
    const response = await agent.processMessage(message, {
      tours: toursData,
      context: context || {}
    });

    // Получаем контекст агента
    const agentContext = agent.getContext();

    res.json({
      success: true,
      message: response.message,
      tours: response.tours || [],
      recommendations: response.recommendations || [],
      context: {
        user_preferences: agentContext.preferences,
        session_id: agent.sessionId
      }
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      error: 'Failed to process AI chat request',
      message: error.message
    });
  }
}

