import TradingView from '../components/TradingView';
import PortfolioView from '../components/PortfolioView';
import { usePortfolio } from '../hooks/usePortfolio';
import { useStockSearch } from '../hooks/useStockSearch';
import { useStockPrice } from '../hooks/useStockPrice';
import { useOrder } from '../hooks/useOrder';

export default function Home() {
    const { 
        portfolio, 
        loading, 
        error, 
        calculatePrincipal,
        detailedStocks, 
        portfolioValue,
        totalProfitLoss,
        roi,
        pricesLoading 
    } = usePortfolio();
    
    const { 
        searchQuery, 
        setSearchQuery, 
        stockLoading, 
        stockData, 
        setStockData, 
        handleSearch 
    } = useStockSearch();
    
    const { orderLoading, handleOrder } = useOrder();
    
    const { isPriceUpdating } = useStockPrice(stockData, setStockData);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-[#141824]">
                <span className="loading loading-spinner loading-lg text-[#4db6ac]"></span>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-[#0f1018] text-gray-200">
            {error ? (
                <div className="alert alert-error bg-[#e75f77] bg-opacity-20 border-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row h-full px-4 pb-4 gap-3">
                    <TradingView
                        stockData={stockData}
                        stockLoading={stockLoading}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleSearch={handleSearch}
                        handleOrder={(isBuy, symbol, quantity) => 
                            handleOrder(isBuy, symbol, quantity)
                        }
                        orderLoading={orderLoading}
                        isPriceUpdating={isPriceUpdating}
                    />
                    
                    <PortfolioView
                            portfolio={portfolio}
                        calculatePrincipal={calculatePrincipal}
                            detailedStocks={detailedStocks}
                        portfolioValue={portfolioValue}
                            totalProfitLoss={totalProfitLoss}
                        roi={roi}
                            pricesLoading={pricesLoading}
                            handleOrder={(isBuy, symbol, quantity) => 
                                handleOrder(isBuy, symbol, quantity)
                            }
                            orderLoading={orderLoading}
                        />
                </div>
            )}
        </div>
    );
}