from tokenfence import TokenFence
import uuid
import time

tf = TokenFence(
    api_key="tf_live_52de2ea4dc90d0d4255d9700a4a172e418545e78f597f20e",  
    base_url="http://localhost:8001"
)

def log_requests(user_id, plan, count, tokens_per_request=100):
    """Helper to log multiple requests"""
    for i in range(count):
        tf.log_usage(
            request_id=str(uuid.uuid4()),
            user_id=user_id,
            model="gpt-4o-mini",
            input_tokens=tokens_per_request,
            output_tokens=tokens_per_request,
            status="allowed",
            plan=plan,
            estimated_cost_usd=0.001
        )
        if (i + 1) % 20 == 0:
            print(f"  Logged {i + 1}/{count} requests, waiting...")
            time.sleep(1)

print("=" * 60)
print("TEST 1: Daily Request Limit (free plan)")
print("=" * 60)
log_requests("user_req_daily", "free", 50)
result = tf.evaluate(user_id="user_req_daily", model="gpt-4o-mini", plan="free")
print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason_code}")
print(f"Expected: DAILY_REQUEST_LIMIT_EXCEEDED")
print()

print("=" * 60)
print("TEST 2: Monthly Request Limit")
print("=" * 60)
log_requests("user_req_monthly", "monthly", 5)
result = tf.evaluate(user_id="user_req_monthly", model="gpt-4o-mini", plan="monthly")
print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason_code}")
print(f"Expected: MONTHLY_REQUEST_LIMIT_EXCEEDED")
print()

print("=" * 60)
print("TEST 3: Daily Token Limit")
print("=" * 60)
# 10000 tokens / 200 per request = 50 requests
log_requests("user_token_daily", "free", 50, tokens_per_request=100)
result = tf.evaluate(user_id="user_token_daily", model="gpt-4o-mini", plan="free", input_tokens=100)
print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason_code}")
print(f"Tokens today: {result.limit_state.tokens_today}")
print(f"Expected: DAILY_TOKEN_LIMIT_EXCEEDED or DAILY_REQUEST_LIMIT_EXCEEDED")
print()

print("=" * 60)
print("TEST 4: Model Not Allowed")
print("=" * 60)
result = tf.evaluate(user_id="user_model", model="gpt-4o", plan="restricted")
print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason_code}")
print(f"Expected: MODEL_NOT_ALLOWED")
print()

print("=" * 60)
print("TEST 5: Model Allowed")
print("=" * 60)
result = tf.evaluate(user_id="user_model", model="gpt-4o-mini", plan="restricted")
print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason_code}")
print(f"Expected: ALLOWED")
print()

print("=" * 60)
print("TEST 6: Daily Budget Exceeded")
print("=" * 60)
# Log requests with cost to exceed $0.01 budget
for i in range(20):
    tf.log_usage(
        request_id=str(uuid.uuid4()),
        user_id="user_budget_daily",
        model="gpt-4o-mini",
        input_tokens=100,
        output_tokens=100,
        status="allowed",
        plan="budget_test",
        estimated_cost_usd=0.001  # $0.001 each, 20 = $0.02 > $0.01 limit
    )
result = tf.evaluate(user_id="user_budget_daily", model="gpt-4o-mini", plan="budget_test")
print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason_code}")
print(f"Cost today: ${result.limit_state.cost_today_usd}")
print(f"Expected: DAILY_BUDGET_EXCEEDED")
print()

print("=" * 60)
print("TEST 7: No Policy (should allow)")
print("=" * 60)
result = tf.evaluate(user_id="user_no_policy", model="gpt-4o-mini", plan="nonexistent_plan")
print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason_code}")
print(f"Expected: NO_POLICY")
print()

print("=" * 60)
print("TEST 8: Usage Analytics")
print("=" * 60)
summary = tf.get_usage_summary()
print(f"Total requests: {summary.total_requests}")
print(f"Total tokens: {summary.total_tokens}")
print(f"Total cost: ${summary.total_cost_usd}")
print()

by_user = tf.get_usage_by_user()
print("Usage by user:")
for user in by_user.items[:5]:
    print(f"  {user.group}: {user.requests} requests")
print()

print("=" * 60)
print("ALL TESTS COMPLETE!")
print("=" * 60)