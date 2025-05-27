import { StockData } from '../types/stock';

interface StockSearchProps {
    stockData: StockData | null;
    stockLoading: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: () => void;
    isPriceUpdating: boolean;
}

export default function StockSearch({
    stockData,
    stockLoading,
    searchQuery,
    setSearchQuery,
    handleSearch,
    isPriceUpdating
}: StockSearchProps) {
    return (
        <div className="w-full flex items-center">
            {stockData && (
                <div className="flex items-center">
                    <div className="mr-2">
                        <h3 className="text-2xl font-light text-gray-200">{stockData.symbol}</h3>
                        <p className="text-gray-400 text-sm">{stockData.name}</p>
                    </div>
                    <div className="mr-4">
                        <div className="flex items-center">
                            <p className="text-xl font-bold text-gray-100">${stockData.price.toFixed(2)}</p>
                            {isPriceUpdating && (
                                <span className="loading loading-spinner text-primary loading-xs ml-2"></span>
                            )}
                        </div>
                        <p className={`text-sm ${stockData.change >= 0 ? 'text-[#4db6ac]' : 'text-[#e75f77]'}`}>
                            {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} 
                            ({stockData.change_percent.toFixed(2)}%)
                        </p>
                    </div>
                </div>
            )}
            
            <div className="join rounded-md overflow-hidden ml-auto" style={{ width: stockData ? '180px' : '100%' }}>
                <input
                    type="text"
                    className="input join-item w-full bg-[#141824] text-gray-100 border-none h-10 px-3 text-sm"
                    placeholder="Enter stock symbol (e.g. AAPL)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                    className="btn join-item bg-[#4db6ac] border-none hover:bg-[#3da59b] px-2 min-h-0 h-10"
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
        </div>
    );
} 