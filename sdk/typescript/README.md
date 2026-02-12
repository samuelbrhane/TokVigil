# UsageSentinel Node.js SDK

Official TypeScript/JavaScript SDK for [UsageSentinel](https://tokenfence.io) - AI usage control platform.

Manage rate limits, budgets, and policies for your AI-powered applications.

## Installation

```bash
npm install tokenfence
# or
yarn add tokenfence
# or
pnpm add tokenfence
```

## Quick Start

```typescript
import { UsageSentinel } from "tokenfence";

// Initialize client
const tf = new UsageSentinel({ apiKey: "tf_live_xxx" });

// Check if request is allowed
const result = await tf.evaluate({
  userId: "user_123",
  plan: "free",
  feature: "chat",
  model: "gpt-4o-mini",
  inputTokens: 100,
});

if (result.allowed) {
  // Make your AI call
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Hello!" }],
  });

  // Log the usage
  await tf.logUsage({
    requestId: "req_123",
    userId: "user_123",
    model: "gpt-4o-mini",
    inputTokens: response.usage.prompt_tokens,
    outputTokens: response.usage.completion_tokens,
    status: "allowed",
  });
} else {
  console.log(`Blocked: ${result.message}`);
}
```

## Features

- ✅ Check requests against policies
- ✅ Log AI usage (tokens, cost, latency)
- ✅ Get usage analytics
- ✅ Automatic retry with backoff
- ✅ Full TypeScript support

## Usage

### Evaluate Request

```typescript
const result = await tf.evaluate({
  userId: "user_123",
  model: "gpt-4o-mini",
  plan: "free", // optional
  feature: "chat", // optional
  inputTokens: 100, // optional
  inputText: "Hello", // optional (estimates tokens)
});

console.log(result.allowed); // true or false
console.log(result.reasonCode); // "ALLOWED" or "DAILY_REQUEST_LIMIT_EXCEEDED"
console.log(result.message); // Human readable message
console.log(result.estimatedCostUsd); // 0.0001
console.log(result.limitState?.requestsToday); // 45
console.log(result.limitState?.requestsLimitDaily); // 50
```

### Log Usage

```typescript
await tf.logUsage({
  requestId: "req_123",
  userId: "user_123",
  model: "gpt-4o-mini",
  inputTokens: 100,
  outputTokens: 50,
  status: "allowed",
  plan: "free",
  feature: "chat",
  latencyMs: 350,
});
```

### Check and Call (Helper)

Automatically evaluate, call AI, and log usage:

```typescript
const { result, response } = await tf.checkAndCall(
  {
    userId: "user_123",
    model: "gpt-4o-mini",
    plan: "free",
    feature: "chat",
  },
  async () => {
    return await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello" }],
    });
  },
  (response) => ({
    inputTokens: response.usage.prompt_tokens,
    outputTokens: response.usage.completion_tokens,
  }),
);

if (result.allowed && response) {
  console.log(response.choices[0].message.content);
} else {
  console.log(`Blocked: ${result.message}`);
}
```

### Get Usage Analytics

```typescript
// Summary
const summary = await tf.getUsageSummary();
console.log(summary.totalRequests);
console.log(summary.totalTokens);
console.log(summary.totalCostUsd);

// Recent usage
const recent = await tf.getRecentUsage({ page: 1, pageSize: 20 });
for (const record of recent.items) {
  console.log(`${record.userId}: ${record.totalTokens} tokens`);
}

// Usage by user
const byUser = await tf.getUsageByUser();
for (const group of byUser.items) {
  console.log(`${group.group}: ${group.requests} requests, $${group.costUsd}`);
}

// Usage by feature
const byFeature = await tf.getUsageByFeature();
for (const group of byFeature.items) {
  console.log(`${group.group}: ${group.requests} requests`);
}
```

## Error Handling

```typescript
import { UsageSentinel, RateLimitError, AuthenticationError } from "tokenfence";

const tf = new UsageSentinel({ apiKey: "tf_live_xxx" });

try {
  const result = await tf.evaluate({
    userId: "user_123",
    model: "gpt-4o-mini",
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log(`Invalid API key: ${error.message}`);
  } else if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof UsageSentinelError) {
    console.log(`Error: ${error.message}`);
  }
}
```

## Configuration

```typescript
const tf = new UsageSentinel({
  apiKey: "tf_live_xxx",
  baseUrl: "https://api.tokenfence.io", // Custom API URL
  timeout: 30000, // Request timeout in milliseconds
  retryCount: 3, // Number of retries
  retryDelay: 1000, // Delay between retries in milliseconds
});
```

## License

MIT
