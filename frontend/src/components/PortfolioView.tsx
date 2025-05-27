import Portfolio from './Portfolio';
import { DetailedStockInfo, Portfolio as PortfolioType } from '../hooks/usePortfolio';

interface PortfolioViewProps {
    portfolio: PortfolioType | null;
    calculatePrincipal: () => number;
    detailedStocks: DetailedStockInfo[];
    portfolioValue: number;
    totalProfitLoss: number;
    roi: number;
    pricesLoading: boolean;
    handleOrder: (isBuy: boolean, symbol: string, quantity: number) => Promise<boolean | undefined>;
    orderLoading: boolean;
}

export default function PortfolioView({
    portfolio,
    calculatePrincipal,
    detailedStocks,
    portfolioValue,
    totalProfitLoss,
    roi,
    pricesLoading,
    handleOrder,
    orderLoading
}: PortfolioViewProps) {
    return (
        <div className="w-full md:w-1/4 h-full">
            <Portfolio 
                portfolio={portfolio}
                calculatePrincipal={calculatePrincipal}
                detailedStocks={detailedStocks}
                portfolioValue={portfolioValue}
                totalProfitLoss={totalProfitLoss}
                roi={roi}
                pricesLoading={pricesLoading}
                handleOrder={handleOrder}
                orderLoading={orderLoading}
            />
        </div>
    );
} 