from tokenfence import TokenFence
import uuid

tf = TokenFence(
    api_key="tf_live_52de2ea4dc90d0d4255d9700a4a172e418545e78f597f20e",  # Paste your API key
    base_url="http://localhost:8001"
)

# Test evaluate
result = tf.evaluate(
    user_id="user_123",
    model="gpt-4o-mini",
    plan="free",
    feature="chat"
)

print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason_code}")
print(f"Message: {result.message}")
print(f"Limit State: {result.limit_state}")


# Test 2: Log Usage
print("=== Test Log Usage ===")
request_id = str(uuid.uuid4())
log_result = tf.log_usage(
    request_id=request_id,
    user_id="user_123",
    model="gpt-4o-mini",
    input_tokens=100,
    output_tokens=50,
    status="allowed",
    plan="free",
    feature="chat",
    latency_ms=350
)

print(f"Logged: {log_result.recorded}")
print(f"Request ID: {log_result.request_id}")
print()

# Test 3: Evaluate again (should show 1 request used)
print("=== Test Evaluate Again ===")
result2 = tf.evaluate(
    user_id="user_123",
    model="gpt-4o-mini",
    plan="free",
    feature="chat"
)

print(f"Allowed: {result2.allowed}")
print(f"Requests today: {result2.limit_state.requests_today}/{result2.limit_state.requests_limit_daily}")
print()

# Test 4: Get Usage Summary
print("=== Test Usage Summary ===")
summary = tf.get_usage_summary()
print(f"Total requests: {summary.total_requests}")
print(f"Total tokens: {summary.total_tokens}")
print(f"Total cost: ${summary.total_cost_usd}")
print(f"Allowed: {summary.allowed_count}")
print(f"Blocked: {summary.blocked_count}")