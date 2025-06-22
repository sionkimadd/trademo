from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from ..core.auth import verify_token
from ..core.portfolio_service import PortfolioService
from ..core.exceptions import get_stock_ticker, get_current_market_price, handle_stock_api_error
from ..models.schemas import Order
from ..db.firebase import db

router = APIRouter()

@router.post("")
async def place_order(
    order: Order, 
    user_data: Dict[str, Any] = Depends(verify_token)
) -> Dict[str, Any]:
    if not db:
        raise HTTPException(
            status_code=500, 
            detail="Firebase connection unavailable"
        )
    
    if order.quantity == 0:
        raise HTTPException(
            status_code=400,
            detail="Order quantity cannot be zero"
        )
    
    user_id = user_data["uid"]

    try:
        ticker = get_stock_ticker(order.symbol)
        current_market_price = get_current_market_price(ticker)
        
        updated_portfolio = PortfolioService.execute_order_transaction(
            user_id, 
            order, 
            current_market_price
        )
        
        order_action = "buy" if order.quantity > 0 else "sell"
        
        return {
            "status": "success",
            "message": f"Order processed for {order.symbol}",
            "order": {
                "symbol": order.symbol,
                "quantity": abs(order.quantity),
                "price": current_market_price,
                "type": order.order_type,
                "action": order_action
            },
            "portfolio": updated_portfolio
        }
    
    except HTTPException as http_exc:
        raise http_exc
        
    except Exception as e:
        raise handle_stock_api_error(e, order.symbol, "order processing") 