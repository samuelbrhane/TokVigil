from fastapi import HTTPException, status
from app.db.redis import get_redis
from app.core.plans import get_rate_limit


def check_rate_limit(api_key_id: int, user_plan: str) -> dict:
    """
    Check if request is within rate limit.
    Returns rate limit info or raises HTTPException if exceeded.
    """
    redis = get_redis()
    if not redis:
        # Redis not available, skip rate limiting
        return {"limited": False}
    
    rate_limit = get_rate_limit(user_plan)
    cache_key = f"rate:{api_key_id}"
    
    # Get current count
    current = redis.get(cache_key)
    
    if current is None:
        # First request this minute
        redis.setex(cache_key, 60, 1)
        return {
            "limited": False,
            "limit": rate_limit,
            "remaining": rate_limit - 1,
            "reset_in": 60
        }
    
    current = int(current)
    
    if current >= rate_limit:
        # Rate limit exceeded
        ttl = redis.ttl(cache_key)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "RATE_LIMIT_EXCEEDED",
                "message": f"Too many requests. Limit: {rate_limit}/minute",
                "limit": rate_limit,
                "retry_after": ttl
            }
        )
    
    # Increment counter
    redis.incr(cache_key)
    ttl = redis.ttl(cache_key)
    
    return {
        "limited": False,
        "limit": rate_limit,
        "remaining": rate_limit - current - 1,
        "reset_in": ttl
    }