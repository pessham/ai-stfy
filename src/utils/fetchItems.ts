import { z } from 'zod';
import type { Item } from '../types';
import items from '../assets/items.json';

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
  return itemsSchema.parse(items);
}
