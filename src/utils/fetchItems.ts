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

export async function fetchItems(): Promise<Item[]> {
  const response = await fetch('/items.json');
  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }
  const data = await response.json();
  return itemsSchema.parse(data);
}
