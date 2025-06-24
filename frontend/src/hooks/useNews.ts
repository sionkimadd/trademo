import { useState } from 'react';
import axios from 'axios';
import { NewsResponse, NewsSearchParams } from '../types/news';
import { API_BASE_URL } from '../types/api';

export const useNews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);

  const searchNews = async (params: NewsSearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<NewsResponse>(`${API_BASE_URL}/news/search`, {
        params: {
          keyword: params.keyword,
          lang: 'en',
          limit: 100,
        },
      });
      
      setNewsData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching keywrod news.');
      setNewsData(null);
    } finally {
      setLoading(false);
    }
  };

  const getTrendingNews = async (topic: string = 'World') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<NewsResponse>(`${API_BASE_URL}/news/trending`, {
        params: {
          topic,
          lang: 'en',
          limit: 100,
        },
      });
      
      setNewsData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching trending news.');
      setNewsData(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    newsData,
    searchNews,
    getTrendingNews,
  };
}; 