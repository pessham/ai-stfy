import { StrengthKey } from '../types';

export interface UserTypeInfo {
  id: string;
  name: string;
  icon: string;
  catchCopy: string;
  characterName: string;
  series: string;
  description: string;
  imagePath: string;
}

const pairs: Record<string, StrengthKey[]> = {
  ORCH: ['AIDIR', 'TOOLC'],
  SPARK: ['IDEAS', 'AMBIG'],
  BRIDGE: ['EMBRI', 'FLOWM'],
  CRAFT: ['DATAR', 'FOCUS'],
  SPRINT: ['MICRO', 'ANTIF']
};

const meta: Record<string, UserTypeInfo> = {
  ORCH: {
    id: 'ORCH',
    icon: '🎯',
    name: 'AIオーケストレーター',
    catchCopy: 'AIを司令し、道具を融合する戦術家',
    characterName: 'ブライト・ノア',
    series: '機動戦士ガンダム',
    description: '限られたリソースでも的確に指示を飛ばし、艦とモビルスーツを同時に裁く"司令塔"。',
    imagePath: '/img/orch_bright.png'
  },
  SPARK: {
    id: 'SPARK',
    icon: '💡',
    name: 'クリエイティブスパーク',
    catchCopy: '制約を遊ぶ発想力の噴水',
    characterName: 'ドク・エメット・ブラウン',
    series: 'バック・トゥ・ザ・フューチャー',
    description: '制約をゲームに変え、一夜にして試作品を生む"発明マグマ"。',
    imagePath: '/img/spark_doc.png'
  },
  BRIDGE: {
    id: 'BRIDGE',
    icon: '🤝',
    name: 'ムードブリッジャー',
    catchCopy: '共感と進行でチームを繋ぐ潤滑油',
    characterName: 'C-3PO',
    series: 'スター・ウォーズ',
    description: '600万種の言語と空気を読み、異文化を橋渡しする潤滑油。',
    imagePath: '/img/bridge_c3po.png'
  },
  CRAFT: {
    id: 'CRAFT',
    icon: '📊',
    name: 'データクラフトマン',
    catchCopy: '数字を磨き、的を射抜く職人',
    characterName: 'R2-D2',
    series: 'スター・ウォーズ',
    description: 'ログ解析・ハッキング・修理を瞬時にこなし、数字で問題を解く小型天才ドロイド。',
    imagePath: '/img/craft_r2d2.png'
  },
  SPRINT: {
    id: 'SPRINT',
    icon: '🚀',
    name: 'プロトスプリンター',
    catchCopy: '小さく作って失敗で加速する挑戦者',
    characterName: 'アムロ・レイ',
    series: '機動戦士ガンダム',
    description: '高速トライ→フィードバック→チューニング のサイクルを、最前線で実証する"クイック改良エンジニア"',
    imagePath: '/img/sprint_amuro.png'
  },
  BALANCE: {
    id: 'BALANCE',
    icon: '⚖️',
    name: 'バランスアダプター',
    catchCopy: 'どの場面でも平均以上、万能型',
    characterName: 'ハリー・ポッター',
    series: 'ハリー・ポッター',
    description: '勇気・直感・仲間思い…複数の強みを状況に応じてバランスよく発揮する万能型。',
    imagePath: '/img/balance_harry.png'
  }
};

export function classifyType(scoreMap: Record<StrengthKey, number>): UserTypeInfo {
  // 平均点を計算
  const averages: Record<string, number> = {};
  Object.entries(pairs).forEach(([k, [s1, s2]]) => {
    averages[k] = (scoreMap[s1] + scoreMap[s2]) / 2;
  });

  // 最大ペア判定
  const entries = Object.entries(averages).sort(([,a],[,b]) => b - a);
  const [topKey, topVal] = entries[0];
  const [, secondVal] = entries[1];
  const diff = topVal - secondVal;

  return diff >= 1.5 ? meta[topKey] : meta['BALANCE'];
}
