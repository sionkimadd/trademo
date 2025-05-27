from fastapi import HTTPException
import yfinance as yf
from typing import Optional

class StockDataError(Exception):
    pass

def validate_symbol(symbol: str) -> str:
    if not symbol or len(symbol) > 10:
        raise HTTPException(status_code=400, detail=f"Invalid stock symbol '{symbol}'. Please enter a valid symbol.")
    return symbol.upper()

def get_stock_ticker(symbol: str) -> yf.Ticker:
    validated_symbol = validate_symbol(symbol)
    return yf.Ticker(validated_symbol)

def get_current_market_price(ticker: yf.Ticker) -> float:
    try:
        info = ticker.info
        
        current_price = info.get('regularMarketPrice')
        if current_price and current_price > 0:
            return float(current_price)
        
        current_price = info.get('currentPrice')
        if current_price and current_price > 0:
            return float(current_price)
        
        hist = ticker.history(period="1d", auto_adjust=False)
        if hist.empty or 'Close' not in hist:
            raise StockDataError("Unable to fetch current price")
        
        return float(hist['Close'].iloc[-1])
        
    except Exception as e:
        if isinstance(e, StockDataError):
            raise e
        raise StockDataError(f"Failed to fetch current price: {str(e)}")

def get_stock_history(ticker: yf.Ticker, period: str = "1d", interval: Optional[str] = None) -> any:
    try:
        if interval:
            hist = ticker.history(period=period, interval=interval, auto_adjust=False)
        else:
            hist = ticker.history(period=period, auto_adjust=False)
            
        if hist.empty:
            raise StockDataError("No data found for this symbol")
        return hist
    except Exception as e:
        if isinstance(e, StockDataError):
            raise e
        raise StockDataError(f"Data fetch failed: {str(e)}")

def handle_stock_api_error(e: Exception, symbol: str, operation: str = "operation") -> HTTPException:
    if isinstance(e, HTTPException):
        return e
    elif isinstance(e, StockDataError):
        return HTTPException(status_code=404, detail=f"Stock '{symbol}' not found. Please check the symbol.")
    elif isinstance(e, IndexError):
        return HTTPException(status_code=404, detail=f"No data available for '{symbol}'. Try a different symbol.")
    else:
        return HTTPException(status_code=500, detail=f"An error occurred during stock {operation}. Please try again later.") 