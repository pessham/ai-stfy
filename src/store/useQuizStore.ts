import { create } from 'zustand';
import type { Item } from '../types';

interface QuizStore {
  items: Item[];
  answers: Record<string, number>;
  current: number;
  setItems: (items: Item[]) => void;
  setAnswers: (answers: Record<string, number>) => void;
  setAnswer: (id: string, choice: number) => void;
  next: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  items: [],
  answers: {},
  current: 0,
  
  setItems: (items) => set({ items }),
  
  setAnswers: (answers) => set({ answers }),
  
  setAnswer: (id, choice) => 
    set((state) => ({
      answers: { ...state.answers, [id]: choice }
    })),
  
  next: () => 
    set((state) => ({
      current: Math.min(state.current + 1, state.items.length)
    })),
  
  reset: () => 
    set({
      answers: {},
      current: 0
    })
}));
