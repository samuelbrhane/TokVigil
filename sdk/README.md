# TokenFence SDKs

Official SDKs for the TokenFence platform.

## Packages

| SDK        | Directory     | Package                  |
| ---------- | ------------- | ------------------------ |
| Python     | `python/`     | `pip install tokenfence` |
| TypeScript | `typescript/` | `npm install tokenfence` |

## Quick Start

### Python

```python
from tokenfence import TokenFence

tf = TokenFence(api_key="tf_live_...")

result = tf.evaluate(
    user_id="user_123",
    model="gpt-4o-mini",
    feature="chat"
)

if result.allowed:
    # make your AI call, then log it
    tf.log_usage(
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
import { TokenFence } from "tokenfence";

const tf = new TokenFence({ apiKey: "tf_live_..." });

const result = await tf.evaluate({
  userId: "user_123",
  model: "gpt-4o-mini",
  feature: "chat",
});

if (result.allowed) {
  // make your AI call, then log it
  await tf.logUsage({
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

Full SDK docs at [tokenfence.io/docs](https://tokenfence.io/docs).
