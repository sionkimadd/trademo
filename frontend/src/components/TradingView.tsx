import CandlestickChart from './CandlestickChart';
import StockSearch from './StockSearch';
import OrderPanel from './OrderPanel';
import EmptyChartPlaceholder from './EmptyChartPlaceholder';
import { StockData } from '../types/stock';

interface TradingViewProps {
    stockData: StockData | null;
    stockLoading: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: () => Promise<void>;
    handleOrder: (isBuy: boolean, symbol: string, quantity: number) => Promise<boolean | undefined>;
    orderLoading: boolean;
    isPriceUpdating: boolean;
}

export default function TradingView({
    stockData,
    stockLoading,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleOrder,
    orderLoading,
    isPriceUpdating
}: TradingViewProps) {
    return (
        <div className="w-full md:w-3/4 h-full flex flex-col overflow-hidden">
            <div className="card bg-[#141824] border-none rounded-xl flex-1 overflow-hidden">
                <div className="card-body p-4 flex flex-col h-full">
                    <div className="bg-[#232939] rounded-lg p-3 flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4">
                        <div className="w-full md:flex-1">
                            <StockSearch 
                                stockData={stockData}
                                stockLoading={stockLoading}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                handleSearch={handleSearch}
                                isPriceUpdating={isPriceUpdating}
                            />
                        </div>
                        
                        {stockData && (
                            <div className="w-full md:flex-initial mt-2 md:mt-0">
                                <OrderPanel 
                                    stockData={stockData}
                                    orderLoading={orderLoading}
                                    handleOrder={(isBuy, symbol, quantity) => 
                                        handleOrder(isBuy, symbol, quantity)
                                    }
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col flex-1 mt-2">
                        {stockData ? (
                            <div className="bg-[#232939] rounded-xl p-3 mb-3 h-[500px]">
                                <CandlestickChart 
                                    symbol={stockData.symbol}
                                />
                            </div>
                        ) : (
                            <EmptyChartPlaceholder />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 