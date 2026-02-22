"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { FilterCategory } from "@/data/quotes-pool";

interface CategoryContextValue {
  selectedCategory: FilterCategory;
  setSelectedCategory: (category: FilterCategory) => void;
}

const CategoryContext = createContext<CategoryContextValue | null>(null);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");
  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory(): CategoryContextValue {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategory must be used within CategoryProvider");
  return ctx;
}
