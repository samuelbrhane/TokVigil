# Model pricing per 1K tokens (USD)
MODEL_PRICING = {
    # OpenAI - GPT-4o series
    "gpt-4o": {"input": 0.005, "output": 0.015, "provider": "openai"},
    "gpt-4o-mini": {"input": 0.00015, "output": 0.0006, "provider": "openai"},
    
    # OpenAI - GPT-4 series
    "gpt-4-turbo": {"input": 0.01, "output": 0.03, "provider": "openai"},
    "gpt-4": {"input": 0.03, "output": 0.06, "provider": "openai"},
    
    # OpenAI - GPT-3.5
    "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015, "provider": "openai"},
    
    # Anthropic - Claude 3.5
    "claude-3-5-sonnet": {"input": 0.003, "output": 0.015, "provider": "anthropic"},
    "claude-3-5-haiku": {"input": 0.0008, "output": 0.004, "provider": "anthropic"},
    
    # Anthropic - Claude 3
    "claude-3-opus": {"input": 0.015, "output": 0.075, "provider": "anthropic"},
    "claude-3-sonnet": {"input": 0.003, "output": 0.015, "provider": "anthropic"},
    "claude-3-haiku": {"input": 0.00025, "output": 0.00125, "provider": "anthropic"},
    
    # Google - Gemini
    "gemini-1.5-pro": {"input": 0.0035, "output": 0.0105, "provider": "google"},
    "gemini-1.5-flash": {"input": 0.00035, "output": 0.00105, "provider": "google"},
    "gemini-1.0-pro": {"input": 0.0005, "output": 0.0015, "provider": "google"},
    
    # Mistral
    "mistral-large": {"input": 0.004, "output": 0.012, "provider": "mistral"},
    "mistral-medium": {"input": 0.0027, "output": 0.0081, "provider": "mistral"},
    "mistral-small": {"input": 0.001, "output": 0.003, "provider": "mistral"},
    
    # Meta - Llama (via API providers)
    "llama-3-70b": {"input": 0.00059, "output": 0.00079, "provider": "meta"},
    "llama-3-8b": {"input": 0.00005, "output": 0.00008, "provider": "meta"},
    
    # Cohere
    "command-r-plus": {"input": 0.003, "output": 0.015, "provider": "cohere"},
    "command-r": {"input": 0.0005, "output": 0.0015, "provider": "cohere"},
}

# Default pricing for unknown models
DEFAULT_PRICING = {"input": 0.001, "output": 0.002, "provider": "unknown"}

# List of providers
PROVIDERS = ["openai", "anthropic", "google", "mistral", "meta", "cohere"]


def get_model_pricing(model: str) -> dict:
    """Get pricing for a model, returns default if not found."""
    return MODEL_PRICING.get(model, DEFAULT_PRICING)


def get_models_by_provider(provider: str) -> list:
    """Get all models for a specific provider."""
    return [
        model for model, data in MODEL_PRICING.items() 
        if data["provider"] == provider
    ]


def get_all_models() -> list:
    """Get list of all supported models."""
    return list(MODEL_PRICING.keys())