import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * AI Agent для подбора туров
 * Использует системный промпт и логику для обработки запросов
 */
export class AIAgent {
  constructor(sessionId = 'default') {
    this.sessionId = sessionId;
    this.context = {
      preferences: {},
      history: []
    };
    
    // Загружаем системный промпт
    this.systemPrompt = this.loadSystemPrompt();
  }

  /**
   * Загрузка системного промпта
   */
  loadSystemPrompt() {
    try {
      const promptPath = path.join(__dirname, '../../ai-agent/prompts/system-prompt.md');
      return fs.readFileSync(promptPath, 'utf-8');
    } catch (error) {
      // Fallback промпт
      return `Ты - AI ассистент для платформы бронирования туров. 
Помогай пользователям найти идеальный тур, учитывая их предпочтения, бюджет и даты.
Будь дружелюбным и профессиональным.`;
    }
  }

  /**
   * Обработка сообщения пользователя
   */
  async processMessage(userMessage, data = {}) {
    const { tours = [], context = {} } = data;

    // Сохраняем в историю
    this.context.history.push({
      role: 'user',
      message: userMessage,
      timestamp: new Date().toISOString()
    });

    // Анализируем запрос
    const analysis = this.analyzeRequest(userMessage);
    
    // Ищем подходящие туры
    const matchingTours = this.searchTours(tours, analysis);
    
    // Генерируем ответ
    const response = this.generateResponse(userMessage, matchingTours, analysis);

    // Сохраняем ответ в историю
    this.context.history.push({
      role: 'assistant',
      message: response.message,
      timestamp: new Date().toISOString()
    });

    // Обновляем предпочтения
    if (analysis.preferences) {
      this.context.preferences = {
        ...this.context.preferences,
        ...analysis.preferences
      };
    }

    return {
      message: response.message,
      tours: response.tours,
      recommendations: response.recommendations
    };
  }

  /**
   * Анализ запроса пользователя
   */
  analyzeRequest(message) {
    const lowerMessage = message.toLowerCase();
    
    const analysis = {
      preferences: {},
      intent: 'search',
      keywords: []
    };

    // Извлечение страны
    const countries = ['switzerland', 'japan', 'kenya', 'maldives', 'norway', 
                      'турция', 'turkey', 'египет', 'egypt', 'испания', 'spain'];
    for (const country of countries) {
      if (lowerMessage.includes(country.toLowerCase())) {
        analysis.preferences.country = country;
        analysis.keywords.push(country);
        break;
      }
    }

    // Извлечение бюджета
    const budgetMatch = message.match(/(\d+)\s*(тенге|₸|доллар|dollar|\$|usd)/i);
    if (budgetMatch) {
      analysis.preferences.budget = parseInt(budgetMatch[1]);
    }

    // Извлечение категории
    const categories = {
      'adventure': ['приключение', 'adventure', 'экстрим', 'extreme'],
      'cultural': ['культура', 'cultural', 'храм', 'temple', 'традиция'],
      'wildlife': ['сафари', 'safari', 'животные', 'wildlife'],
      'beach': ['пляж', 'beach', 'отдых', 'relax'],
      'nature': ['природа', 'nature', 'северное сияние', 'northern lights']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        analysis.preferences.category = category;
        break;
      }
    }

    // Определение намерения
    if (lowerMessage.includes('сравнить') || lowerMessage.includes('compare')) {
      analysis.intent = 'compare';
    } else if (lowerMessage.includes('рекомендация') || lowerMessage.includes('recommend')) {
      analysis.intent = 'recommend';
    }

    return analysis;
  }

  /**
   * Поиск подходящих туров
   */
  searchTours(tours, analysis) {
    let filtered = [...tours];

    // Фильтр по стране
    if (analysis.preferences.country) {
      filtered = filtered.filter(tour => 
        tour.country.toLowerCase().includes(analysis.preferences.country.toLowerCase())
      );
    }

    // Фильтр по категории
    if (analysis.preferences.category) {
      filtered = filtered.filter(tour => 
        tour.category.toLowerCase() === analysis.preferences.category.toLowerCase()
      );
    }

    // Фильтр по бюджету
    if (analysis.preferences.budget) {
      filtered = filtered.filter(tour => tour.price <= analysis.preferences.budget);
    }

    // Если ничего не найдено, возвращаем все туры
    if (filtered.length === 0) {
      filtered = tours.slice(0, 3); // Топ 3 тура
    }

    return filtered.slice(0, 5); // Максимум 5 туров
  }

  /**
   * Генерация ответа
   */
  generateResponse(userMessage, tours, analysis) {
    let message = '';
    let recommendations = [];

    if (tours.length === 0) {
      message = 'К сожалению, я не нашел туров по вашим критериям. Попробуйте изменить параметры поиска или уточните, что именно вас интересует?';
    } else if (tours.length === 1) {
      const tour = tours[0];
      message = `Отлично! Я нашел для вас идеальный тур:\n\n` +
                `🏔️ **${tour.title}**\n` +
                `📍 ${tour.country}\n` +
                `💰 Цена: $${tour.price}\n` +
                `⏱️ Длительность: ${tour.duration} дней\n` +
                `📝 ${tour.description}\n\n` +
                `Этот тур идеально подходит под ваши критерии! Хотите узнать больше деталей?`;
      recommendations.push(tour);
    } else {
      message = `Я нашел ${tours.length} подходящих туров для вас:\n\n`;
      
      tours.forEach((tour, index) => {
        message += `${index + 1}. **${tour.title}** - ${tour.country}\n`;
        message += `   💰 $${tour.price} | ⏱️ ${tour.duration} дней\n`;
        message += `   📝 ${tour.description}\n\n`;
        recommendations.push(tour);
      });

      message += `Какой тур вас больше всего интересует? Могу рассказать подробнее о любом из них!`;
    }

    return {
      message,
      tours: recommendations,
      recommendations: recommendations.map(tour => ({
        id: tour.id,
        title: tour.title,
        reason: `Подходит по критериям: ${analysis.preferences.country ? 'страна' : ''} ${analysis.preferences.category ? 'категория' : ''} ${analysis.preferences.budget ? 'бюджет' : ''}`
      }))
    };
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

