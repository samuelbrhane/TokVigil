# TokVigil SDKs

Official SDKs for the TokVigil platform.

## Packages

| SDK        | Directory     | Package                |
| ---------- | ------------- | ---------------------- |
| Python     | `python/`     | `pip install tokvigil` |
| TypeScript | `typescript/` | `npm install tokvigil` |

## Quick Start

### Python

```python
from tokvigil import TokVigil

tv = TokVigil(api_key="tv_live_...")

result = tv.evaluate(
    user_id="user_123",
    model="gpt-4o-mini",
    feature="chat"
)

if result.allowed:
    # make your AI call, then log it
    tv.log_usage(
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
import { TokVigil } from "tokvigil";

const tv = new TokVigil({ apiKey: "tv_live_..." });

const result = await tv.evaluate({
  userId: "user_123",
  model: "gpt-4o-mini",
  feature: "chat",
});

if (result.allowed) {
  // make your AI call, then log it
  await tv.logUsage({
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

Full SDK docs at [tokvigil.com/docs](https://tokvigil.com/docs).
