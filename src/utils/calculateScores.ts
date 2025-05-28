import type { Item, StrengthKey } from '../types';
import { strengthName } from './strengthMeta';

export interface StrengthScore {
  id: StrengthKey;
  name: string;
  score: number;
}

export function calculateScores(answers: Record<string, number>, items: Item[]): StrengthScore[] {
  const scores: Record<StrengthKey, number> = {
    AIDIR: 0, TOOLC: 0, IDEAS: 0, EMBRI: 0, FLOWM: 0,
    AMBIG: 0, MICRO: 0, FOCUS: 0, ANTIF: 0, DATAR: 0
  };

  const itemMap = new Map(items.map(item => [item.id, item]));

  Object.entries(answers).forEach(([id, choice]) => {
    const item = itemMap.get(id);
    if (!item) return;

    if (item.type === 'likert') {
      scores[item.strength] += choice; // 1-5
    } else {
      scores[item.strength] += 
        choice === item.best ? 5 :
        choice === item.second ? 3 : 1;
    }
  });

  return Object.entries(scores)
    .map(([id, score]) => ({
      id: id as StrengthKey,
      name: strengthName[id as StrengthKey],
      score
    }))
    .sort((a, b) => b.score - a.score);
}
