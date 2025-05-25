import { ReactNode } from 'react';
import { formatCurrency, getReturnRateColor, formatPercent } from '../utils/formatters';

interface SummaryItemProps {
    label: string;
    value: string | number | ReactNode;
    colorClass?: string;
}

function SummaryItem({ label, value, colorClass = "text-gray-200" }: SummaryItemProps) {
    return (
        <div>
            <div className="text-xs text-gray-500">{label}</div>
            <div className={`text-sm font-medium ${colorClass}`}>{value}</div>
        </div>
    );
}

interface PortfolioSummaryProps {
    availableCash: number;
    principal: number;
    portfolioValue: number;
    totalProfitLoss: number;
    roi: number;
    pricesLoading: boolean;
}

export default function PortfolioSummary({
    availableCash,
    principal,
    portfolioValue,
    totalProfitLoss,
    roi,
    pricesLoading
}: PortfolioSummaryProps) {
    return (
        <div className="bg-[#141824] rounded-xl p-4 mb-3">
            <div className="w-full text-sm p-3 bg-[#232939] rounded-lg">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <SummaryItem 
                        label="Available cash"
                        value={`$${formatCurrency(availableCash)}`}
                    />
                    <SummaryItem 
                        label="Principal"
                        value={`$${formatCurrency(principal)}`}
                        colorClass="text-gray-200"
                    />
                    <SummaryItem 
                        label="Portfolio value"
                        value={`$${formatCurrency(portfolioValue)}`}
                    />
                    <SummaryItem 
                        label="P&L"
                        value={`$${formatCurrency(totalProfitLoss)}`}
                        colorClass={getReturnRateColor(totalProfitLoss)}
                    />
                    <div className="col-span-2">
                        <div className="text-xs text-gray-500">ROI</div>
                        <div className={`text-lg font-bold ${getReturnRateColor(roi)}`}>
                            {formatPercent(roi)}
                            {pricesLoading && <span className="loading loading-dots loading-xs ml-2"></span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 