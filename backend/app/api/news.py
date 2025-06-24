from fastapi import APIRouter, HTTPException, Query
from GoogleNews import GoogleNews
from ..models.schemas import NewsResponse, NewsItem

router = APIRouter()

@router.get("/search", response_model=NewsResponse)
async def search_news(
    keyword: str = Query(...),
    lang: str = Query("en"),
    limit: int = Query(100, ge=1, le=100)
):
    try:
        googlenews = GoogleNews(lang=lang, period="1d")
        
        googlenews.search(keyword)
        
        all_results = []
        for page in range((limit // 10) + 1):
            if page > 0:
                googlenews.get_page(page + 1)
            page_results = googlenews.result()
            all_results.extend(page_results)
            if len(all_results) >= limit:
                break
        
        results = all_results
        
        news_items = []
        for idx, article in enumerate(results[:limit]):
            news_item = NewsItem(
                title=article.get("title", ""),
                date=article.get("date", ""),
                description=article.get("desc", ""),
                media=article.get("media", ""),
                link=article.get("link", "")
            )
            news_items.append(news_item)
        
        return NewsResponse(
            keyword=keyword,
            results=news_items,
            count=len(news_items)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching keywrod news: {str(e)}"
        )

@router.get("/trending", response_model=NewsResponse)
async def get_trending_news(
    topic: str = Query(...),
    lang: str = Query("en"),
    limit: int = Query(100, ge=1, le=100)
):
    try:
        googlenews = GoogleNews(lang=lang, period="1d") 
        googlenews.get_news(topic)

        all_results = []
        for page in range((limit // 10) + 1):
            if page > 0:
                googlenews.get_page(page + 1)
            page_results = googlenews.result()
            all_results.extend(page_results)
            if len(all_results) >= limit:
                break
        
        results = all_results
        
        news_items = []
        for idx, article in enumerate(results[:limit]):
            news_item = NewsItem(
                title=article.get("title", ""),
                date=article.get("date", ""),
                description=article.get("desc", ""),
                media=article.get("media", ""),
                link=article.get("link", "")
            )
            news_items.append(news_item)
        
        return NewsResponse(
            keyword=f"Trending - {topic}",
            results=news_items,
            count=len(news_items)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching trending news: {str(e)}"
        ) 