import { useState } from 'react';
import { StockData } from '../types/stock';
import { Button } from './common';
import { THEME } from '../constants/colors';

interface TradingPanelProps {
    stockData: StockData | null;
    stockLoading: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: () => void;
    handleOrder: (isBuy: boolean, stockSymbol: string, orderQuantity: number) => void;
    orderLoading: boolean;
    isPriceUpdating: boolean;
}

export default function TradingPanel({
    stockData,
    stockLoading,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleOrder,
    orderLoading,
    isPriceUpdating
}: TradingPanelProps) {
    const [quantity, setQuantity] = useState(1);

    const OrderButton = ({ isBuy, label }: { isBuy: boolean; label: string }) => (
        <Button
            variant={isBuy ? 'buy' : 'sell'}
            onClick={() => handleOrder(isBuy, stockData!.symbol, quantity)}
            loading={orderLoading}
        >
            {label}
        </Button>
    );

    return (
        <div className="w-full">
            <div className="hidden lg:flex items-center gap-4 p-3">
                <div className="join rounded-md overflow-hidden flex-shrink-0" style={{ width: '240px' }}>
                    <input
                        type="text"
                        className={`input join-item w-full ${THEME.background.primary.class} text-gray-100 border-none h-10 px-3 text-sm`}
                        placeholder="Enter stock symbol (e.g. AAPL)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                        className={`btn join-item ${THEME.action.buy.class} px-2 min-h-0 h-10 border-none`}
                        onClick={handleSearch}
                        disabled={stockLoading || !searchQuery.trim()}
                    >
                        {stockLoading ? 
                            <span className="loading loading-spinner loading-sm"></span> : 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                    </button>
                </div>

                {stockData && (
                    <>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div>
                                <h3 className="text-lg font-medium text-gray-200">{stockData.symbol}</h3>
                                <p className="text-gray-400 text-xs truncate max-w-[120px]" title={stockData.name}>
                                    {stockData.name}
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <p className="text-lg font-bold text-gray-100">${stockData.price.toFixed(2)}</p>
                                    {isPriceUpdating && (
                                        <span className="loading loading-spinner text-primary loading-xs"></span>
                                    )}
                                </div>
                                <p className={`text-xs ${stockData.change >= 0 ? THEME.text.buy.class : THEME.text.sell.class}`}>
                                    {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} 
                                    ({stockData.change_percent.toFixed(2)}%)
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-gray-400 text-sm">Qty</span>
                            <div className={`${THEME.background.primary.class} rounded-md w-16`}>
                                <input
                                    type="number"
                                    min="1"
                                    className={`input border-none ${THEME.background.primary.class} text-gray-100 w-full px-2 py-0 rounded-md h-10 text-sm text-center`}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-gray-400 text-sm">Total</span>
                            <div className={`${THEME.background.primary.class} rounded-md p-2 h-10 flex items-center justify-end min-w-[100px]`}>
                                <span className="text-sm font-medium text-gray-100">
                                    ${(stockData.price * quantity).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                            <OrderButton isBuy={true} label="Buy" />
                            <OrderButton isBuy={false} label="Sell" />
                        </div>
                    </>
                )}
            </div>

            <div className="lg:hidden space-y-3 p-3">
                <div className="join rounded-md overflow-hidden w-full">
                    <input
                        type="text"
                        className={`input join-item w-full ${THEME.background.primary.class} text-gray-100 border-none h-10 px-3 text-sm`}
                        placeholder="Enter stock symbol (e.g. AAPL)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                        className={`btn join-item ${THEME.action.buy.class} px-2 min-h-0 h-10 border-none`}
                        onClick={handleSearch}
                        disabled={stockLoading || !searchQuery.trim()}
                    >
                        {stockLoading ? 
                            <span className="loading loading-spinner loading-sm"></span> : 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                    </button>
                </div>

                {stockData && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-medium text-gray-200">{stockData.symbol}</h3>
                                <p className="text-gray-400 text-sm">{stockData.name}</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1">
                                    <p className="text-xl font-bold text-gray-100">${stockData.price.toFixed(2)}</p>
                                    {isPriceUpdating && (
                                        <span className="loading loading-spinner text-primary loading-xs"></span>
                                    )}
                                </div>
                                <p className={`text-sm ${stockData.change >= 0 ? THEME.text.buy.class : THEME.text.sell.class}`}>
                                    {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} 
                                    ({stockData.change_percent.toFixed(2)}%)
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-sm">Qty</span>
                                    <div className={`${THEME.background.primary.class} rounded-md w-16`}>
                                        <input
                                            type="number"
                                            min="1"
                                            className={`input border-none ${THEME.background.primary.class} text-gray-100 w-full px-2 py-0 rounded-md h-10 text-sm text-center`}
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-sm">Total</span>
                                    <div className={`${THEME.background.primary.class} rounded-md p-2 h-10 flex items-center justify-end min-w-[100px]`}>
                                        <span className="text-sm font-medium text-gray-100">
                                            ${(stockData.price * quantity).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 justify-center">
                                <OrderButton isBuy={true} label="Buy" />
                                <OrderButton isBuy={false} label="Sell" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 