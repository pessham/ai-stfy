import { StrengthKey } from '../types';

export interface UserTypeInfo {
  id: string;
  icon: string;
  name: string;
  catchCopy: string;
}

/* ペア平均 ― 10 点満点同士 */
const pairs: Record<string, StrengthKey[]> = {
  ORCH: ['AIDIR', 'TOOLC'],
  SPARK: ['IDEAS', 'AMBIG'],
  BRIDGE: ['EMBRI', 'FLOWM'],
  CRAFT: ['DATAR', 'FOCUS'],
  SPRINT: ['ANTIF', 'MICRO']
};

const meta: Record<string, UserTypeInfo> = {
  ORCH: { id: 'ORCH', icon: '🎥', name: 'AIオーケストレーター', catchCopy: 'ブライト・ノア型 "司令塔"' },
  SPARK: { id: 'SPARK', icon: '💡', name: 'クリエイティブスパーク', catchCopy: 'ドク型 "発明マグマ"' },
  BRIDGE: { id: 'BRIDGE', icon: '🤝', name: 'ムードブリッジャー', catchCopy: 'C-3PO型 "橋渡し"' },
  CRAFT: { id: 'CRAFT', icon: '📊', name: 'データクラフトマン', catchCopy: 'R2-D2型 "ロジック職人"' },
  SPRINT: { id: 'SPRINT', icon: '🚀', name: 'プロトスプリンター', catchCopy: 'アムロ型 "高速改良"' },
  BALANCE: { id: 'BALANCE', icon: '⚖️', name: 'バランスアダプター', catchCopy: 'ハリー型 "万能"' }
};

export function classifyType(score: Record<StrengthKey, number>): UserTypeInfo {
  const avg: Record<string, number> = {};
  Object.entries(pairs).forEach(([k,[a,b]]) => {
    avg[k] = (score[a] + score[b]) / 2;
  });

  const [top, second] = Object.entries(avg).sort(([,x],[,y])=>y-x);
  return (top[1] - second[1] >= 1.5) ? meta[top[0]] : meta['BALANCE'];
}
