import CandlestickChart from './CandlestickChart';
import TradingPanel from './TradingPanel';
import EmptyChartPlaceholder from './EmptyChartPlaceholder';
import { StockData } from '../types/stock';
import { THEME } from '../constants/colors';

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
            <div className={`card ${THEME.background.primary.class} border-none rounded-xl flex-1`}>
                <div className="card-body p-2 md:p-4 flex flex-col gap-2">
                    <div className={`${THEME.background.secondary.class} rounded-lg`}>
                        <TradingPanel 
                            stockData={stockData}
                            stockLoading={stockLoading}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            handleSearch={handleSearch}
                            handleOrder={handleOrder}
                            orderLoading={orderLoading}
                            isPriceUpdating={isPriceUpdating}
                        />
                    </div>
                    
                    <div className={`${THEME.background.secondary.class} rounded-xl p-2 md:p-3 flex-1 min-h-[300px] md:min-h-[500px]`}>
                        {stockData ? (
                            <CandlestickChart symbol={stockData.symbol} />
                        ) : (
                            <EmptyChartPlaceholder />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 