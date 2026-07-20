import { useState, useEffect, useCallback } from "react";
import type { PaginationParams } from "../types/api";

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  debounceMs?: number;
}

export function usePagination(options?: UsePaginationOptions) {
  const {
    initialPage = 1,
    initialLimit = 10,
    initialSearch = "",
    debounceMs = 500,
  } = options || {};

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to page 1 when search changes
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, debounceMs]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to page 1 when limit changes
  }, []);

  const getPaginationParams = useCallback((): PaginationParams => {
    return {
      page,
      limit,
      search: debouncedSearch,
    };
  }, [page, limit, debouncedSearch]);

  return {
    page,
    limit,
    searchInput,
    debouncedSearch,
    handleSearchChange,
    handlePageChange,
    handleLimitChange,
    getPaginationParams,
  };
}
