export type StrengthKey =
  | 'AIDIR' | 'TOOLC' | 'IDEAS' | 'EMBRI' | 'FLOWM'
  | 'AMBIG' | 'MICRO' | 'FOCUS' | 'ANTIF' | 'DATAR';

export interface LikertItem {
  id: string;
  type: 'likert';
  strength: StrengthKey;
  text: string;
}

export interface SjtItem {
  id: string;
  type: 'sjt';
  strength: StrengthKey;
  text: string;
  options: string[];
  best: number;
  second: number;
}

export type Item = LikertItem | SjtItem;

export interface Answer {
  id: string;
  choice: number;
}
