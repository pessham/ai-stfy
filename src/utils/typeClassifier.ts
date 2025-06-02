import { StrengthKey } from '../types';

export interface UserTypeInfo {
  id: string;
  icon: string;
  name: string;
  catchCopy: string;
  imageNamePart: string;
  explanation: string;
  characterSource: string; // 出典情報を追加
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
  ORCH: { 
    id: 'ORCH', 
    icon: '🎥', 
    name: 'AIオーケストレーター', 
    catchCopy: 'ブライト・ノア型 "司令塔"', 
    imageNamePart: 'bright', 
    explanation: '限られた人員・ツールでも最適な布陣を描けるあなたは、まさに“AI 司令塔”。\n目的を数値に落とし込み、タスクを AI とメンバーへ即配分──このリズムが組織の推進力になります。\n次の 90 日は“任せる勇気”を磨き、あなた自身は“未来の計器盤”を読む時間を確保しましょう。',
    characterSource: '(出典: 機動戦士ガンダム – ブライト・ノア)'
  },
  SPARK: { 
    id: 'SPARK', 
    icon: '💡', 
    name: 'クリエイティブスパーク', 
    catchCopy: 'ドク型 "発明マグマ"', 
    imageNamePart: 'doc', 
    explanation: '「まずやってみる！」の火花で周囲を驚かせる発明マグマ型。\n思いつき× AI プロトで作った “30％デモ” を週イチで公開すると、アイデアが実験台を得て爆発的に進化します。\n失敗談もブログで公開し、仲間のコメントを燃料に変えましょう。',
    characterSource: '(出典: バック・トゥ・ザ・フューチャー – ドク)'
  },
  BRIDGE: { 
    id: 'BRIDGE', 
    icon: '🤝', 
    name: 'ムードブリッジャー', 
    catchCopy: 'C-3PO型 "橋渡し"', 
    imageNamePart: 'c3po', 
    explanation: '異文化・異部門の言葉と空気を翻訳する潤滑油。\nあなたがいる会議では齟齬が溶け、AI の専門用語も日常語に早変わり。\n次のステップは“リアルタイム翻訳メモ”を共有して議事録を自動完成させること。対話のハードルがさらに下がります。',
    characterSource: '(出典: スター・ウォーズ – C-3PO)'
  },
  CRAFT: { 
    id: 'CRAFT', 
    icon: '📊', 
    name: 'データクラフトマン', 
    catchCopy: 'R2-D2型 "ロジック職人"', 
    imageNamePart: 'r2d2', 
    explanation: 'ログの海から因果を抜き出し、即コードを書いて修理もこなす職人。\n一つの障害を解くたびに “再発防止スクリプト” をテンプレ化し、自動化レポを可視化するとチーム全体の MTTR が劇的に短縮。\nRust／Go など高速処理言語の習得が次のレベルアップ鍵です。',
    characterSource: '(出典: スター・ウォーズ – R2-D2)'
  },
  SPRINT: { 
    id: 'SPRINT', 
    icon: '🚀', 
    name: 'プロトスプリンター', 
    catchCopy: 'アムロ型 "高速改良"', 
    imageNamePart: 'amuro', 
    explanation: '戦場（現場）で動かしながら OS チューンを回す高速改良エンジニア。\n「ログ → 微修正 → 再戦」を 24h サイクルで回せるあなたは、実装フェーズの救世主。\nデバッグ & 計測スクリプトを箱にまとめ、誰でも即トライできる環境を布教しましょう。',
    characterSource: '(出典: 機動戦士ガンダム – アムロ・レイ)'
  },
  BALANCE: { 
    id: 'BALANCE', 
    icon: '⚖️', 
    name: 'バランスアダプター', 
    catchCopy: 'ハリー型 "万能"', 
    imageNamePart: 'harry', 
    explanation: '直感・分析・共感を状況ごとに切り替える万能型。\nあなたがプロジェクトに入ると、尖ったメンバーの能力が自然にかみ合います。\n今期は“専門の核”を 1 つだけ決めて深掘りし、ジェネラル × スペシャリストのハイブリッドへ成長を。',
    characterSource: '(出典: ハリー・ポッター – ハリー)'
  }
};

export function classifyType(score: Record<StrengthKey, number>): UserTypeInfo {
  const avg: Record<string, number> = {};
  Object.entries(pairs).forEach(([k,[a,b]]) => {
    avg[k] = (score[a] + score[b]) / 2;
  });

  const [top, second] = Object.entries(avg).sort(([,x],[,y])=>y-x);
  return (top[1] - second[1] >= 1.5) ? meta[top[0]] : meta['BALANCE'];
}
