import { TokenFence } from "./src";

const API_KEY = "tf_live_52de2ea4dc90d0d4255d9700a4a172e418545e78f597f20e"; // Your actual API key
const BASE_URL = "http://localhost:8001";

const tf = new TokenFence({ apiKey: API_KEY, baseUrl: BASE_URL });

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function logRequests(
  userId: string,
  plan: string,
  count: number,
  tokensPerRequest: number = 100,
): Promise<void> {
  for (let i = 0; i < count; i++) {
    await tf.logUsage({
      requestId: crypto.randomUUID(),
      userId,
      model: "gpt-4o-mini",
      inputTokens: tokensPerRequest,
      outputTokens: tokensPerRequest,
      status: "allowed",
      plan,
    });
    if ((i + 1) % 10 === 0) {
      console.log(`  Logged ${i + 1}/${count} requests, waiting...`);
      await sleep(2000);
    }
  }
}

async function runTests() {
  console.log("=".repeat(60));
  console.log("TEST 1: Basic Evaluate");
  console.log("=".repeat(60));
  const result1 = await tf.evaluate({
    userId: "ts_user_1",
    model: "gpt-4o-mini",
    plan: "free",
    feature: "chat",
  });
  console.log(`Allowed: ${result1.allowed}`);
  console.log(`Reason: ${result1.reasonCode}`);
  console.log();

  console.log("=".repeat(60));
  console.log("TEST 2: Model Not Allowed");
  console.log("=".repeat(60));
  const result2 = await tf.evaluate({
    userId: "ts_user_2",
    model: "gpt-4o",
    plan: "restricted",
  });
  console.log(`Allowed: ${result2.allowed}`);
  console.log(`Reason: ${result2.reasonCode}`);
  console.log(`Expected: MODEL_NOT_ALLOWED`);
  console.log();

  console.log("=".repeat(60));
  console.log("TEST 3: Model Allowed");
  console.log("=".repeat(60));
  const result3 = await tf.evaluate({
    userId: "ts_user_3",
    model: "gpt-4o-mini",
    plan: "restricted",
  });
  console.log(`Allowed: ${result3.allowed}`);
  console.log(`Reason: ${result3.reasonCode}`);
  console.log(`Expected: ALLOWED`);
  console.log();

  console.log("=".repeat(60));
  console.log("TEST 4: No Policy");
  console.log("=".repeat(60));
  const result4 = await tf.evaluate({
    userId: "ts_user_4",
    model: "gpt-4o-mini",
    plan: "nonexistent_plan",
  });
  console.log(`Allowed: ${result4.allowed}`);
  console.log(`Reason: ${result4.reasonCode}`);
  console.log(`Expected: NO_POLICY`);
  console.log();

  console.log("=".repeat(60));
  console.log("TEST 5: Log Usage");
  console.log("=".repeat(60));
  const logResult = await tf.logUsage({
    requestId: crypto.randomUUID(),
    userId: "ts_user_5",
    model: "gpt-4o-mini",
    inputTokens: 100,
    outputTokens: 50,
    status: "allowed",
    plan: "free",
    feature: "chat",
    latencyMs: 350,
  });
  console.log(`Logged: ${logResult.recorded}`);
  console.log(`Request ID: ${logResult.requestId}`);
  console.log();

  console.log("=".repeat(60));
  console.log("TEST 6: Usage Summary");
  console.log("=".repeat(60));
  const summary = await tf.getUsageSummary();
  console.log(`Total requests: ${summary.totalRequests}`);
  console.log(`Total tokens: ${summary.totalTokens}`);
  console.log(`Total cost: $${summary.totalCostUsd}`);
  console.log();

  console.log("=".repeat(60));
  console.log("TEST 7: Usage By User");
  console.log("=".repeat(60));
  const byUser = await tf.getUsageByUser();
  console.log("Top 5 users:");
  byUser.items.slice(0, 5).forEach((user) => {
    console.log(`  ${user.group}: ${user.requests} requests`);
  });
  console.log();

  console.log("=".repeat(60));
  console.log("ALL TESTS COMPLETE!");
  console.log("=".repeat(60));
}

runTests().catch(console.error);
