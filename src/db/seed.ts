import { v4 as uuid } from 'uuid';
import { db } from './client';
import { categories, type NewCategory } from './schema';

const DEFAULT_CATEGORIES: Omit<NewCategory, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'Food', icon: 'restaurant', colorToken: 'food', sortOrder: 1, isArchived: false },
  { name: 'Transport', icon: 'car', colorToken: 'transport', sortOrder: 2, isArchived: false },
  { name: 'Shopping', icon: 'cart', colorToken: 'shopping', sortOrder: 3, isArchived: false },
  { name: 'Bills', icon: 'receipt', colorToken: 'bills', sortOrder: 4, isArchived: false },
  { name: 'Health', icon: 'medkit', colorToken: 'health', sortOrder: 5, isArchived: false },
  { name: 'Entertainment', icon: 'game-controller', colorToken: 'entertainment', sortOrder: 6, isArchived: false },
  { name: 'Education', icon: 'book', colorToken: 'education', sortOrder: 7, isArchived: false },
  { name: 'Other', icon: 'ellipsis-horizontal', colorToken: 'other', sortOrder: 8, isArchived: false },
];

export async function seedDefaultCategories(): Promise<void> {
  const existing = await db.select({ id: categories.id }).from(categories).limit(1);
  if (existing.length > 0) {
    return;
  }

  const now = new Date();
  const records: NewCategory[] = DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    id: uuid(),
    createdAt: now,
    updatedAt: now,
  }));

  await db.insert(categories).values(records);
  console.log(`[DB] Seeded ${records.length} default categories`);
}
