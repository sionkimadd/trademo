export interface StockInPortfolio {
    symbol: string;
    quantity: number;
    avg_price: number;
}

export interface Portfolio {
    cash: number;
    stocks: Record<string, StockInPortfolio>;
    total_profit_loss?: number;
    roi?: number;
    last_updated?: string;
}

export interface MarketStockData {
    symbol: string;
    name?: string;
    price: number;
    change?: number;
    change_percent?: number;
}

export interface DetailedStockInfo extends StockInPortfolio {
    current_price: number;
    market_value: number;
    profit_loss: number;
    roi: number;
    name?: string;
}

export interface UsePortfolioReturn {
    portfolio: Portfolio | null;
    loading: boolean;
    error: string;
    fetchInitialPortfolio: () => Promise<void>;
    calculatePrincipal: () => number;
    currentStockPrices: Record<string, MarketStockData>;
    pricesLoading: boolean;
    detailedStocks: DetailedStockInfo[];
    portfolioValue: number;
    totalProfitLoss: number;
    roi: number;
} 