from fastapi import APIRouter, Depends, HTTPException
from ..core.auth import verify_token
from ..core.portfolio_service import PortfolioService
from ..core.exceptions import get_stock_ticker, get_current_market_price, handle_stock_api_error
from ..models.schemas import Order
from ..db.firebase import db

router = APIRouter()

@router.post("")
async def place_order(order: Order, user_data: dict = Depends(verify_token)):
    if not db:
        raise HTTPException(status_code=500, detail="Firebase connection unavailable")
    
    user_id = user_data["uid"]

    try:
        ticker = get_stock_ticker(order.symbol)
        current_market_price = get_current_market_price(ticker)
        
        updated_portfolio = PortfolioService.execute_order_transaction(user_id, order, current_market_price)
        
        return {"status": "success", "portfolio": updated_portfolio}
    
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise handle_stock_api_error(e, order.symbol, "order processing") 