from fastapi import APIRouter, Depends, HTTPException
from ..core.auth import verify_token
from ..models.schemas import Portfolio
from ..db.firebase import db

router = APIRouter()

@router.get("")
async def get_portfolio(user_data: dict = Depends(verify_token)):
    if not db:
        raise HTTPException(status_code=500, detail="Firebase connection unavailable")
    
    user_id = user_data["uid"]
    
    try:
        portfolio_ref = db.collection("users").document(user_id).collection("portfolio").document("main")
        portfolio_doc = portfolio_ref.get()
        
        if not portfolio_doc.exists:
            new_portfolio = Portfolio().model_dump()
            portfolio_ref.set(new_portfolio)
            return new_portfolio
        
        return portfolio_doc.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Portfolio query error: {str(e)}") 