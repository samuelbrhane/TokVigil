"""
Example script for initializing the AI Usage Control Platform.

This script demonstrates how to:
1. Create a workspace
2. Generate an API key
3. Create policies for usage control
"""

import requests
import json

BASE_URL = "http://localhost:8000/api/v1"


def create_workspace(name: str, description: str = None):
    """Create a new workspace."""
    print(f"\n🏢 Creating workspace: {name}")
    
    response = requests.post(
        f"{BASE_URL}/workspaces",
        json={
            "name": name,
            "description": description,
            "is_active": True,
        }
    )
    
    if response.status_code == 201:
        workspace = response.json()
        print(f"✓ Workspace created: {workspace['id']}")
        return workspace
    else:
        print(f"✗ Failed to create workspace: {response.text}")
        return None


def create_api_key(workspace_id: str, name: str):
    """Create an API key for a workspace."""
    print(f"\n🔑 Creating API key: {name}")
    
    response = requests.post(
        f"{BASE_URL}/api-keys",
        json={
            "name": name,
            "workspace_id": workspace_id,
        }
    )
    
    if response.status_code == 201:
        api_key = response.json()
        print(f"✓ API Key created: {api_key['key']}")
        print(f"  ⚠️  Save this key securely - it won't be shown again!")
        return api_key
    else:
        print(f"✗ Failed to create API key: {response.text}")
        return None


def create_policy(workspace_id: str, policy_config: dict):
    """Create a policy for a workspace."""
    print(f"\n📋 Creating policy: {policy_config['name']}")
    
    policy_config["workspace_id"] = workspace_id
    
    response = requests.post(
        f"{BASE_URL}/policies",
        json=policy_config,
    )
    
    if response.status_code == 201:
        policy = response.json()
        print(f"✓ Policy created: {policy['id']}")
        return policy
    else:
        print(f"✗ Failed to create policy: {response.text}")
        return None


def setup_example_workspace():
    """Set up an example workspace with policies."""
    print("=" * 60)
    print("AI Usage Control Platform - Initial Setup")
    print("=" * 60)
    
    # Create workspace
    workspace = create_workspace(
        name="development",
        description="Development workspace for testing"
    )
    
    if not workspace:
        return
    
    workspace_id = workspace["id"]
    
    # Create API key
    api_key = create_api_key(workspace_id, "dev-key")
    
    # Create policies
    policies = [
        {
            "name": "Rate Limit Policy",
            "description": "Limit requests to 100 per hour",
            "max_requests_per_hour": 100,
            "priority": 10,
            "is_active": True,
        },
        {
            "name": "Token Limit Policy",
            "description": "Limit tokens per request to 4000",
            "max_tokens_per_request": 4000,
            "priority": 5,
            "is_active": True,
        },
        {
            "name": "Cost Control Policy",
            "description": "Limit hourly spend to $10",
            "max_cost_per_hour": 10.0,
            "priority": 15,
            "is_active": True,
        },
        {
            "name": "Model Whitelist Policy",
            "description": "Only allow specific models",
            "allowed_models": ["gpt-3.5-turbo", "gpt-4"],
            "priority": 20,
            "is_active": True,
        },
    ]
    
    for policy_config in policies:
        create_policy(workspace_id, policy_config)
    
    print("\n" + "=" * 60)
    print("Setup Complete!")
    print("=" * 60)
    print(f"\nWorkspace ID: {workspace_id}")
    if api_key:
        print(f"API Key: {api_key['key']}")
        print("\nUse this API key in your SDK client:")
        print(f"  client = AIUsageControlClient(api_key='{api_key['key']}')")
    print("\n" + "=" * 60)


if __name__ == "__main__":
    print("\nNote: Make sure the backend server is running on http://localhost:8000")
    print("Start it with: cd backend && uvicorn app.main:app --reload\n")
    
    input("Press Enter to continue with setup...")
    setup_example_workspace()
