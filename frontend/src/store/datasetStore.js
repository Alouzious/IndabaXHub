import { create } from "zustand";
import { PAGE_SIZE } from "../utils/constants";

const initialFilters = {
  search: "",
  category: "",
  license: "",
  sort: "recent",
};

export const useDatasetStore = create((set) => ({
  filters: { ...initialFilters },
  page: 1,
  pageSize: PAGE_SIZE,

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      page: 1,
    })),

  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search }, page: 1 })),

  resetFilters: () => set({ filters: { ...initialFilters }, page: 1 }),

  setPage: (page) => set({ page }),
}));
