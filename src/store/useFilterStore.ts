import { create } from 'zustand';

export type SortOrder = 'desc' | 'asc';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface FilterStoreState {
  dateRange: DateRange;
  categoryId: string | null;
  searchQuery: string;
  sortOrder: SortOrder;
  setDateRange: (range: DateRange) => void;
  setCategoryId: (categoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: SortOrder) => void;
  resetFilters: () => void;
}

const getDefaultRange = (): DateRange => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 30);
  return { startDate, endDate };
};

export const useFilterStore = create<FilterStoreState>((set) => ({
  dateRange: getDefaultRange(),
  categoryId: null,
  searchQuery: '',
  sortOrder: 'desc',

  setDateRange: (dateRange) => set({ dateRange }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  resetFilters: () =>
    set({
      dateRange: getDefaultRange(),
      categoryId: null,
      searchQuery: '',
      sortOrder: 'desc',
    }),
}));
