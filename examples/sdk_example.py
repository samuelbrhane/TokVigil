"""
Example script demonstrating the AI Usage Control SDK.

This script shows how to:
1. Use the SDK to evaluate policies before making LLM calls
2. Log usage information
3. Wrap LLM calls with automatic policy evaluation and logging
"""

import sys
import os

# Add SDK to path (for development)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "sdk"))

from ai_usage_control import AIUsageControlClient, PolicyViolationException


def example_manual_evaluation():
    """Example: Manual policy evaluation and usage logging."""
    print("\n=== Example 1: Manual Policy Evaluation ===\n")
    
    # Initialize client
    client = AIUsageControlClient(
        api_key="your-api-key-here",
        base_url="http://localhost:8000"
    )
    
    try:
        # Evaluate policy before making a call
        result = client.evaluate_policy(
            model="gpt-4",
            operation="chat.completion",
            estimated_tokens=1000,
        )
        print(f"✓ Policy evaluation passed: {result}")
        
        # Simulate making an LLM call
        print("Making LLM call...")
        
        # Log usage after the call
        log = client.log_usage(
            model="gpt-4",
            operation="chat.completion",
            prompt_tokens=800,
            completion_tokens=200,
            total_tokens=1000,
            estimated_cost=0.03,
            was_allowed=True,
        )
        print(f"✓ Usage logged: {log['id']}")
        
    except PolicyViolationException as e:
        print(f"✗ Policy violation: {e}")
        print(f"  Reason: {e.reason_code}")


def example_wrapped_call():
    """Example: Using the decorator to wrap LLM calls."""
    print("\n=== Example 2: Wrapped LLM Call ===\n")
    
    client = AIUsageControlClient(
        api_key="your-api-key-here",
        base_url="http://localhost:8000"
    )
    
    # Define a mock LLM call function
    @client.wrap_llm_call(model="gpt-3.5-turbo", operation="chat.completion")
    def call_llm(prompt):
        """Mock LLM call that returns a fake response."""
        print(f"Calling LLM with prompt: {prompt[:50]}...")
        
        # Simulate an LLM response (OpenAI format)
        return {
            "choices": [{"message": {"content": "This is a mock response."}}],
            "usage": {
                "prompt_tokens": 50,
                "completion_tokens": 10,
                "total_tokens": 60,
            }
        }
    
    try:
        # This call will:
        # 1. Evaluate policy before execution
        # 2. Execute the function if allowed
        # 3. Log usage after execution
        response = call_llm("What is the capital of France?")
        print(f"✓ Response: {response['choices'][0]['message']['content']}")
        
    except PolicyViolationException as e:
        print(f"✗ Policy violation: {e}")
        print(f"  Reason: {e.reason_code}")


def example_get_usage_logs():
    """Example: Retrieving usage logs."""
    print("\n=== Example 3: Retrieving Usage Logs ===\n")
    
    client = AIUsageControlClient(
        api_key="your-api-key-here",
        base_url="http://localhost:8000"
    )
    
    try:
        # Get recent usage logs
        logs = client.get_usage_logs(limit=10)
        print(f"Retrieved {len(logs)} usage log entries:")
        
        for log in logs:
            status = "✓ Allowed" if log["was_allowed"] else "✗ Blocked"
            print(f"  {status} - {log['model']} - {log['total_tokens']} tokens - ${log['estimated_cost']:.4f}")
            
    except Exception as e:
        print(f"Error retrieving logs: {e}")


if __name__ == "__main__":
    print("=" * 60)
    print("AI Usage Control SDK Examples")
    print("=" * 60)
    
    print("\nNote: These examples require:")
    print("1. The backend server running on http://localhost:8000")
    print("2. A valid API key (replace 'your-api-key-here')")
    print("3. A workspace with policies configured")
    
    # Uncomment to run examples (after setting up backend and API key)
    # example_manual_evaluation()
    # example_wrapped_call()
    # example_get_usage_logs()
    
    print("\n" + "=" * 60)
    print("Update the API key in this script and uncomment the")
    print("function calls at the bottom to run the examples.")
    print("=" * 60)
