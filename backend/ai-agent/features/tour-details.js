/**
 * Функция получения детальной информации о туре
 * Используется AI агентом для подробного описания
 */

export function getTourDetails(tour, preferences = {}) {
  if (!tour) {
    return {
      error: 'Тур не найден'
    };
  }

  const details = {
    id: tour.id,
    title: tour.title,
    description: tour.description,
    fullDescription: tour.fullDescription || tour.description,
    country: tour.country,
    price: tour.price,
    duration: tour.duration,
    category: tour.category,
    highlights: tour.highlights || [],
    included: tour.included || [],
    dates: tour.dates || [],
    maxGroupSize: tour.maxGroupSize,
    rating: tour.rating,
    reviews: tour.reviews,
    difficulty: tour.difficulty,
    // Персонализированная информация
    personalized: generatePersonalizedInfo(tour, preferences)
  };

  return details;
}

/**
 * Генерация персонализированного описания
 */
function generatePersonalizedInfo(tour, preferences) {
  const info = {
    whySuitable: [],
    considerations: [],
    tips: []
  };

  // Проверка бюджета
  if (preferences.budget && tour.price <= preferences.budget) {
    info.whySuitable.push(`Отлично вписывается в ваш бюджет ($${tour.price} из $${preferences.budget})`);
  } else if (preferences.budget && tour.price > preferences.budget) {
    info.considerations.push(`Цена выше вашего бюджета на $${tour.price - preferences.budget}`);
  }

  // Проверка категории
  if (preferences.category && tour.category.toLowerCase() === preferences.category.toLowerCase()) {
    info.whySuitable.push(`Соответствует вашим предпочтениям (${tour.category})`);
  }

  // Проверка страны
  if (preferences.country && tour.country.toLowerCase().includes(preferences.country.toLowerCase())) {
    info.whySuitable.push(`Тур в желаемой стране: ${tour.country}`);
  }

  // Советы
  if (tour.duration >= 10) {
    info.tips.push('Длительный тур - возьмите с собой все необходимое');
  }

  if (tour.difficulty === 'Hard') {
    info.tips.push('Требуется хорошая физическая подготовка');
  }

  if (tour.maxGroupSize && tour.maxGroupSize <= 8) {
    info.tips.push('Небольшая группа - более персонализированный опыт');
  }

  return info;
}

/**
 * Генерация текстового описания деталей
 */
export function generateDetailsText(details) {
  let text = `🏔️ **${details.title}**\n\n`;
  text += `📍 ${details.country}\n`;
  text += `💰 Цена: $${details.price}\n`;
  text += `⏱️ Длительность: ${details.duration} дней\n`;
  text += `🏷️ Категория: ${details.category}\n\n`;

  text += `📝 **Описание:**\n${details.fullDescription}\n\n`;

  if (details.highlights && details.highlights.length > 0) {
    text += `✨ **Основные моменты:**\n`;
    details.highlights.forEach(highlight => {
      text += `• ${highlight}\n`;
    });
    text += '\n';
  }

  if (details.included && details.included.length > 0) {
    text += `✅ **Включено:**\n`;
    details.included.forEach(item => {
      text += `• ${item}\n`;
    });
    text += '\n';
  }

  if (details.dates && details.dates.length > 0) {
    text += `📅 **Доступные даты:**\n`;
    details.dates.slice(0, 5).forEach(date => {
      text += `• ${date}\n`;
    });
    if (details.dates.length > 5) {
      text += `... и еще ${details.dates.length - 5} дат\n`;
    }
    text += '\n';
  }

  if (details.rating) {
    text += `⭐ Рейтинг: ${details.rating}/5 (${details.reviews || 0} отзывов)\n\n`;
  }

  // Персонализированная информация
  if (details.personalized.whySuitable.length > 0) {
    text += `💡 **Почему подходит вам:**\n`;
    details.personalized.whySuitable.forEach(reason => {
      text += `• ${reason}\n`;
    });
    text += '\n';
  }

  if (details.personalized.tips.length > 0) {
    text += `💡 **Советы:**\n`;
    details.personalized.tips.forEach(tip => {
      text += `• ${tip}\n`;
    });
  }

  return text;
}

