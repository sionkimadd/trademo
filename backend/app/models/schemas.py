from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime

class StockData(BaseModel):
    symbol: str
    name: str
    price: float = Field(..., ge=0)
    change: float
    change_percent: float

class Portfolio(BaseModel):
    cash: float = Field(default=100000.0, ge=0)
    stocks: Dict[str, Dict[str, Any]] = Field(default_factory=dict)
    total_profit_loss: float = Field(default=0.0)
    roi: float = Field(default=0.0)
    last_updated: str = Field(default_factory=lambda: datetime.now().isoformat())

class Order(BaseModel):
    symbol: str
    quantity: int = Field(..., ne=0)
    price: float = Field(0.0, ge=0)
    order_type: str = Field("market", pattern="^(market|limit)$")

class NewsItem(BaseModel):
    title: str
    date: str
    description: Optional[str] = None
    media: str
    link: str

class NewsResponse(BaseModel):
    keyword: str
    results: List[NewsItem]
    count: int