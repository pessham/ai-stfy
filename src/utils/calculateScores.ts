import { Item, Answer, StrengthKey } from '../types';

export function calculateScores(answers: Record<string, number>, items: Item[]) {
  const score: Record<StrengthKey, number> = {
    AIDIR: 0, TOOLC: 0, IDEAS: 0, EMBRI: 0, FLOWM: 0,
    AMBIG: 0, MICRO: 0, FOCUS: 0, ANTIF: 0, DATAR: 0
  };

  const itemMap = Object.fromEntries(items.map(i => [i.id, i]));

  Object.entries(answers).forEach(([id, choice]) => {
    const item = itemMap[id];
    if (!item) return;

    if (item.type === 'likert') {
      score[item.strength] += choice; // 1-5
    } else { // sjt
      if (choice === item.best) score[item.strength] += 5;
      else if (choice === item.second) score[item.strength] += 3;
      else score[item.strength] += 1;
    }
  });

  return Object.entries(score)
    .sort(([, v1], [, v2]) => v2 - v1); // [[key,score],…] desc
}
