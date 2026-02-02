"""
Redis connection for caching and rate limiting.
"""

import redis.asyncio as redis
from typing import Optional

from app.core.config import settings

# Redis connection pool
_redis_pool: Optional[redis.Redis] = None


async def get_redis() -> redis.Redis:
    """
    Get Redis connection.
    """
    global _redis_pool
    
    if _redis_pool is None:
        _redis_pool = redis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
        )
    
    return _redis_pool


async def close_redis():
    """Close Redis connection on shutdown."""
    global _redis_pool
    
    if _redis_pool is not None:
        await _redis_pool.close()
        _redis_pool = None
