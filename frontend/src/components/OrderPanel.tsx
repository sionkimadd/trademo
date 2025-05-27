import { useState } from 'react';
import { StockData } from '../types/stock';

interface OrderPanelProps {
    stockData: StockData | null;
    orderLoading: boolean;
    handleOrder: (isBuy: boolean, stockSymbol: string, orderQuantity: number) => void;
}

export default function OrderPanel({ stockData, orderLoading, handleOrder }: OrderPanelProps) {
    const [quantity, setQuantity] = useState(1);

    if (!stockData) return null;

    const OrderButton = ({ isBuy, label }: { isBuy: boolean; label: string }) => (
        <button 
            className={`btn btn-sm border-none text-white rounded-md h-[36px] min-h-0 px-3 ${
                isBuy ? 'bg-[#4db6ac] hover:bg-[#3da59b]' : 'bg-[#e75f77] hover:bg-[#d94c65]'
            }`}
            onClick={() => handleOrder(isBuy, stockData.symbol, quantity)}
            disabled={orderLoading}
        >
            {orderLoading ? <span className="loading loading-spinner loading-xs"></span> : label}
        </button>
    );

    return (
        <div className="flex items-center">
            <div className="flex items-center mr-3">
                <p className="text-gray-400 text-xs mr-2">Qty</p>
                <div className="bg-[#141824] rounded-md w-14">
                    <input
                        type="number"
                        min="1"
                        className="input border-none bg-[#141824] text-gray-100 w-full px-2 py-0 rounded-md h-[36px] text-sm"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                </div>
            </div>
            
            <div className="flex items-center mr-3">
                <p className="text-gray-400 text-xs mr-2">Total</p>
                <div className="bg-[#141824] rounded-md p-2 h-[36px] flex items-center justify-end min-w-[80px]">
                    <span className="text-sm font-medium text-gray-100">${(stockData.price * quantity).toLocaleString()}</span>
                </div>
            </div>
            
            <div className="flex items-center space-x-2">
                <OrderButton isBuy={true} label="Buy" />
                <OrderButton isBuy={false} label="Sell" />
            </div>
        </div>
    );
} 