/**
 * Функция сравнения туров
 * Используется AI агентом для детального сравнения
 */

export function compareTours(tours) {
  if (!tours || tours.length < 2) {
    return {
      error: 'Нужно минимум 2 тура для сравнения'
    };
  }

  const comparison = {
    tours: tours.map(tour => ({
      id: tour.id,
      title: tour.title,
      country: tour.country,
      price: tour.price,
      duration: tour.duration,
      category: tour.category,
      rating: tour.rating || 0
    })),
    differences: {
      price: {
        min: Math.min(...tours.map(t => t.price)),
        max: Math.max(...tours.map(t => t.price)),
        difference: Math.max(...tours.map(t => t.price)) - Math.min(...tours.map(t => t.price))
      },
      duration: {
        min: Math.min(...tours.map(t => t.duration)),
        max: Math.max(...tours.map(t => t.duration))
      },
      categories: [...new Set(tours.map(t => t.category))],
      countries: [...new Set(tours.map(t => t.country))]
    },
    recommendations: []
  };

  // Генерация рекомендаций
  const cheapestTour = tours.reduce((min, tour) => tour.price < min.price ? tour : min);
  const longestTour = tours.reduce((max, tour) => tour.duration > max.duration ? tour : max);
  const highestRated = tours.reduce((best, tour) => (tour.rating || 0) > (best.rating || 0) ? tour : best);

  comparison.recommendations.push({
    type: 'cheapest',
    tour: cheapestTour.title,
    reason: `Самый бюджетный вариант: $${cheapestTour.price}`
  });

  if (longestTour.duration !== cheapestTour.duration) {
    comparison.recommendations.push({
      type: 'longest',
      tour: longestTour.title,
      reason: `Самый длительный тур: ${longestTour.duration} дней`
    });
  }

  if (highestRated.rating && highestRated.rating > 0) {
    comparison.recommendations.push({
      type: 'highest_rated',
      tour: highestRated.title,
      reason: `Лучший рейтинг: ${highestRated.rating}/5`
    });
  }

  return comparison;
}

/**
 * Генерация текстового описания сравнения
 */
export function generateComparisonText(comparison) {
  let text = '📊 **Сравнение туров:**\n\n';

  comparison.tours.forEach((tour, index) => {
    text += `${index + 1}. **${tour.title}**\n`;
    text += `   📍 ${tour.country} | 💰 $${tour.price} | ⏱️ ${tour.duration} дней\n`;
    text += `   🏷️ ${tour.category}\n\n`;
  });

  text += '**Различия:**\n';
  text += `💰 Разница в цене: $${comparison.differences.price.difference}\n`;
  text += `⏱️ Длительность: от ${comparison.differences.duration.min} до ${comparison.differences.duration.max} дней\n`;
  text += `🌍 Страны: ${comparison.differences.countries.join(', ')}\n\n`;

  if (comparison.recommendations.length > 0) {
    text += '**Рекомендации:**\n';
    comparison.recommendations.forEach(rec => {
      text += `• ${rec.tour}: ${rec.reason}\n`;
    });
  }

  return text;
}

