export default function EmptyChartPlaceholder() {
    return (
        <div className="bg-[#232939] rounded-xl p-3 mb-3 h-[500px] flex items-center justify-center">
            <div className="text-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <p className="mb-1 text-gray-400">Search for a stock symbol to view information.</p>
                <p className="text-xs text-gray-500">Examples: AAPL (Apple), MSFT (Microsoft), TSLA (Tesla)</p>
            </div>
        </div>
    );
} 