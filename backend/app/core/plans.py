# UsageSentinel platform plans for developers
TOKENFENCE_PLANS = {
    "free": {
        "name": "Free",
        "price_monthly": 0,
        "rate_limit_per_minute": 100,
        "workspaces_limit": 1,
        "api_keys_limit": 2,
        "evaluate_calls_per_month": 1000,
        "features": {
            "audit_logs": False,
            "priority_support": False,
        }
    },
    "pro": {
        "name": "Pro",
        "price_monthly": 9,
        "rate_limit_per_minute": 500,
        "workspaces_limit": 3,
        "api_keys_limit": 10,
        "evaluate_calls_per_month": 50000,
        "features": {
            "audit_logs": True,
            "priority_support": False,
        }
    },
    "premium": {
        "name": "Premium",
        "price_monthly": 29,
        "rate_limit_per_minute": 2000,
        "workspaces_limit": 10,
        "api_keys_limit": 50,
        "evaluate_calls_per_month": 500000,
        "features": {
            "audit_logs": True,
            "priority_support": True,
        }
    },
    "enterprise": {
        "name": "Enterprise",
        "price_monthly": 99,
        "rate_limit_per_minute": 10000,
        "workspaces_limit": -1,
        "api_keys_limit": -1,
        "evaluate_calls_per_month": -1,
        "features": {
            "audit_logs": True,
            "priority_support": True,
        }
    }
}

def get_plan(plan_name: str) -> dict:
    """Get plan details by name."""
    return TOKENFENCE_PLANS.get(plan_name, TOKENFENCE_PLANS["free"])


def get_rate_limit(plan_name: str) -> int:
    """Get rate limit per minute for a plan."""
    plan = get_plan(plan_name)
    return plan["rate_limit_per_minute"]


def get_all_plans() -> dict:
    """Get all available plans."""
    return TOKENFENCE_PLANS


def is_feature_enabled(plan_name: str, feature: str) -> bool:
    """Check if a feature is enabled for a plan."""
    plan = get_plan(plan_name)
    return plan["features"].get(feature, False)