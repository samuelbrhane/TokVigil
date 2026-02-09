# Tokenfence platform plans for developers

TOKENFENCE_PLANS = {
    "free": {
        "name": "Free",
        "price_monthly": 0,
        "rate_limit_per_minute": 100,
        "workspaces_limit": 1,
        "api_keys_limit": 2,
        "evaluate_calls_per_month": 1000,
        "team_members_limit": 1,
        "features": {
            "webhooks": False,
            "audit_logs": False,
            "priority_support": False,
            "custom_branding": False,
        }
    },
    "starter": {
        "name": "Starter",
        "price_monthly": 29,
        "rate_limit_per_minute": 500,
        "workspaces_limit": 3,
        "api_keys_limit": 10,
        "evaluate_calls_per_month": 50000,
        "team_members_limit": 3,
        "features": {
            "webhooks": True,
            "audit_logs": False,
            "priority_support": False,
            "custom_branding": False,
        }
    },
    "pro": {
        "name": "Pro",
        "price_monthly": 99,
        "rate_limit_per_minute": 2000,
        "workspaces_limit": 10,
        "api_keys_limit": 50,
        "evaluate_calls_per_month": 500000,
        "team_members_limit": 10,
        "features": {
            "webhooks": True,
            "audit_logs": True,
            "priority_support": False,
            "custom_branding": False,
        }
    },
    "enterprise": {
        "name": "Enterprise",
        "price_monthly": 299,
        "rate_limit_per_minute": 10000,
        "workspaces_limit": -1,  # unlimited
        "api_keys_limit": -1,  # unlimited
        "evaluate_calls_per_month": -1,  # unlimited
        "team_members_limit": -1,  # unlimited
        "features": {
            "webhooks": True,
            "audit_logs": True,
            "priority_support": True,
            "custom_branding": True,
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