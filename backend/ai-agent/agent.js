import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { MCPClient } from './mcp-client.js';
import { compareTours, generateComparisonText } from './features/compare-tours.js';
import { getTourDetails, generateDetailsText } from './features/tour-details.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * AI Agent для подбора туров
 * Использует OpenAI API и MCP серверы для обработки запросов
 */
export class AIAgent {
  constructor(sessionId = 'default') {
    this.sessionId = sessionId;
    this.context = {
      preferences: {},
      history: []
    };
    
    // Инициализация OpenAI клиента
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    // Инициализация MCP клиента
    this.mcpClient = new MCPClient();
    
    // Загружаем системный промпт
    this.systemPrompt = this.loadSystemPrompt();
    
    // Модель по умолчанию
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  /**
   * Загрузка системного промпта
   */
  loadSystemPrompt() {
    try {
      const promptPath = path.join(__dirname, '../../ai-agent/prompts/system-prompt.md');
      let prompt = fs.readFileSync(promptPath, 'utf-8');
      
      // Добавляем информацию о доступных инструментах
      prompt += '\n\n## Доступные инструменты через MCP:\n';
      prompt += '- search_tours(params) - поиск туров по параметрам\n';
      prompt += '- get_tour_details(tour_id) - детали тура\n';
      prompt += '- compare_tours(tour_ids) - сравнение туров\n';
      prompt += '- save_user_preferences(prefs) - сохранение предпочтений\n';
      prompt += '- get_user_history() - история запросов\n';
      
      return prompt;
    } catch (error) {
      // Fallback промпт
      return `Ты - AI ассистент для платформы бронирования туров. 
Помогай пользователям найти идеальный тур, учитывая их предпочтения, бюджет и даты.
Будь дружелюбным и профессиональным.

Доступные инструменты:
- search_tours - поиск туров
- get_tour_details - детали тура
- compare_tours - сравнение туров
- save_user_preferences - сохранение предпочтений`;
    }
  }

  /**
   * Обработка сообщения пользователя с использованием LLM
   */
  async processMessage(userMessage, data = {}) {
    const { tours = [], context = {} } = data;

    // Сохраняем в историю
    this.context.history.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    });

