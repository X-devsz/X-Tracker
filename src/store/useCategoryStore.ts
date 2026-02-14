import { create } from 'zustand';
import type { NewCategory, Category } from '../db/schema';
import { categoriesRepo } from '../repositories';

type CategoryCreateInput = Omit<NewCategory, 'id' | 'createdAt' | 'updatedAt'>;
type CategoryUpdateInput = Partial<Omit<NewCategory, 'id' | 'createdAt' | 'updatedAt'>>;

interface CategoryStoreState {
  categories: Category[];
  includeArchived: boolean;
  isLoading: boolean;
  error: string | null;
  fetchCategories: (includeArchived?: boolean) => Promise<void>;
  createCategory: (data: CategoryCreateInput) => Promise<void>;
  updateCategory: (id: string, data: CategoryUpdateInput) => Promise<void>;
  archiveCategory: (id: string) => Promise<void>;
  restoreCategory: (id: string) => Promise<void>;
  reorderCategories: (ids: string[]) => Promise<void>;
}

const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong.';

export const useCategoryStore = create<CategoryStoreState>((set, get) => ({
  categories: [],
  includeArchived: false,
  isLoading: false,
  error: null,

  fetchCategories: async (includeArchived) => {
    const nextIncludeArchived = includeArchived ?? get().includeArchived;
    set({ isLoading: true, error: null, includeArchived: nextIncludeArchived });
    try {
      const data = nextIncludeArchived
        ? await categoriesRepo.listAll()
        : await categoriesRepo.listActive();
      set({ categories: data, isLoading: false });
    } catch (error) {
      set({ error: toErrorMessage(error), isLoading: false });
    }
  },

  createCategory: async (data) => {
    set({ error: null });
    await categoriesRepo.create(data);
    await get().fetchCategories();
  },

  updateCategory: async (id, data) => {
    set({ error: null });
    await categoriesRepo.update(id, data);
    await get().fetchCategories();
  },

  archiveCategory: async (id) => {
    set({ error: null });
    await categoriesRepo.archive(id);
    await get().fetchCategories();
  },

  restoreCategory: async (id) => {
    set({ error: null });
    await categoriesRepo.restore(id);
    await get().fetchCategories();
  },

  reorderCategories: async (ids) => {
    set({ error: null });
    await categoriesRepo.reorder(ids);
    await get().fetchCategories();
  },
}));
