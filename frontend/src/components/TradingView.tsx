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
        <div className="w-full md:w-3/4 h-full flex flex-col">
            <div className="card bg-[#141824] border-none rounded-xl flex-1">
                <div className="card-body p-2 md:p-4 flex flex-col gap-2">
                    <div className="bg-[#232939] rounded-lg p-2 md:p-3 flex flex-col gap-2">
                        <div className="w-full">
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
                            <div className="w-full">
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
                    
                    <div className="bg-[#232939] rounded-xl p-2 md:p-3 flex-1 min-h-[300px] md:min-h-[500px]">
                        {stockData ? (
                            <CandlestickChart 
                                symbol={stockData.symbol}
                            />
                        ) : (
                            <EmptyChartPlaceholder />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 