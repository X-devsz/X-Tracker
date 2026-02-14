import { and, asc, eq, isNull, ne, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { db } from '../db/client';
import { categories, type Category, type NewCategory } from '../db/schema';
import {
  normalizeCategoryName,
  validateCategoryName,
} from '../domain/validators/category.validator';

type CategoryCreateInput = Omit<NewCategory, 'id' | 'createdAt' | 'updatedAt'>;
type CategoryUpdateInput = Partial<Omit<NewCategory, 'id' | 'createdAt' | 'updatedAt'>>;

export const categoriesRepo = {
  async create(data: CategoryCreateInput): Promise<Category> {
    const nameError = validateCategoryName(data.name);
    if (nameError) {
      throw new Error(nameError);
    }

    const normalized = normalizeCategoryName(data.name);
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(
        and(
          isNull(categories.deletedAt),
          sql`LOWER(${categories.name}) = ${normalized}`,
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new Error('Category name must be unique.');
    }

    const maxOrder = await db
      .select({ max: sql<number>`COALESCE(MAX(${categories.sortOrder}), 0)` })
      .from(categories)
      .where(isNull(categories.deletedAt));

    const nextSortOrder = (maxOrder[0]?.max ?? 0) + 1;
    const now = new Date();
    const record: NewCategory = {
      ...data,
      name: data.name.trim(),
      id: uuid(),
      sortOrder: data.sortOrder ?? nextSortOrder,
      isArchived: data.isArchived ?? false,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(categories).values(record);
    return record as Category;
  },

  async update(id: string, data: CategoryUpdateInput): Promise<void> {
    const nextData: CategoryUpdateInput = { ...data };
    if (data.name !== undefined) {
      const nameError = validateCategoryName(data.name);
      if (nameError) {
        throw new Error(nameError);
      }

      const normalized = normalizeCategoryName(data.name);
      const existing = await db
        .select({ id: categories.id })
        .from(categories)
        .where(
          and(
            isNull(categories.deletedAt),
            ne(categories.id, id),
            sql`LOWER(${categories.name}) = ${normalized}`,
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        throw new Error('Category name must be unique.');
      }

      nextData.name = data.name.trim();
    }

    await db
      .update(categories)
      .set({ ...nextData, updatedAt: new Date() })
      .where(eq(categories.id, id));
  },

  async archive(id: string): Promise<void> {
    await db
      .update(categories)
      .set({ isArchived: true, updatedAt: new Date() })
      .where(eq(categories.id, id));
  },

  async restore(id: string): Promise<void> {
    await db
      .update(categories)
      .set({ isArchived: false, updatedAt: new Date() })
      .where(eq(categories.id, id));
  },

  async reorder(ids: string[]): Promise<void> {
    const now = new Date();
    await db.transaction(async (tx) => {
      for (const [index, id] of ids.entries()) {
        await tx
          .update(categories)
          .set({ sortOrder: index, updatedAt: now })
          .where(eq(categories.id, id));
      }
    });
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
