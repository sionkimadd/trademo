from fastapi import HTTPException
from ..models.schemas import Order, Portfolio
from ..db.firebase import db
from datetime import datetime

class PortfolioService:
    @staticmethod
    def validate_order(portfolio: Portfolio, order: Order, current_price: float):
        if order.quantity > 0:
            required_cash = order.quantity * current_price
            if portfolio.cash < required_cash:
                raise HTTPException(status_code=400, detail="Insufficient balance")
        elif order.quantity < 0:
            sell_quantity = abs(order.quantity)
            stock_info = portfolio.stocks.get(order.symbol)
            if not stock_info or stock_info.get('quantity', 0) < sell_quantity:
                raise HTTPException(status_code=400, detail="Insufficient stock holdings")
        else:
            raise HTTPException(status_code=400, detail="Order quantity cannot be zero.")

    @staticmethod
    def process_buy_order(portfolio: Portfolio, order: Order, current_price: float):
        buy_value = order.quantity * current_price
        portfolio.cash -= buy_value
        
        if order.symbol in portfolio.stocks:
            existing_stock = portfolio.stocks[order.symbol]
            existing_quantity = existing_stock['quantity']
            existing_avg_price = existing_stock['avg_price']
            
            new_quantity = existing_quantity + order.quantity
            new_avg_price = ((existing_quantity * existing_avg_price) + buy_value) / new_quantity
            
            portfolio.stocks[order.symbol] = {
                'quantity': new_quantity,
                'avg_price': new_avg_price
            }
        else:
            portfolio.stocks[order.symbol] = {
                'quantity': order.quantity,
                'avg_price': current_price
            }

    @staticmethod
    def process_sell_order(portfolio: Portfolio, order: Order, current_price: float):
        sell_quantity = abs(order.quantity)
        sell_value = sell_quantity * current_price
        portfolio.cash += sell_value
        
        stock_info = portfolio.stocks[order.symbol]
        new_quantity = stock_info['quantity'] - sell_quantity
        
        if new_quantity == 0:
            del portfolio.stocks[order.symbol]
        else:
            portfolio.stocks[order.symbol]['quantity'] = new_quantity

    @staticmethod
    def create_transaction_log(user_id: str, order: Order, current_price: float):
        transaction_data = {
            'symbol': order.symbol,
            'quantity': order.quantity,
            'price': current_price,
            'type': 'buy' if order.quantity > 0 else 'sell',
            'timestamp': datetime.now().isoformat(),
            'order_type': order.order_type
        }
        
        db.collection("users").document(user_id).collection("transactions").add(transaction_data)

    @staticmethod
    def execute_order_transaction(user_id: str, order: Order, current_price: float) -> dict:
        portfolio_ref = db.collection("users").document(user_id).collection("portfolio").document("main")
        portfolio_doc = portfolio_ref.get()
        
        if not portfolio_doc.exists:
            portfolio_data = Portfolio().model_dump()
            portfolio_ref.set(portfolio_data)
        else:
            portfolio_data = portfolio_doc.to_dict()
        
        portfolio = Portfolio(**portfolio_data)
        
        PortfolioService.validate_order(portfolio, order, current_price)
        
        if order.quantity > 0:
            PortfolioService.process_buy_order(portfolio, order, current_price)
        else:
            PortfolioService.process_sell_order(portfolio, order, current_price)
        
        updated_portfolio_data = portfolio.model_dump()
        portfolio_ref.set(updated_portfolio_data)
        
        PortfolioService.create_transaction_log(user_id, order, current_price)
        
        return updated_portfolio_data 