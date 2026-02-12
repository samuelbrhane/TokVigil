# UsageSentinel Python SDK

Official Python SDK for [UsageSentinel](https://tokenfence.io) - AI usage control platform.

Manage rate limits, budgets, and policies for your AI-powered applications.

## Installation

```bash
pip install tokenfence
```

## Quick Start

```python
from tokenfence import UsageSentinel

# Initialize client
tf = UsageSentinel(api_key="tf_live_xxx")

# Check if request is allowed
result = tf.evaluate(
    user_id="user_123",
    plan="free",
    feature="chat",
    model="gpt-4o-mini",
    input_tokens=100
)

if result.allowed:
    # Make your AI call
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Hello!"}]
    )

    # Log the usage
    tf.log_usage(
        request_id="req_123",
        user_id="user_123",
        model="gpt-4o-mini",
        input_tokens=response.usage.prompt_tokens,
        output_tokens=response.usage.completion_tokens,
        status="allowed"
    )
else:
    print(f"Blocked: {result.message}")
    # result.reason_code: "DAILY_REQUEST_LIMIT_EXCEEDED"
    # result.limit_state.requests_today: 50
    # result.limit_state.requests_limit_daily: 50
```

## Features

- ✅ Check requests against policies
- ✅ Log AI usage (tokens, cost, latency)
- ✅ Get usage analytics
- ✅ Automatic retry with backoff
- ✅ Type hints and dataclasses

## Usage

### Evaluate Request

```python
result = tf.evaluate(
    user_id="user_123",
    model="gpt-4o-mini",
    plan="free",           # optional
    feature="chat",        # optional
    input_tokens=100,      # optional
    input_text="Hello",    # optional (estimates tokens)
)

print(result.allowed)           # True or False
print(result.reason_code)       # "ALLOWED" or "DAILY_REQUEST_LIMIT_EXCEEDED"
print(result.message)           # Human readable message
print(result.estimated_cost_usd)  # 0.0001
print(result.limit_state.requests_today)  # 45
print(result.limit_state.requests_limit_daily)  # 50
```

### Log Usage

```python
tf.log_usage(
    request_id="req_123",
    user_id="user_123",
    model="gpt-4o-mini",
    input_tokens=100,
    output_tokens=50,
    status="allowed",
    plan="free",
    feature="chat",
    latency_ms=350,
)
```

### Check and Call (Helper)

Automatically evaluate, call AI, and log usage:

```python
def call_openai():
    return openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Hello"}]
    )

result, response = tf.check_and_call(
    user_id="user_123",
    model="gpt-4o-mini",
    ai_function=call_openai,
    plan="free",
    feature="chat"
)

if result.allowed:
    print(response.choices[0].message.content)
else:
    print(f"Blocked: {result.message}")
```

### Get Usage Analytics

```python
# Summary
summary = tf.get_usage_summary()
print(summary.total_requests)
print(summary.total_tokens)
print(summary.total_cost_usd)

# Recent usage
recent = tf.get_recent_usage(page=1, page_size=20)
for record in recent.items:
    print(f"{record.user_id}: {record.total_tokens} tokens")

# Usage by user
by_user = tf.get_usage_by_user()
for group in by_user.items:
    print(f"{group.group}: {group.requests} requests, ${group.cost_usd}")

# Usage by feature
by_feature = tf.get_usage_by_feature()
for group in by_feature.items:
    print(f"{group.group}: {group.requests} requests")
```

## Error Handling

```python
from tokenfence import UsageSentinel, RateLimitError, AuthenticationError

tf = UsageSentinel(api_key="tf_live_xxx")

try:
    result = tf.evaluate(user_id="user_123", model="gpt-4o-mini")
except AuthenticationError as e:
    print(f"Invalid API key: {e.message}")
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after} seconds")
except UsageSentinelError as e:
    print(f"Error: {e.message}")
```

## Configuration

```python
tf = UsageSentinel(
    api_key="tf_live_xxx",
    base_url="https://api.tokenfence.io",  # Custom API URL
    timeout=30,           # Request timeout in seconds
    retry_count=3,        # Number of retries
    retry_delay=1,        # Delay between retries
)
```

## License

MIT
