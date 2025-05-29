import { StrengthKey } from '../types';

/* 10 Strengths */
export const strengthName: Record<StrengthKey, string> = {
  AIDIR: 'AI指示力',
  TOOLC: 'ツール活用力',
  IDEAS: 'アイデア創出力',
  EMBRI: '共感・ブリッジ力',
  FLOWM: 'フロー管理力',
  AMBIG: '曖昧さ許容力',
  MICRO: 'マイクロタスク力',
  FOCUS: '集中持続力',
  ANTIF: '先行検証力',
  DATAR: 'データ分析力'
};

export const strengthTips: Record<StrengthKey, string> = {
  AIDIR: 'AIに渡す指示は具体的で明確に…',
  TOOLC: '適切なツールの選択と組み合わせが効率を左右…',
  IDEAS: '異分野の知識を組み合わせ新視点を発見…',
  EMBRI: '橋渡し役として対話を促進…',
  FLOWM: '優先順位付けと進捗管理が鍵…',
  AMBIG: '不確実でも冷静に判断し段階的に明確化…',
  MICRO: '大タスクを細分化し具体行動へ…',
  FOCUS: '集中阻害要因を除き持続的リズムを…',
  ANTIF: '小規模テストで潜在問題を早期検証…',
  DATAR: 'データパターンを見抜き意思決定に活用…'
};
