from app.db.redis import get_redis
from app.core.exceptions import RateLimitExceededError

DEFAULT_RATE_LIMIT = 10000 


def check_rate_limit(api_key_id: int) -> dict:
    redis = get_redis()
    if not redis:
        return {"limited": False}
    
    rate_limit = DEFAULT_RATE_LIMIT
    cache_key = f"rate:{api_key_id}"
    
    current = redis.get(cache_key)
    
    if current is None:
        redis.setex(cache_key, 60, 1)
        return {
            "limited": False,
            "limit": rate_limit,
            "remaining": rate_limit - 1,
            "reset_in": 60
        }
    
    current = int(current)
    
    if current >= rate_limit:
        ttl = redis.ttl(cache_key)
        raise RateLimitExceededError(
            message=f"Too many requests. Limit: {rate_limit}/minute",
            details={
                "limit": rate_limit,
                "retry_after": ttl
            }
        )
    
    redis.incr(cache_key)
    ttl = redis.ttl(cache_key)
    
    return {
        "limited": False,
        "limit": rate_limit,
        "remaining": rate_limit - current - 1,
        "reset_in": ttl
    }