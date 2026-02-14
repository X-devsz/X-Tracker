import { create } from 'zustand';
import type { NewExpense } from '../db/schema';
import {
  expensesRepo,
  type ExpenseWithCategory,
  type MonthlySummary,
  type CategoryBreakdown,
} from '../repositories';

type ExpenseCreateInput = Omit<NewExpense, 'id' | 'createdAt' | 'updatedAt'>;
type ExpenseUpdateInput = Partial<Omit<NewExpense, 'id' | 'createdAt' | 'updatedAt'>>;

interface RecentQuery {
  startDate: Date;
  endDate: Date;
  categoryId?: string;
}

interface SummaryQuery {
  year: number;
  month: number;
}

interface ExpenseStoreState {
  recentExpenses: ExpenseWithCategory[];
  monthlySummary: MonthlySummary | null;
  categoryBreakdown: CategoryBreakdown[];
  recentQuery: RecentQuery;
  summaryQuery: SummaryQuery;
  isLoadingRecent: boolean;
  isLoadingSummary: boolean;
  isLoadingBreakdown: boolean;
  error: string | null;
  fetchRecent: (query?: Partial<RecentQuery>) => Promise<void>;
  fetchMonthlySummary: (year: number, month: number) => Promise<void>;
  fetchCategoryBreakdown: (year: number, month: number) => Promise<void>;
  createExpense: (data: ExpenseCreateInput) => Promise<void>;
  updateExpense: (id: string, data: ExpenseUpdateInput) => Promise<void>;
  softDeleteExpense: (id: string) => Promise<void>;
  restoreExpense: (id: string) => Promise<void>;
  getExpenseById: (id: string) => Promise<ExpenseWithCategory | null>;
}

const getDefaultRange = (): RecentQuery => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 30);
  return { startDate, endDate };
};

const getCurrentMonth = (): SummaryQuery => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong.';

export const useExpenseStore = create<ExpenseStoreState>((set, get) => ({
  recentExpenses: [],
  monthlySummary: null,
  categoryBreakdown: [],
  recentQuery: getDefaultRange(),
  summaryQuery: getCurrentMonth(),
  isLoadingRecent: false,
  isLoadingSummary: false,
  isLoadingBreakdown: false,
  error: null,

  fetchRecent: async (query) => {
    const nextQuery = { ...get().recentQuery, ...query };
    set({ isLoadingRecent: true, error: null, recentQuery: nextQuery });
    try {
      const data = await expensesRepo.listByDateRange(
        nextQuery.startDate,
        nextQuery.endDate,
        nextQuery.categoryId
      );
      set({ recentExpenses: data, isLoadingRecent: false });
    } catch (error) {
      set({ error: toErrorMessage(error), isLoadingRecent: false });
    }
  },

  fetchMonthlySummary: async (year, month) => {
    set({
      isLoadingSummary: true,
      error: null,
      summaryQuery: { year, month },
    });
    try {
      const summary = await expensesRepo.getMonthlySummary(year, month);
      set({ monthlySummary: summary, isLoadingSummary: false });
    } catch (error) {
      set({ error: toErrorMessage(error), isLoadingSummary: false });
    }
  },

  fetchCategoryBreakdown: async (year, month) => {
    set({ isLoadingBreakdown: true, error: null });
    try {
      const breakdown = await expensesRepo.getCategoryBreakdown(year, month);
      set({ categoryBreakdown: breakdown, isLoadingBreakdown: false });
    } catch (error) {
      set({ error: toErrorMessage(error), isLoadingBreakdown: false });
    }
  },

  createExpense: async (data) => {
    set({ error: null });
    await expensesRepo.create(data);
    const { recentQuery, summaryQuery } = get();
    await get().fetchRecent(recentQuery);
    await get().fetchMonthlySummary(summaryQuery.year, summaryQuery.month);
  },

  updateExpense: async (id, data) => {
    set({ error: null });
    await expensesRepo.update(id, data);
    const { recentQuery, summaryQuery } = get();
    await get().fetchRecent(recentQuery);
    await get().fetchMonthlySummary(summaryQuery.year, summaryQuery.month);
  },

  softDeleteExpense: async (id) => {
    set({ error: null });
    await expensesRepo.softDelete(id);
    const { recentQuery, summaryQuery } = get();
    await get().fetchRecent(recentQuery);
    await get().fetchMonthlySummary(summaryQuery.year, summaryQuery.month);
  },

  restoreExpense: async (id) => {
    set({ error: null });
    await expensesRepo.restore(id);
    const { recentQuery, summaryQuery } = get();
    await get().fetchRecent(recentQuery);
    await get().fetchMonthlySummary(summaryQuery.year, summaryQuery.month);
  },

  getExpenseById: (id) => expensesRepo.getById(id),
}));
