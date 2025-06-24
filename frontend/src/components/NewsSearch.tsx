import { useState, useEffect } from 'react';
import { useNews } from '../hooks/useNews';
import NewsCard from './NewsCard';
import { LoadingSpinner, ErrorAlert } from './common';

export default function NewsSearch() {
  const [keyword, setKeyword] = useState('');
  const { loading, error, newsData, searchNews, getTrendingNews } = useNews();

  useEffect(() => {
    getTrendingNews();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      searchNews({ keyword: keyword.trim() });
    }
  };

  const handleTrendingClick = (topic: string) => {
    getTrendingNews(topic);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Newsroom</h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Please enter a keyword"
                className="input input-bordered flex-1"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Fetch
              </button>
            </div>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleTrendingClick('World')}
          >
            World
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleTrendingClick('Business')}
          >
            Business
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleTrendingClick('Technology')}
          >
            Technology
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleTrendingClick('Entertainment')}
          >
            Entertainment
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleTrendingClick('Sports')}
          >
            Sports
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleTrendingClick('Science')}
          >
            Science
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleTrendingClick('Health')}
          >
            Health
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {error && <ErrorAlert message={error} />}

      {newsData && !loading && (
        <div>
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold">
              "{newsData.keyword}"
            </h2>
            <p className="text-sm opacity-60">{newsData.count} articles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsData.results.map((news, index) => (
              <NewsCard key={index} news={news} />
            ))}
          </div>

          {newsData.results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg opacity-60">NULL</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 