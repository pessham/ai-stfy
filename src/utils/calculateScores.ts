import { Item, StrengthKey } from '../types';
import { strengthName } from './strengthMeta';

export interface StrengthScore {
  id: StrengthKey;
  name: string;
  score: number;
}

export function calculateScores(
  answers: Record<string, number>,
  items: Item[]
) {
  const keys: StrengthKey[] = [
    'AIDIR','TOOLC','IDEAS','EMBRI','FLOWM',
    'AMBIG','MICRO','FOCUS','ANTIF','DATAR'
  ];

  const raw: Record<StrengthKey, number> = Object.fromEntries(
    keys.map(k => [k, 0])
  ) as Record<StrengthKey, number>;

  const max: Record<StrengthKey, number> = Object.fromEntries(
    keys.map(k => [k, 0])
  ) as Record<StrengthKey, number>;

  const itemMap = Object.fromEntries(items.map(i => [i.id, i]));

  Object.entries(answers).forEach(([id, choice]) => {
    const item = itemMap[id] as Item;
    if (!item) return;

    const strength = item.strength as StrengthKey;
    if (item.type === 'likert') {
      raw[strength] += choice;          // 1〜5
      max[strength] += 5;
    } else {
      const best = item.best ?? -1;
      const second = item.second ?? -1;

      const gained =
        choice === best   ? 5 :
        choice === second ? 3 : 1;

      raw[strength] += gained;
      max[strength] += 5;
    }
  });

  const norm: Record<StrengthKey, number> = Object.fromEntries(
    keys.map(k => {
      const m = max[k] || 1;
      const n = +( (raw[k] / m) * 10 ).toFixed(1);
      return [k, n];
    })
  ) as Record<StrengthKey, number>;

  const sorted = Object.entries(norm)
    .sort(([,a],[,b]) => b - a)
    .map(([k,v]) => ({ id: k as StrengthKey, name: strengthName[k as StrengthKey], score: v }));

  return { sorted, scoreMap: norm };
}
