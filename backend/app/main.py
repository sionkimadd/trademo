from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import stocks, charts, portfolio, orders

app = FastAPI(title="TradeMo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://trademo.boutique", "http://trademo.boutique", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/")
def read_root():
    return {"message": "TradeMo API is running"}

app.include_router(stocks.router, prefix="/stock", tags=["stocks"])
app.include_router(charts.router, prefix="/chart", tags=["charts"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
app.include_router(orders.router, prefix="/order", tags=["orders"])