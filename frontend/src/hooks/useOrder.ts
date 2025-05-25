import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { API_PATHS, API_BASE_URL } from '../types/api';
import { useErrorContext } from '../contexts/ErrorContext';

export function useOrder() {
    const auth = getAuth();
    const { setError } = useErrorContext();
    const [orderLoading, setOrderLoading] = useState(false);

    const handleOrder = async (isBuy: boolean, stockSymbol: string, orderQuantity: number) => {
        if (!stockSymbol) return;
        
        setOrderLoading(true);
        setError(null);
        
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Login required');
            
            const token = await user.getIdToken(true);
            
            const orderData = {
                symbol: stockSymbol.toUpperCase(),
                quantity: isBuy ? orderQuantity : -orderQuantity,
                price: 0,
                order_type: 'market'
            };
            
            const response = await fetch(`${API_BASE_URL}${API_PATHS.ORDER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Response format error' }));
                throw new Error(errorData.detail || 'Error occurred during order processing');
            }
            
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error occurred during order processing';
            setError(errorMessage);
            return false;
        } finally {
            setOrderLoading(false);
        }
    };

    return { orderLoading, handleOrder };
} 