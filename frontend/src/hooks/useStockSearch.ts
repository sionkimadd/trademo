import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { API_PATHS, API_BASE_URL } from '../types/api';
import { StockData } from '../types/stock';
import { useErrorContext } from '../contexts/ErrorContext';

export function useStockSearch() {
    const auth = getAuth();
    const { setError } = useErrorContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [stockLoading, setStockLoading] = useState(false);
    const [stockData, setStockData] = useState<StockData | null>(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setStockLoading(true);
        setError(null);
        setStockData(null);
        
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Login required');
            
            const token = await user.getIdToken(true);
            
            const formattedSymbol = searchQuery.trim().toUpperCase();
            
            const response = await fetch(`${API_BASE_URL}${API_PATHS.STOCK}/${formattedSymbol}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Response format error' }));
                throw new Error(errorData.detail || 'Failed to load stock data');
            }
            
            const data = await response.json();
            setStockData(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred during stock search';
            setError(errorMessage);
        } finally {
            setStockLoading(false);
        }
    };

    return {
        searchQuery,
        setSearchQuery,
        stockLoading,
        stockData,
        setStockData,
        handleSearch
    };
} 