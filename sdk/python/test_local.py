from tokenfence import TokenFence
import uuid

tf = TokenFence(
    api_key="tf_live_52de2ea4dc90d0d4255d9700a4a172e418545e78f597f20e",  # Paste your API key
    base_url="http://localhost:8001"
)

print("=" * 50)
print("TEST 1: Basic Evaluate")
print("=" * 50)
result = tf.evaluate(
    user_id="test_user_1",
    model="gpt-4o-mini",
    plan="free",
    feature="chat",
    input_tokens=100
)
print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason_code}")
print()

print("=" * 50)
print("TEST 2: Log multiple requests to hit limit")
print("=" * 50)

# Log 50 requests to hit the daily limit
for i in range(50):
    tf.log_usage(
        request_id=str(uuid.uuid4()),
        user_id="test_user_2",
        model="gpt-4o-mini",
        input_tokens=100,
        output_tokens=50,
        status="allowed",
        plan="free",
        feature="chat"
    )
    if (i + 1) % 10 == 0:
        print(f"Logged {i + 1} requests...")

print()

print("=" * 50)
print("TEST 3: Check if user is now blocked")
print("=" * 50)
result = tf.evaluate(
    user_id="test_user_2",
    model="gpt-4o-mini",
    plan="free",
    feature="chat"
)
print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason_code}")
print(f"Message: {result.message}")
print(f"Requests today: {result.limit_state.requests_today}/{result.limit_state.requests_limit_daily}")
print()

print("=" * 50)
print("TEST 4: Different user should still be allowed")
print("=" * 50)
result = tf.evaluate(
    user_id="test_user_3",
    model="gpt-4o-mini",
    plan="free",
    feature="chat"
)
print(f"Allowed: {result.allowed}")
print(f"Reason: {result.reason_code}")
print()

print("=" * 50)
print("TEST 5: Usage Summary")
print("=" * 50)
summary = tf.get_usage_summary()
print(f"Total requests: {summary.total_requests}")
print(f"Total tokens: {summary.total_tokens}")
print(f"Allowed: {summary.allowed_count}")
print(f"Blocked: {summary.blocked_count}")
print()

print("=" * 50)
print("TEST 6: Usage by User")
print("=" * 50)
by_user = tf.get_usage_by_user()
for user in by_user.items:
    print(f"  {user.group}: {user.requests} requests, {user.tokens} tokens")
print()

print("=" * 50)
print("ALL TESTS COMPLETE!")
print("=" * 50)