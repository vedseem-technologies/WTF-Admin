import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useCursorPagination = (endpoint, options = {}) => {
  const {
    limit = 10,
    filters = {}
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    nextCursor: null,
    prevCursor: null,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchData = useCallback(async (cursor = null, direction = 'next') => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        limit,
        direction,
        ...filters
      };

      if (cursor) {
        params.cursor = cursor;
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${backendUrl}${endpoint}`, { params });

      const result = response.data;

      // REPLACE Mode (for Next/Prev pagination)
      setData(result.data || []);

      setPageInfo({
        nextCursor: result.pageInfo?.nextCursor || null,
        prevCursor: result.pageInfo?.prevCursor || null,
        hasNextPage: !!result.pageInfo?.hasNextPage,
        hasPrevPage: !!result.pageInfo?.hasPrevPage
      });

    } catch (err) {
      console.error("Pagination Error:", err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, limit, JSON.stringify(filters)]);

  // Initial fetch
  useEffect(() => {
    fetchData(null, 'next');
  }, [fetchData]);

  const handleNext = () => {
    if (pageInfo.hasNextPage && pageInfo.nextCursor) {
      fetchData(pageInfo.nextCursor, 'next');
    }
  };

  const handlePrev = () => {
    if (pageInfo.hasPrevPage && pageInfo.prevCursor) {
      fetchData(pageInfo.prevCursor, 'prev');
    }
  };

  const refresh = () => {
    fetchData(null, 'next');
  };

  return {
    data,
    loading,
    error,
    pageInfo,
    handleNext,
    handlePrev,
    refresh // Used by components to reload after Add/Delete
  };
};

export default useCursorPagination;
