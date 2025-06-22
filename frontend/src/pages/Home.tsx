import TradingView from '../components/TradingView';
import Portfolio from '../components/Portfolio';
import { LoadingSpinner, ErrorAlert } from '../components/common';
import { usePortfolio } from '../hooks/usePortfolio';
import { useStockSearch } from '../hooks/useStockSearch';
import { useStockPrice } from '../hooks/useStockPrice';
import { useOrder } from '../hooks/useOrder';
import { THEME } from '../constants/colors';

export default function Home() {
    const portfolioData = usePortfolio();
    const { loading, error } = portfolioData;
    const stockSearchData = useStockSearch();
    const { stockData, setStockData } = stockSearchData;
    const { orderLoading, handleOrder } = useOrder();
    const { isPriceUpdating } = useStockPrice(stockData, setStockData);
    
    if (loading) {
        return <LoadingSpinner />;
    }
    if (error) {
        return <ErrorAlert message={error} fullScreen />;
    }

    return (
        <div className={`h-full flex flex-col ${THEME.background.dark.class} text-gray-200`}>
            <div className="flex flex-col md:flex-row h-full px-4 pb-4 gap-3">
                <TradingView
                    stockData={stockSearchData.stockData}
                    stockLoading={stockSearchData.stockLoading}
                    searchQuery={stockSearchData.searchQuery}
                    setSearchQuery={stockSearchData.setSearchQuery}
                    handleSearch={stockSearchData.handleSearch}
                    handleOrder={handleOrder}
                    orderLoading={orderLoading}
                    isPriceUpdating={isPriceUpdating}
                />
                
                <div className="w-full md:w-1/4 h-full">
                    <Portfolio
                        portfolio={portfolioData.portfolio}
                        calculatePrincipal={portfolioData.calculatePrincipal}
                        detailedStocks={portfolioData.detailedStocks}
                        portfolioValue={portfolioData.portfolioValue}
                        totalProfitLoss={portfolioData.totalProfitLoss}
                        roi={portfolioData.roi}
                        pricesLoading={portfolioData.pricesLoading}
                        handleOrder={handleOrder}
                        orderLoading={orderLoading}
                    />
                </div>
            </div>
        </div>
    );
}