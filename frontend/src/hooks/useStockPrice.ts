import { useRef, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { API_PATHS, API_BASE_URL } from '../types/api';
import { StockData } from '../types/stock';
import { scheduleMinuteInterval } from '../utils/scheduleUtils';

export const useStockPrice = (
    stockData: StockData | null, 
    setStockData: (data: StockData | null) => void
) => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    const currentSymbolRef = useRef<string | null>(null);
    const isUpdateRunningRef = useRef<boolean>(false);
    const [isPriceUpdating, setIsPriceUpdating] = useState<boolean>(false);
    const cleanupRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (stockData?.symbol) {
            currentSymbolRef.current = stockData.symbol;
            
            if (cleanupRef.current) {
                cleanupRef.current();
            }
            
            cleanupRef.current = scheduleMinuteInterval(() => {
                updatePriceData();
            });
        } else {
            currentSymbolRef.current = null;
            if (cleanupRef.current) {
                cleanupRef.current();
                cleanupRef.current = null;
            }
        }
        
        return () => {
            if (cleanupRef.current) {
                cleanupRef.current();
                cleanupRef.current = null;
            }
        };
    }, [stockData?.symbol]);

    const updatePriceData = async () => {
        if (!user || !currentSymbolRef.current || isUpdateRunningRef.current) return;
        
        isUpdateRunningRef.current = true;
        setIsPriceUpdating(true);
        try {
            const token = await user.getIdToken(true);
            const response = await fetch(`${API_BASE_URL}${API_PATHS.STOCK}/${currentSymbolRef.current}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const updatedData = await response.json();
                if (currentSymbolRef.current === updatedData.symbol) {
                    setStockData(updatedData);
                }
            }
        } catch (err) {
        } finally {
            isUpdateRunningRef.current = false;
            setTimeout(() => {
                setIsPriceUpdating(false);
            }, 300);
        }
    };
    
    return { isPriceUpdating };
};