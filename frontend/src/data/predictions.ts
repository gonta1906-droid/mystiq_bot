export interface Prediction {
  category: string
  title: string
  text: string
  moment: string
  advice: string
  quote: string
}

export const todayPrediction: Prediction = {
  category: '💜 ПОЧУТТЯ',
  title: 'Слова мають значення',
  text: 'Одна коротка розмова сьогодні може мати більше значення, ніж здається зараз.',
  moment: 'Вечір',
  advice: 'Говори чесно, але м’яко.',
  quote: '«Іноді саме несподіване веде до найкращого.»',
}
export function getDateKey(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
