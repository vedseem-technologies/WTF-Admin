import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useCursorPagination = (endpoint, options = {}) => {
  const { limit = 10, filters = {} } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    nextCursor: null,
    prevCursor: null,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchData = useCallback(
    async (cursor = null, direction = "next") => {
      setLoading(true);
      setError(null);
      try {
        const params = { limit, direction, ...filters };
        if (cursor) params.cursor = cursor;

        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const response = await axios.get(`${backendUrl}${endpoint}`, {
          params,
        });
        const result = response.data;

        setData(result.data || []);
        setPageInfo({
          nextCursor: result.pageInfo?.nextCursor || null,
          prevCursor: result.pageInfo?.prevCursor || null,
          hasNextPage: !!result.pageInfo?.hasNextPage,
          hasPrevPage: !!result.pageInfo?.hasPrevPage,
        });
      } catch (err) {
        console.error("Pagination Error:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [endpoint, limit, filters.search, filters.active],
  );

  // Initial fetch
  useEffect(() => {
    fetchData(null, "next");
  }, [fetchData]);

  const handleNext = () => {
    if (pageInfo.hasNextPage && pageInfo.nextCursor) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setPage((p) => p + 1);
      fetchData(pageInfo.nextCursor, "next");
    }
  };

  const handlePrev = () => {
    if (pageInfo.hasPrevPage && pageInfo.prevCursor) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setPage((p) => Math.max(1, p - 1));
      fetchData(pageInfo.prevCursor, "prev");
    }
  };

  const refresh = () => {
    setPage(1);
    fetchData(null, "next");
  };

  return {
    data,
    loading,
    error,
    page,
    pageInfo,
    handleNext,
    handlePrev,
    refresh,
    setData,
  };
};

export default useCursorPagination;
