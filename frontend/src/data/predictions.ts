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