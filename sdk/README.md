# UsageSentinel SDKs

Official SDKs for the UsageSentinel platform.

## Packages

| SDK        | Directory     | Package                  |
| ---------- | ------------- | ------------------------ |
| Python     | `python/`     | `pip install tokenfence` |
| TypeScript | `typescript/` | `npm install tokenfence` |

## Quick Start

### Python

```python
from tokenfence import UsageSentinel

tf = UsageSentinel(api_key="us_live_...")

result = us.evaluate(
    user_id="user_123",
    model="gpt-4o-mini",
    feature="chat"
)

if result.allowed:
    # make your AI call, then log it
    us.log_usage(
        request_id="req_123",
        user_id="user_123",
        model="gpt-4o-mini",
        input_tokens=100,
        output_tokens=50,
        status="allowed"
    )
```

### TypeScript

```typescript
import { UsageSentinel } from "tokenfence";

const tf = new UsageSentinel({ apiKey: "us_live_..." });

const result = await us.evaluate({
  userId: "user_123",
  model: "gpt-4o-mini",
  feature: "chat",
});

if (result.allowed) {
  // make your AI call, then log it
  await us.logUsage({
    requestId: "req_123",
    userId: "user_123",
    model: "gpt-4o-mini",
    inputTokens: 100,
    outputTokens: 50,
    status: "allowed",
  });
}
```

## Documentation

Full SDK docs at [usagesentinel.com/docs](https://usagesentinel.com/docs).
