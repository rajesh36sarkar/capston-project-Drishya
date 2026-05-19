import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

export const useInfiniteScroll = (endpoint) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();
  
  const pageRef = useRef(page);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const currentTargetPage = pageRef.current;
      const res = await axios.get(`${endpoint}?page=${currentTargetPage}&limit=12`);
      const newItems = res.data || [];
      
      setItems(prev => {
        const existingIds = new Set(prev.map(item => item._id));
        const filteredNewItems = newItems.filter(item => !existingIds.has(item._id));
        return [...prev, ...filteredNewItems];
      });

      setHasMore(newItems.length === 12);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching stream chunks during infinite scroll loop:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, endpoint]);

  const lastItemRef = useCallback(node => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, loadMore]);

  const resetScroll = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return { items, loading, hasMore, lastItemRef, resetScroll };
};