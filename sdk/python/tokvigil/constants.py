# API URLs
DEFAULT_BASE_URL = "https://api.tokvigil.com"
API_VERSION = "v1"

# Endpoints
ENDPOINTS = {
    "evaluate": "/api/v1/evaluate",
    "usage_log": "/api/v1/usage",
    "usage_recent": "/api/v1/usage/recent",
    "usage_blocked": "/api/v1/usage/blocked",
    "usage_summary": "/api/v1/usage/summary",
    "usage_by_user": "/api/v1/usage/by-user",
    "usage_by_feature": "/api/v1/usage/by-feature",
}

# Defaults
DEFAULT_TIMEOUT = 30  # seconds
DEFAULT_RETRY_COUNT = 3
DEFAULT_RETRY_DELAY = 1  # seconds

# SDK Info
SDK_VERSION = "0.1.0"
SDK_NAME = "tokvigil-python"
USER_AGENT = f"{SDK_NAME}/{SDK_VERSION}"