    try {
      // Получаем контекст пользователя через Context7 MCP
      const userContext = await this.mcpClient.callTool('context7', 'get_user_context', {
        preferences: this.context.preferences,
        history: this.context.history
      });

      // Формируем сообщения для LLM
      const messages = [
        {
          role: 'system',
          content: this.systemPrompt
        },
        ...this.buildConversationHistory(),
        {
          role: 'user',
          content: userMessage
        }
      ];

      // Вызываем LLM с функциями (tools)
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: messages,
        tools: this.getAvailableTools(),
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 1000
      });

      const assistantMessage = completion.choices[0].message;
      let responseMessage = assistantMessage.content || '';
      let recommendedTours = [];

      // Обрабатываем вызовы инструментов
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        const toolResults = await this.processToolCalls(
          assistantMessage.tool_calls,
          tours
        );

        // Формируем финальный ответ с результатами инструментов
        const finalMessages = [
          ...messages,
          assistantMessage,
          ...toolResults
        ];

        const finalCompletion = await this.openai.chat.completions.create({
          model: this.model,
          messages: finalMessages,
          temperature: 0.7,
          max_tokens: 1000
        });

        responseMessage = finalCompletion.choices[0].message.content || responseMessage;
        
        // Извлекаем туры из результатов инструментов
        recommendedTours = this.extractToursFromToolResults(toolResults);
      }

      // Сохраняем ответ в историю
      this.context.history.push({
        role: 'assistant',
        content: responseMessage,
        timestamp: new Date().toISOString()
      });

      // Сохраняем предпочтения через Context7 MCP
      if (this.context.preferences && Object.keys(this.context.preferences).length > 0) {
        await this.mcpClient.callTool('context7', 'save_user_preferences', {
          sessionId: this.sessionId,
          preferences: this.context.preferences
        });
      }

      return {
        message: responseMessage,
        tours: recommendedTours,
        recommendations: recommendedTours.map(tour => ({
          id: tour.id,
          title: tour.title,
          reason: 'Рекомендован на основе ваших предпочтений'
        }))
      };

    } catch (error) {
      console.error('AI Agent Error:', error);
      
      // Fallback на простую логику, если LLM недоступен
      return this.fallbackResponse(userMessage, tours);
    }
  }

  /**
   * Получение доступных инструментов для LLM
   */
  getAvailableTools() {
    return [
      {
        type: 'function',
        function: {
          name: 'search_tours',
          description: 'Поиск туров по критериям (страна, бюджет, категория, даты)',
          parameters: {
            type: 'object',
            properties: {
              country: { type: 'string', description: 'Название страны' },
              price_min: { type: 'number', description: 'Минимальная цена' },
              price_max: { type: 'number', description: 'Максимальная цена' },
              category: { type: 'string', description: 'Категория тура (adventure, cultural, wildlife, beach, nature)' },
              duration: { type: 'number', description: 'Длительность в днях' }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_tour_details',
          description: 'Получить детальную информацию о туре',
          parameters: {
            type: 'object',
            properties: {
              tour_id: { type: 'string', description: 'ID тура' }
            },
            required: ['tour_id']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'compare_tours',
          description: 'Сравнить несколько туров',
          parameters: {
            type: 'object',
            properties: {
              tour_ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'Массив ID туров для сравнения'
              }
            },
            required: ['tour_ids']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'save_user_preferences',
          description: 'Сохранить предпочтения пользователя',
          parameters: {
            type: 'object',
            properties: {
              country: { type: 'string' },
              budget: { type: 'number' },
              category: { type: 'string' },
              dates: { type: 'string' }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_user_history',
          description: 'Получить историю запросов пользователя и сохраненные предпочтения',
          parameters: {
            type: 'object',
            properties: {}
          }
        }
      }
    ];
  }

  /**
   * Обработка вызовов инструментов
   */
  async processToolCalls(toolCalls, availableTours = []) {
    const toolResults = [];

    for (const toolCall of toolCalls) {
      const { name, arguments: args } = toolCall.function;
      const parsedArgs = JSON.parse(args);

      try {
        let result;

        switch (name) {
          case 'search_tours':
            // Поиск туров в доступных данных
            result = this.searchToursInData(availableTours, parsedArgs);
            await this.mcpClient.callTool('database', 'search_tours', {
              tours: result,
              params: parsedArgs
            });
            break;

          case 'get_tour_details':
            // Используем sub-agent для получения деталей тура
            const tour = availableTours.find(t => String(t.id) === String(parsedArgs.tour_id));
            if (!tour) {
              result = { error: 'Тур не найден', tour: null };
            } else {
              const tourDetails = getTourDetails(tour, this.context.preferences);
              const detailsText = generateDetailsText(tourDetails);
              result = { 
                tour: tourDetails,
                detailsText,
                availability: true 
              };
            }
            await this.mcpClient.callTool('database', 'get_tour_details', result);
            break;

          case 'compare_tours':
            // Используем sub-agent для сравнения туров
            const toursToCompare = availableTours.filter(t => 
              parsedArgs.tour_ids.includes(String(t.id))
            );
            const comparison = compareTours(toursToCompare);
            const comparisonText = generateComparisonText(comparison);
            result = { 
              comparison,
              comparisonText,
              tours: toursToCompare
            };
            await this.mcpClient.callTool('database', 'compare_tours', result);
            break;

          case 'save_user_preferences':
            this.context.preferences = { ...this.context.preferences, ...parsedArgs };
            result = await this.mcpClient.callTool('context7', 'save_user_preferences', {
              sessionId: this.sessionId,
              preferences: this.context.preferences
            });
            break;

          case 'get_user_history':
            result = await this.mcpClient.callTool('context7', 'get_user_history', {
              sessionId: this.sessionId,
              history: this.context.history,
              preferences: this.context.preferences
            });
            break;

          default:
            result = { error: `Unknown tool: ${name}` };
        }

        toolResults.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          name: name,
          content: JSON.stringify(result)
        });

      } catch (error) {
        console.error(`Tool call error [${name}]:`, error);
        toolResults.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          name: name,
          content: JSON.stringify({ error: error.message })
        });
      }
    }

    return toolResults;
  }

  /**
   * Поиск туров в данных
   */
  searchToursInData(tours, criteria) {
    let filtered = [...tours];

    if (criteria.country) {
      filtered = filtered.filter(t => 
        t.country.toLowerCase().includes(criteria.country.toLowerCase())
      );
    }

    if (criteria.category) {
      filtered = filtered.filter(t => 
        t.category.toLowerCase() === criteria.category.toLowerCase()
      );
    }

    if (criteria.price_min) {
      filtered = filtered.filter(t => t.price >= criteria.price_min);
    }

    if (criteria.price_max) {
      filtered = filtered.filter(t => t.price <= criteria.price_max);
    }

    if (criteria.duration) {
      filtered = filtered.filter(t => t.duration === criteria.duration);
    }

    return filtered.slice(0, 5);
  }

  /**
   * Сравнение туров
   */
  compareToursData(tours) {
    if (tours.length < 2) {
      return { error: 'Need at least 2 tours to compare' };
    }

    return {
      tours: tours.map(t => ({
        id: t.id,
        title: t.title,
        country: t.country,
        price: t.price,
        duration: t.duration,
        category: t.category
      })),
      differences: {
        priceRange: {
          min: Math.min(...tours.map(t => t.price)),
          max: Math.max(...tours.map(t => t.price))
        },
        durationRange: {
          min: Math.min(...tours.map(t => t.duration)),
          max: Math.max(...tours.map(t => t.duration))
        }
      }
    };
  }

  /**
   * Извлечение туров из результатов инструментов
   */
  extractToursFromToolResults(toolResults) {
    const tours = [];
    
    for (const result of toolResults) {
      try {
        const content = JSON.parse(result.content);
        if (content.tours && Array.isArray(content.tours)) {
          tours.push(...content.tours);
        } else if (content.tour) {
          tours.push(content.tour);
        }
      } catch (e) {
        // Игнорируем ошибки парсинга
      }
    }
    
    return tours;
  }

  /**
   * Построение истории разговора для LLM
   */
  buildConversationHistory() {
    return this.context.history
      .slice(-10) // Последние 10 сообщений
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content || msg.message
      }));
  }

  /**
   * Fallback ответ, если LLM недоступен
   */
  fallbackResponse(userMessage, tours) {
    const analysis = this.analyzeRequest(userMessage);
    const matchingTours = this.searchToursInData(tours, analysis.preferences || {});
    
    let message = '';
    if (matchingTours.length === 0) {
      message = 'К сожалению, я не нашел туров по вашим критериям. Попробуйте изменить параметры поиска.';
    } else {
      message = `Я нашел ${matchingTours.length} подходящих туров:\n\n`;
      matchingTours.forEach((tour, index) => {
        message += `${index + 1}. **${tour.title}** - ${tour.country}\n`;
        message += `   💰 $${tour.price} | ⏱️ ${tour.duration} дней\n\n`;
      });
    }

    return {
      message,
      tours: matchingTours,
      recommendations: matchingTours.map(tour => ({
        id: tour.id,
        title: tour.title,
        reason: 'Найден по вашим критериям'
      }))
    };
  }

  /**
   * Простой анализ запроса (fallback)
   */
  analyzeRequest(message) {
    const lowerMessage = message.toLowerCase();
    const analysis = { preferences: {} };

    const countries = ['switzerland', 'japan', 'kenya', 'maldives', 'norway'];
    for (const country of countries) {
      if (lowerMessage.includes(country.toLowerCase())) {
        analysis.preferences.country = country;
        break;
      }
    }

    const budgetMatch = message.match(/(\d+)\s*(доллар|dollar|\$|usd)/i);
    if (budgetMatch) {
      analysis.preferences.price_max = parseInt(budgetMatch[1]);
    }

    return analysis;
  }

  /**
   * Получить контекст сессии
   */
  getContext() {
    return {
      sessionId: this.sessionId,
      preferences: this.context.preferences,
      historyLength: this.context.history.length
    };
  }
}
