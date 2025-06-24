import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { API_PATHS, API_BASE_URL } from '../types/api';
import { scheduleMinuteInterval } from '../utils/scheduleUtils';
import {
    Portfolio,
    MarketStockData,
    DetailedStockInfo,
    UsePortfolioReturn
} from '../types/portfolio';

export const usePortfolio = (): UsePortfolioReturn => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentStockPrices, setCurrentStockPrices] = useState<Record<string, MarketStockData>>({});
    const [pricesLoading, setPricesLoading] = useState(false);
    const isFetchingPricesRef = useRef(false);
    const previousPortfolioRef = useRef<Portfolio | null>(null);
    const cleanupRef = useRef<(() => void) | null>(null);

    const fetchInitialPortfolio = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const token = await user.getIdToken(true);
            const response = await fetch(`${API_BASE_URL}${API_PATHS.PORTFOLIO}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to load portfolio data');
            const data = await response.json();
            setPortfolio(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch initial portfolio data';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchCurrentStockPrices = useCallback(async () => {
        const currentPortfolio = portfolio;
        if (!currentPortfolio || !user || Object.keys(currentPortfolio.stocks).length === 0 || isFetchingPricesRef.current) {
            return;
        }
        isFetchingPricesRef.current = true;
        setPricesLoading(true);
        const token = await user.getIdToken(true);
        const newPricesData: Record<string, MarketStockData> = {};
        
        try {
            await Promise.all(
                Object.keys(currentPortfolio.stocks).map(async (symbol) => {
                    try {
                        const response = await fetch(`${API_BASE_URL}${API_PATHS.STOCK}/${symbol}`, {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
                        });
                        if (response.ok) {
                            newPricesData[symbol] = await response.json();
                        } else if (currentStockPrices[symbol]) {
                            newPricesData[symbol] = currentStockPrices[symbol];
                        }
                    } catch (e) {
                        if (currentStockPrices[symbol]) {
                            newPricesData[symbol] = currentStockPrices[symbol];
                        }
                    }
                })
            );
            setCurrentStockPrices(prevPrices => ({...prevPrices, ...newPricesData}));
        } catch (err) {
        } finally {
            setPricesLoading(false);
            isFetchingPricesRef.current = false;
        }
    }, [user, portfolio, currentStockPrices]);

    const fetchCurrentStockPricesRef = useRef(fetchCurrentStockPrices);
    useEffect(() => {
        fetchCurrentStockPricesRef.current = fetchCurrentStockPrices;
    }, [fetchCurrentStockPrices]);

    useEffect(() => {
        if (!user) {
            setPortfolio(null);
            setCurrentStockPrices({});
            setLoading(false);
            return;
        }
        setLoading(true);

        const unsubscribe = onSnapshot(
            doc(db, 'users', user.uid, 'portfolio', 'main'),
            (docSnap) => {
                const previousPortfolio = previousPortfolioRef.current;
                if (docSnap.exists()) {
                    const newPortfolioData = docSnap.data() as Portfolio;
                    setPortfolio(newPortfolioData);
                    previousPortfolioRef.current = newPortfolioData;

                    const oldSymbols = previousPortfolio?.stocks ? Object.keys(previousPortfolio.stocks).sort().join(',') : '';
                    const newSymbols = newPortfolioData.stocks ? Object.keys(newPortfolioData.stocks).sort().join(',') : '';

                    if (newSymbols && (newSymbols !== oldSymbols || !previousPortfolio)) {
                        fetchCurrentStockPricesRef.current();
                    }
                } else {
                    fetchInitialPortfolio();
                    setPortfolio(null);
                    previousPortfolioRef.current = null;
                }
                setLoading(false);
            },
            (err) => {
                const errorMessage = err instanceof Error ? err.message : 'Portfolio query failed';
                setError(errorMessage);
                setLoading(false);
            }
        );
        return () => {
            unsubscribe();
        };
    }, [user, fetchInitialPortfolio]);

    const stockKeysString = useMemo(() => {
        return portfolio?.stocks ? Object.keys(portfolio.stocks).sort().join(',') : '';
    }, [portfolio]);

    useEffect(() => {
        if (!stockKeysString) {
            return;
        }

        if (cleanupRef.current) {
            cleanupRef.current();
        }

        cleanupRef.current = scheduleMinuteInterval(() => {
            fetchCurrentStockPricesRef.current();
        });

        return () => {
            if (cleanupRef.current) {
                cleanupRef.current();
                cleanupRef.current = null;
            }
        };
    }, [stockKeysString]);

    const calculatePrincipal = useCallback(() => {
        if (!portfolio) return 0;
        return Object.values(portfolio.stocks || {}).reduce(
            (total, stock) => total + stock.quantity * stock.avg_price,
            0
        );
    }, [portfolio]);

    const calculateTotalAccountBalance = useCallback(() => {
        if (!portfolio) return 0;
        const stocksInvestedValue = Object.values(portfolio.stocks || {}).reduce(
            (total, stock) => total + stock.quantity * stock.avg_price,
            0
        );
        return portfolio.cash + stocksInvestedValue;
    }, [portfolio]);

    const detailedStocks: DetailedStockInfo[] = useMemo(() => {
        if (!portfolio?.stocks) return [];
        return Object.entries(portfolio.stocks).map(([mapSymbol, stockEntry]) => {
            const currentPriceData = currentStockPrices[mapSymbol];
            const current_price = currentPriceData?.price || stockEntry.avg_price;
            const market_value = stockEntry.quantity * current_price;
            const total_avg_cost = stockEntry.quantity * stockEntry.avg_price;
            const profit_loss = market_value - total_avg_cost;
            const roi = total_avg_cost === 0 ? 0 : (profit_loss / total_avg_cost) * 100;

            return {
                ...stockEntry,
                symbol: mapSymbol,
                name: currentPriceData?.name,
                current_price,
                market_value,
                profit_loss,
                roi,
            };
        }).sort((a, b) => (b.quantity * b.avg_price) - (a.quantity * a.avg_price));
    }, [portfolio, currentStockPrices]);

    const portfolioMarketStats = useMemo(() => {
        if (!portfolio) return { portfolioValue: 0, totalProfitLoss: 0, roi: 0 };

        const portfolioValue = (portfolio.cash || 0) + detailedStocks.reduce((sum, stock) => sum + stock.market_value, 0);
        const principalInvested = calculatePrincipal();
        const totalAccountBalance = calculateTotalAccountBalance();
        const totalProfitLoss = portfolioValue - totalAccountBalance;
        
        const stockCurrentValue = detailedStocks.reduce((sum, stock) => sum + stock.market_value, 0);
        const stockInvestmentGain = stockCurrentValue - principalInvested;
        const roi = principalInvested === 0 ? 0 : (stockInvestmentGain / principalInvested) * 100;
        
        return {
            portfolioValue,
            totalProfitLoss,
            roi
        };
    }, [portfolio, detailedStocks, calculatePrincipal, calculateTotalAccountBalance]);

    useEffect(() => {
        if (
            auth.currentUser &&
            portfolio &&
            (
                Math.abs(portfolioMarketStats.totalProfitLoss - (portfolio.total_profit_loss || 0)) > 0.01 ||
                Math.abs(portfolioMarketStats.roi - (portfolio.roi || 0)) > 0.01
            )
        ) {
            const portfolioRef = doc(db, "users", auth.currentUser.uid, "portfolio", "main");
            updateDoc(portfolioRef, {
                total_profit_loss: portfolioMarketStats.totalProfitLoss,
                roi: portfolioMarketStats.roi,
                last_updated: new Date().toISOString()
            }).catch(() => {
                console.error("Error updating P&L in Firebase");
            });
        }
    }, [portfolioMarketStats.totalProfitLoss, portfolioMarketStats.roi, auth.currentUser, portfolio]);

    return { 
        portfolio, 
        loading, 
        error, 
        fetchInitialPortfolio,
        calculatePrincipal, 
        currentStockPrices,
        pricesLoading,
        detailedStocks,
        portfolioValue: portfolioMarketStats.portfolioValue,
        totalProfitLoss: portfolioMarketStats.totalProfitLoss,
        roi: portfolioMarketStats.roi,
    };
}; 