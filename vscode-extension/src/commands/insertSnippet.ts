import * as vscode from "vscode";

interface SnippetOption {
  label: string;
  description: string;
  snippet: string;
  pythonSnippet: string;
}

const snippets: SnippetOption[] = [
  {
    label: "$(file-add) Import",
    description: "Import TokVigil SDK",
    snippet: `import { TokVigil } from "tokvigil";

\$0`,
    pythonSnippet: `from tokvigil import TokVigil

\$0`,
  },
  {
    label: "$(plug) Initialize Client",
    description: "Create TokVigil client instance",
    snippet: `import { TokVigil } from "tokvigil";

const us =new TokVigil({
  apiKey: "\${1:your_api_key}",
});

\$0`,
    pythonSnippet: `from tokvigil import TokVigil

tv = TokVigil(
    api_key="\${1:your_api_key}"
)

\$0`,
  },
  {
    label: "$(play) Evaluate Request",
    description: "Check if request is allowed",
    snippet: `const result = await tv.evaluate({
  userId: "\${1:user_id}",
  model: "\${2:gpt-4o-mini}",
  plan: "\${3:free}",
  feature: "\${4:chat}",
});

if (result.allowed) {
  \$0
} else {
  console.log(\`Blocked: \\\${result.message}\`);
}`,
    pythonSnippet: `result = tv.evaluate(
    user_id="\${1:user_id}",
    model="\${2:gpt-4o-mini}",
    plan="\${3:free}",
    feature="\${4:chat}"
)

if result.allowed:
    \$0
else:
    print(f"Blocked: {result.message}")`,
  },
  {
    label: "$(history) Log Usage",
    description: "Log AI call after completion",
    snippet: `await tv.logUsage({
  requestId: "\${1:request_id}",
  userId: "\${2:user_id}",
  model: "\${3:gpt-4o-mini}",
  inputTokens: \${4:100},
  outputTokens: \${5:50},
  status: "allowed",
  plan: "\${6:free}",
  feature: "\${7:chat}",
});

\$0`,
    pythonSnippet: `tv.log_usage(
    request_id="\${1:request_id}",
    user_id="\${2:user_id}",
    model="\${3:gpt-4o-mini}",
    input_tokens=\${4:100},
    output_tokens=\${5:50},
    status="allowed",
    plan="\${6:free}",
    feature="\${7:chat}"
)

\$0`,
  },
  {
    label: "$(rocket) Full Flow",
    description: "Complete evaluate, call AI, and log flow",
    snippet: `import { TokVigil } from "tokvigil";

const us =new TokVigil({ apiKey: "\${1:your_api_key}" });

async function handleAiRequest(userId: string, prompt: string) {
  const result = await tv.evaluate({
    userId,
    model: "\${2:gpt-4o-mini}",
    plan: "\${3:free}",
    feature: "\${4:chat}",
  });

  if (!result.allowed) {
    return { error: result.message };
  }

  const requestId = crypto.randomUUID();
  
  // Make your AI call here
  // const response = await openai.chat.completions.create({...});
  \$0

  await tv.logUsage({
    requestId,
    userId,
    model: "\${2:gpt-4o-mini}",
    inputTokens: 100,
    outputTokens: 50,
    status: "allowed",
    plan: "\${3:free}",
    feature: "\${4:chat}",
  });

  return { success: true };
}`,
    pythonSnippet: `from tokvigil import TokVigil
import uuid

tv = TokVigil(api_key="\${1:your_api_key}")

def handle_ai_request(user_id: str, prompt: str):
    result = tv.evaluate(
        user_id=user_id,
        model="\${2:gpt-4o-mini}",
        plan="\${3:free}",
        feature="\${4:chat}"
    )

    if not result.allowed:
        return {"error": result.message}

    request_id = str(uuid.uuid4())
    
    # Make your AI call here
    # response = openai.chat.completions.create(...)
    \$0

    tv.log_usage(
        request_id=request_id,
        user_id=user_id,
        model="\${2:gpt-4o-mini}",
        input_tokens=100,
        output_tokens=50,
        status="allowed",
        plan="\${3:free}",
        feature="\${4:chat}"
    )

    return {"success": True}`,
  },
  {
    label: "$(shield) Error Handling",
    description: "TokVigil with try/catch error handling",
    snippet: `import { TokVigil, RateLimitError, AuthenticationError, TokVigilError } from "tokvigil";

const us =new TokVigil({ apiKey: "\${1:your_api_key}" });

try {
  const result = await tv.evaluate({
    userId: "\${2:user_id}",
    model: "\${3:gpt-4o-mini}",
  });
  
  if (result.allowed) {
    \$0
  }
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Invalid API key:", error.message);
  } else if (error instanceof RateLimitError) {
    console.error("Rate limited. Retry after:", error.retryAfter, "seconds");
  } else if (error instanceof TokVigilError) {
    console.error("TokVigil error:", error.message);
  } else {
    throw error;
  }
}`,
    pythonSnippet: `from tokvigil import TokVigil, RateLimitError, AuthenticationError, TokVigilError

tv = TokVigil(api_key="\${1:your_api_key}")

try:
    result = tv.evaluate(
        user_id="\${2:user_id}",
        model="\${3:gpt-4o-mini}"
    )
    
    if result.allowed:
        \$0
except AuthenticationError as e:
    print(f"Invalid API key: {e.message}")
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after} seconds")
except TokVigilError as e:
    print(f"TokVigil error: {e.message}")`,
  },
  {
    label: "$(graph) Usage Summary",
    description: "Get usage summary statistics",
    snippet: `const summary = await tv.getUsageSummary();

console.log("Total requests:", summary.totalRequests);
console.log("Total tokens:", summary.totalTokens);
console.log("Total cost: $" + summary.totalCostUsd.toFixed(2));
console.log("Blocked:", summary.blockedCount);

\$0`,
    pythonSnippet: `summary = tv.get_usage_summary()

print(f"Total requests: {summary.total_requests}")
print(f"Total tokens: {summary.total_tokens}")
print(f"Total cost: \${summary.total_cost_usd:.2f}")
print(f"Blocked: {summary.blocked_count}")

\$0`,
  },
  {
    label: "$(person) Usage By User",
    description: "Get usage grouped by user",
    snippet: `const byUser = await tv.getUsageByUser();

console.log("Usage by user:");
for (const user of byUser.items) {
  console.log(\`  \\\${user.group}: \\\${user.requests} requests, \\\${user.tokens} tokens\`);
}

\$0`,
    pythonSnippet: `by_user = tv.get_usage_by_user()

print("Usage by user:")
for user in by_user.items:
    print(f"  {user.group}: {user.requests} requests, {user.tokens} tokens")

\$0`,
  },
  {
    label: "$(symbol-property) Usage By Feature",
    description: "Get usage grouped by feature",
    snippet: `const byFeature = await tv.getUsageByFeature();

console.log("Usage by feature:");
for (const feature of byFeature.items) {
  console.log(\`  \\\${feature.group}: \\\${feature.requests} requests, \\\${feature.tokens} tokens\`);
}

\$0`,
    pythonSnippet: `by_feature = tv.get_usage_by_feature()

print("Usage by feature:")
for feature in by_feature.items:
    print(f"  {feature.group}: {feature.requests} requests, {feature.tokens} tokens")

\$0`,
  },
  {
    label: "$(error) Blocked Requests",
    description: "Get list of blocked requests",
    snippet: `const blocked = await tv.getBlockedRequests();

console.log("Total blocked:", blocked.total);
for (const record of blocked.items) {
  console.log(\`  \\\${record.userId}: \\\${record.reasonCode} - \\\${record.model}\`);
}

\$0`,
    pythonSnippet: `blocked = tv.get_blocked_requests()

print(f"Total blocked: {blocked.total}")
for record in blocked.items:
    print(f"  {record.user_id}: {record.reason_code} - {record.model}")

\$0`,
  },
  {
    label: "$(zap) Check and Call",
    description: "Evaluate, call AI, and auto-log in one step",
    snippet: `const { result, response } = await tv.checkAndCall(
  {
    userId: "\${1:user_id}",
    model: "\${2:gpt-4o-mini}",
    plan: "\${3:free}",
    feature: "\${4:chat}",
  },
  async () => {
    // Your AI call here
    return await openai.chat.completions.create({
      model: "\${2:gpt-4o-mini}",
      messages: [{ role: "user", content: "\${5:Hello}" }],
    });
  },
  (response) => ({
    inputTokens: response.usage.prompt_tokens,
    outputTokens: response.usage.completion_tokens,
  })
);

if (result.allowed && response) {
  console.log(response.choices[0].message.content);
  \$0
} else {
  console.log("Blocked:", result.message);
}`,
    pythonSnippet: `def call_ai():
    # Your AI call here
    return openai.chat.completions.create(
        model="\${2:gpt-4o-mini}",
        messages=[{"role": "user", "content": "\${5:Hello}"}]
    )

result, response = tv.check_and_call(
    user_id="\${1:user_id}",
    model="\${2:gpt-4o-mini}",
    ai_function=call_ai,
    plan="\${3:free}",
    feature="\${4:chat}"
)

if result.allowed:
    print(response.choices[0].message.content)
    \$0
else:
    print(f"Blocked: {result.message}")`,
  },
  {
    label: "$(list-unordered) Recent Usage",
    description: "Get recent usage records with pagination",
    snippet: `const recent = await tv.getRecentUsage({ page: 1, pageSize: 10 });

console.log("Total records:", recent.total);
console.log("Page:", recent.page, "/", recent.totalPages);

for (const record of recent.items) {
  console.log(\`  \\\${record.userId}: \\\${record.model} - \\\${record.totalTokens} tokens\`);
}

\$0`,
    pythonSnippet: `recent = tv.get_recent_usage(page=1, page_size=10)

print(f"Total records: {recent.total}")
print(f"Page: {recent.page} / {recent.total_pages}")

for record in recent.items:
    print(f"  {record.user_id}: {record.model} - {record.total_tokens} tokens")

\$0`,
  },
];

export async function insertSnippet(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }

  const selected = await vscode.window.showQuickPick(snippets, {
    placeHolder: "Select a code snippet to insert",
    title: "TokVigil: Insert Snippet",
  });

  if (!selected) {
    return;
  }

  const languageId = editor.document.languageId;
  const snippet =
    languageId === "python" ? selected.pythonSnippet : selected.snippet;

  await editor.insertSnippet(new vscode.SnippetString(snippet));
}
