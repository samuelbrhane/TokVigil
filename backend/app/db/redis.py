import json
from typing import Optional, Any
from redis import Redis
from app.core.config import settings

redis_client: Optional[Redis] = None


def get_redis() -> Optional[Redis]:
    global redis_client
    if redis_client is None:
        try:
            redis_client = Redis.from_url(settings.redis_url, decode_responses=True)
            redis_client.ping()
        except Exception as e:
            print(f"Redis connection failed: {e}")
            return None
    return redis_client


def cache_get(key: str) -> Optional[Any]:
    """Get value from cache."""
    client = get_redis()
    if not client:
        return None
    try:
        value = client.get(key)
        if value:
            return json.loads(value)
        return None
    except Exception:
        return None


def cache_set(key: str, value: Any, ttl: int = 60) -> bool:
    """Set value in cache with TTL (seconds)."""
    client = get_redis()
    if not client:
        return False
    try:
        client.setex(key, ttl, json.dumps(value))
        return True
    except Exception:
        return False


def cache_delete(key: str) -> bool:
    """Delete key from cache."""
    client = get_redis()
    if not client:
        return False
    try:
        client.delete(key)
        return True
    except Exception:
        return False


def cache_delete_pattern(pattern: str) -> bool:
    """Delete all keys matching pattern."""
    client = get_redis()
    if not client:
        return False
    try:
        keys = client.keys(pattern)
        if keys:
            client.delete(*keys)
        return True
    except Exception:
        return False
    
    
def close_redis():
    """Close Redis connection."""
    global redis_client
    if redis_client:
        try:
            redis_client.close()
            redis_client = None
        except Exception:
            pass