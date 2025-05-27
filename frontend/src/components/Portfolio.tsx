import PortfolioSummary from './PortfolioSummary';
import StockItem from './StockItem';
import { DetailedStockInfo, Portfolio as PortfolioDataFromHook } from '../hooks/usePortfolio';

interface PortfolioProps {
    portfolio: PortfolioDataFromHook | null;
    calculatePrincipal: () => number;
    handleOrder: (isBuy: boolean, stockSymbol: string, orderQuantity: number) => void;
    orderLoading: boolean;
    detailedStocks: DetailedStockInfo[];
    portfolioValue: number;
    totalProfitLoss: number;
    roi: number;
    pricesLoading: boolean;
}

export default function Portfolio({ 
    portfolio, 
    calculatePrincipal,
    handleOrder,
    orderLoading,
    detailedStocks,
    portfolioValue,
    totalProfitLoss,
    roi,
    pricesLoading
}: PortfolioProps) {
    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            <PortfolioSummary
                availableCash={portfolio?.cash || 0}
                principal={calculatePrincipal()}
                portfolioValue={portfolioValue}
                totalProfitLoss={totalProfitLoss}
                roi={roi}
                pricesLoading={pricesLoading}
            />

            <div className="flex-1 flex flex-col overflow-hidden bg-[#141824] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-semibold text-gray-200">Holdings</h3>
                    {pricesLoading && <span className="loading loading-spinner loading-xs text-[#4db6ac]"></span>}
                </div>
                
                <div className="overflow-y-auto flex-1">
                    {detailedStocks.length === 0 && !pricesLoading && (
                        <div className="alert bg-[#4db6ac] bg-opacity-10 border-none p-1 text-sm rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-[#4db6ac] shrink-0 w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className="text-gray-200">No stocks in portfolio. Search and buy stocks to get started.</span>
                        </div>
                    )}
                    
                    {detailedStocks.map((stock) => (
                        <StockItem
                            key={stock.symbol}
                            stock={stock}
                            onOrder={handleOrder}
                            orderLoading={orderLoading}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
} 