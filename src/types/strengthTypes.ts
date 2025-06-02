export interface StrengthCategory {
  id: string;
  name: string;
  score: number;
  description: string;
}

export interface CharacterType {
  id: string;
  name: string;
  series: string;
  description: string;
  imageUrl: string;
  strengths: Record<string, number>;
}

export interface AssessmentResult {
  categories: StrengthCategory[];
  characterType: CharacterType;
  overallScore: number;
  aiAnalysis: string;
}

export const STRENGTH_CATEGORIES = [
  {
    id: 'leadership',
    name: 'リーダーシップ',
    description: '目標に向かってチームを導く能力'
  },
  {
    id: 'innovation',
    name: '創造性',
    description: '新しいアイデアを生み出し実現する力'
  },
  {
    id: 'resilience',
    name: '回復力',
    description: '困難に直面しても立ち直る力'
  },
  {
    id: 'empathy',
    name: '共感力',
    description: '他者の感情を理解し適切に対応する能力'
  },
  {
    id: 'technical',
    name: '技術力',
    description: '専門的なスキルと知識'
  }
];

export const CHARACTER_TYPES: CharacterType[] = [
  {
    id: 'harry',
    name: 'ハリー・ポッター',
    series: 'ハリー・ポッター',
    description: '強い意志と勇気を持ち、仲間を大切にするリーダー',
    imageUrl: '/characters/harry.png',
    strengths: {
      leadership: 90,
      innovation: 75,
      resilience: 95,
      empathy: 85,
      technical: 70
    }
  },
  {
    id: 'amuro',
    name: 'アムロ・レイ',
    series: '機動戦士ガンダム',
    description: '優れた直感力と適応力を持つパイロット',
    imageUrl: '/characters/amuro.png',
    strengths: {
      leadership: 80,
      innovation: 95,
      resilience: 85,
      empathy: 70,
      technical: 95
    }
  },
  {
    id: 'hermione',
    name: 'ハーマイオニー・グレンジャー',
    series: 'ハリー・ポッター',
    description: '知識と論理的思考力に優れた問題解決者',
    imageUrl: '/characters/hermione.png',
    strengths: {
      leadership: 75,
      innovation: 85,
      resilience: 80,
      empathy: 75,
      technical: 100
    }
  },
  {
    id: 'bright',
    name: 'ブライト・ノア',
    series: '機動戦士ガンダム',
    description: '冷静な判断力と強い責任感を持つ指揮官',
    imageUrl: '/characters/bright.png',
    strengths: {
      leadership: 100,
      innovation: 70,
      resilience: 90,
      empathy: 80,
      technical: 75
    }
  }
];
