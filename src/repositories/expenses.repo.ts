import { and, desc, eq, gte, isNull, lte, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { db } from '../db/client';
import { categories, expenses, type Expense, type NewExpense } from '../db/schema';

export interface ExpenseWithCategory extends Expense {
  categoryName: string | null;
  categoryIcon: string | null;
  categoryColorToken: string | null;
}

export interface MonthlySummary {
  totalMinor: number;
  count: number;
  month: string;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string | null;
  categoryColorToken: string | null;
  totalMinor: number;
  count: number;
  percentage: number;
}

type ExpenseCreateInput = Omit<NewExpense, 'id' | 'createdAt' | 'updatedAt'>;
type ExpenseUpdateInput = Partial<Omit<NewExpense, 'id' | 'createdAt' | 'updatedAt'>>;

const assertPositiveAmount = (amountMinor: number) => {
  if (amountMinor <= 0) {
    throw new Error('Amount must be greater than zero.');
  }
};

export const expensesRepo = {
  async create(data: ExpenseCreateInput): Promise<Expense> {
    assertPositiveAmount(data.amountMinor);

    const now = new Date();
    const record: NewExpense = {
      ...data,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(expenses).values(record);
    return record as Expense;
  },

  async update(id: string, data: ExpenseUpdateInput): Promise<void> {
    if (data.amountMinor !== undefined) {
      assertPositiveAmount(data.amountMinor);
    }

    await db
      .update(expenses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(expenses.id, id));
  },

  async softDelete(id: string): Promise<void> {
    const now = new Date();
    await db
      .update(expenses)
      .set({ deletedAt: now, updatedAt: now })
      .where(eq(expenses.id, id));
  },

  async restore(id: string): Promise<void> {
    await db
      .update(expenses)
      .set({ deletedAt: null, updatedAt: new Date() })
      .where(eq(expenses.id, id));
  },

  async getById(id: string): Promise<ExpenseWithCategory | null> {
    const results = await db
      .select({
        ...expenses,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        categoryColorToken: categories.colorToken,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(and(eq(expenses.id, id), isNull(expenses.deletedAt)))
      .limit(1);

    return results[0] ?? null;
  },

  async listByDateRange(
    startDate: Date,
    endDate: Date,
    categoryId?: string
  ): Promise<ExpenseWithCategory[]> {
    const conditions = [
      gte(expenses.occurredAt, startDate),
      lte(expenses.occurredAt, endDate),
      isNull(expenses.deletedAt),
    ];

    if (categoryId) {
      conditions.push(eq(expenses.categoryId, categoryId));
    }

    return db
      .select({
        ...expenses,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        categoryColorToken: categories.colorToken,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(expenses.occurredAt));
  },

  async getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const result = await db
      .select({
        totalMinor: sql<number>`COALESCE(SUM(${expenses.amountMinor}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(expenses)
      .where(
        and(
          gte(expenses.occurredAt, startDate),
          lte(expenses.occurredAt, endDate),
          isNull(expenses.deletedAt)
        )
      );

    return {
      totalMinor: result[0]?.totalMinor ?? 0,
      count: result[0]?.count ?? 0,
      month: `${year}-${String(month).padStart(2, '0')}`,
    };
  },

  async getCategoryBreakdown(year: number, month: number): Promise<CategoryBreakdown[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const results = await db
      .select({
        categoryId: expenses.categoryId,
        categoryName: categories.name,
        categoryColorToken: categories.colorToken,
        totalMinor: sql<number>`COALESCE(SUM(${expenses.amountMinor}), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(
        and(
          gte(expenses.occurredAt, startDate),
          lte(expenses.occurredAt, endDate),
          isNull(expenses.deletedAt)
        )
      )
      .groupBy(expenses.categoryId, categories.name, categories.colorToken)
      .orderBy(desc(sql`SUM(${expenses.amountMinor})`));

    const grandTotal = results.reduce((sum, item) => sum + item.totalMinor, 0);

    return results.map((item) => ({
      ...item,
      categoryName: item.categoryName ?? null,
      categoryColorToken: item.categoryColorToken ?? null,
      percentage: grandTotal > 0 ? Math.round((item.totalMinor / grandTotal) * 100) : 0,
    }));
  },
};
