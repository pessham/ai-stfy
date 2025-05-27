import { z } from 'zod';
import type { Item } from '../types';

const strengthKeySchema = z.enum([
  'AIDIR', 'TOOLC', 'IDEAS', 'EMBRI', 'FLOWM',
  'AMBIG', 'MICRO', 'FOCUS', 'ANTIF', 'DATAR'
]);

const itemSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string(),
    type: z.literal('likert'),
    strength: strengthKeySchema,
    text: z.string()
  }),
  z.object({
    id: z.string(),
    type: z.literal('sjt'),
    strength: strengthKeySchema,
    text: z.string(),
    options: z.array(z.string()),
    best: z.number(),
    second: z.number()
  })
]);

const itemsSchema = z.array(itemSchema);

const mockItems: Item[] = [
  {
    id: '1',
    text: 'AIに指示を出す際、目的とコンテキストを明確に説明することを心がけている',
    type: 'likert',
    strength: 'AIDIR'
  },
  {
    id: '2',
    text: '新しいツールやアプリケーションの使い方を素早く習得できる',
    type: 'likert',
    strength: 'TOOLC'
  },
  {
    id: '3',
    text: '新機能の提案を求められています。どのようにアイデアを出しますか？',
    type: 'sjt',
    strength: 'IDEAS',
    options: [
      '既存の類似機能を参考に、改良点を考える',
      'ユーザーの行動データを分析し、ニーズを特定する',
      '異なる分野のソリューションを組み合わせて新しい視点を見出す',
      'チームメンバーとブレインストーミングセッションを行う'
    ],
    best: 2,
    second: 1
  }
];

export async function fetchItems(): Promise<Item[]> {
  // モックデータを返す
  return Promise.resolve(mockItems);
}
