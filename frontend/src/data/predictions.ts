export interface Prediction {
  category: string
  title: string
  text: string
  moment: string
  advice: string
  quote: string
}

export const todayPrediction: Prediction = {
  category: 'рџ’њ РџРћР§РЈРўРўРЇ',
  title: 'РЎР»РѕРІР° РјР°СЋС‚СЊ Р·РЅР°С‡РµРЅРЅСЏ',
  text: 'РћРґРЅР° РєРѕСЂРѕС‚РєР° СЂРѕР·РјРѕРІР° СЃСЊРѕРіРѕРґРЅС– РјРѕР¶Рµ РјР°С‚Рё Р±С–Р»СЊС€Рµ Р·РЅР°С‡РµРЅРЅСЏ, РЅС–Р¶ Р·РґР°С”С‚СЊСЃСЏ Р·Р°СЂР°Р·.',
  moment: 'Р’РµС‡С–СЂ',
  advice: 'Р“РѕРІРѕСЂРё С‡РµСЃРЅРѕ, Р°Р»Рµ РјвЂ™СЏРєРѕ.',
  quote: 'В«Р†РЅРѕРґС– СЃР°РјРµ РЅРµСЃРїРѕРґС–РІР°РЅРµ РІРµРґРµ РґРѕ РЅР°Р№РєСЂР°С‰РѕРіРѕ.В»',
}
export function getDateKey(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
