from fastapi import APIRouter, Query
from typing import Dict, List, Any
from ..core.exceptions import get_stock_ticker, get_stock_history, handle_stock_api_error

router = APIRouter()

@router.get("/{symbol}")
async def get_chart_data(
    symbol: str,
    timeframe: str = Query(...),
    period: str = Query(...)
) -> Dict[str, Any]:
    try:
        ticker = get_stock_ticker(symbol)
        hist = get_stock_history(ticker, period=period, interval=timeframe)
        
        chart_data: List[Dict[str, Any]] = []
        for index, row in hist.iterrows():
            chart_data.append({
                "time": int(index.timestamp()),
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(row["Volume"])
            })
        
        return {
            "symbol": symbol.upper(),
            "timeframe": timeframe,
            "period": period,
            "data": chart_data
        }
        
    except Exception as e:
        raise handle_stock_api_error(e, symbol, "chart data retrieval") 