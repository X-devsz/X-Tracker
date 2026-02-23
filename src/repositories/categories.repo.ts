import { and, asc, eq, isNull } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { db } from '../db/client';
import { categories, type Category, type NewCategory } from '../db/schema';

type CategoryCreateInput = Omit<NewCategory, 'id' | 'createdAt' | 'updatedAt'>;
type CategoryUpdateInput = Partial<Omit<NewCategory, 'id' | 'createdAt' | 'updatedAt'>>;

export const categoriesRepo = {
  async create(data: CategoryCreateInput): Promise<Category> {
    const now = new Date();
    const record: NewCategory = {
      ...data,
      id: uuid(),
      isArchived: data.isArchived ?? false,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(categories).values(record);
    return record as Category;
  },

  async update(id: string, data: CategoryUpdateInput): Promise<void> {
    await db
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categories.id, id));
  },

  async archive(id: string): Promise<void> {
    await db
      .update(categories)
      .set({ isArchived: true, updatedAt: new Date() })
      .where(eq(categories.id, id));
  },

  async listActive(): Promise<Category[]> {
    return db
      .select()
      .from(categories)
      .where(and(eq(categories.isArchived, false), isNull(categories.deletedAt)))
      .orderBy(asc(categories.sortOrder), asc(categories.name));
  },

  async listAll(): Promise<Category[]> {
    return db
      .select()
      .from(categories)
      .where(isNull(categories.deletedAt))
      .orderBy(asc(categories.sortOrder), asc(categories.name));
  },
};
