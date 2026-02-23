import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { categories } from './categories';

export const expenses = sqliteTable(
  'expenses',
  {
    id: text('id').primaryKey(),
    amountMinor: integer('amount_minor').notNull(),
    currency: text('currency').notNull().default('USD'),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id),
    occurredAt: integer('occurred_at', { mode: 'timestamp_ms' }).notNull(),
    note: text('note'),
    merchant: text('merchant'),
    paymentMethod: text('payment_method'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
    deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
  },
  (table) => ({
    occurredAtIdx: index('idx_expenses_occurred_at').on(table.occurredAt),
    categoryIdIdx: index('idx_expenses_category_id').on(table.categoryId),
    deletedAtIdx: index('idx_expenses_deleted_at').on(table.deletedAt),
  })
);

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
