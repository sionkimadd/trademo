from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import stocks, charts, portfolio, orders

app = FastAPI(
    title="TradeMo API",
    version="1.0"
)

ALLOWED_ORIGINS = [
    "https://trademo.boutique",
    "http://trademo.boutique",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/", tags=["health"])
def health_check():
    return {
        "status": "healthy",
        "message": "TraDeMo API is running"
    }

app.include_router(stocks.router, prefix="/stock", tags=["stocks"])
app.include_router(charts.router, prefix="/chart", tags=["charts"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
app.include_router(orders.router, prefix="/order", tags=["orders"])