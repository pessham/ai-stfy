import { create } from 'zustand';
import { Item } from '../types';

interface QuizStore {
  items: Item[];
  answers: Record<string, number>;
  current: number;
  setItems: (items: Item[]) => void;
  setAnswer: (id: string, choice: number) => void;
  next: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  items: [],
  answers: {},
  current: 0,
  
  setItems: (items) => set({ items }),
  
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
