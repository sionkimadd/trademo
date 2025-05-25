from fastapi import APIRouter
from ..core.exceptions import get_stock_ticker, get_stock_history, handle_stock_api_error

router = APIRouter()

@router.get("/{symbol}")
async def get_chart_data(symbol: str, timeframe: str, period: str):
    try:
        ticker = get_stock_ticker(symbol)
        hist = get_stock_history(ticker, period=period, interval=timeframe)
        
        chart_data = [
            {
                "time": int(index.timestamp()),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": float(row["Volume"])
            }
            for index, row in hist.iterrows()
        ]
        
        return {
            "symbol": symbol.upper(),
            "timeframe": timeframe,
            "period": period,
            "data": chart_data
        }
        
    except Exception as e:
        raise handle_stock_api_error(e, symbol, "chart data retrieval") 