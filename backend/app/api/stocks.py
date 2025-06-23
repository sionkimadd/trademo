from fastapi import APIRouter
from ..models.schemas import StockData
from ..core.exceptions import get_stock_ticker, get_current_market_price, handle_stock_api_error

router = APIRouter()

@router.get("/{symbol}", response_model=StockData)
async def get_stock_data(symbol: str) -> StockData:
    try:
        ticker = get_stock_ticker(symbol)
        
        current_price = get_current_market_price(ticker)
        
        info = ticker.info
        company_name = info.get('shortName', symbol)
        prev_close = info.get('previousClose', 0.0)
        
        change = 0.0
        change_percent = 0.0
        if prev_close and prev_close > 0:
            change = current_price - prev_close
            change_percent = (change / prev_close) * 100
        
        return StockData(
            symbol=symbol.upper(),
            name=company_name,
            price=round(current_price, 2),
            change=round(change, 2),
            change_percent=round(change_percent, 2)
        )
    
    except Exception as e:
        raise handle_stock_api_error(e, symbol, "data retrieval") 