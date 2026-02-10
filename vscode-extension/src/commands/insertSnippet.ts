import * as vscode from "vscode";

interface SnippetOption {
  label: string;
  description: string;
  snippet: string;
  pythonSnippet: string;
}

const snippets: SnippetOption[] = [
  {
    label: "$(file-code) Initialize Client",
    description: "Create TokenFence client instance",
    snippet: `import { TokenFence } from "tokenfence";

const tf = new TokenFence({
  apiKey: "\${1:your_api_key}",
});
`,
    pythonSnippet: `from tokenfence import TokenFence

tf = TokenFence(
    api_key="\${1:your_api_key}"
)
`,
  },
  {
    label: "$(play) Evaluate Request",
    description: "Check if request is allowed",
    snippet: `const result = await tf.evaluate({
  userId: "\${1:user_id}",
  model: "\${2:gpt-4o-mini}",
  plan: "\${3:free}",
  feature: "\${4:chat}",
});

if (result.allowed) {
  \$0
} else {
  console.log(\`Blocked: \\\${result.message}\`);
}
`,
    pythonSnippet: `result = tf.evaluate(
    user_id="\${1:user_id}",
    model="\${2:gpt-4o-mini}",
    plan="\${3:free}",
    feature="\${4:chat}"
)

if result.allowed:
    \$0
else:
    print(f"Blocked: {result.message}")
`,
  },
  {
    label: "$(history) Log Usage",
    description: "Log AI call after completion",
    snippet: `await tf.logUsage({
  requestId: "\${1:request_id}",
  userId: "\${2:user_id}",
  model: "\${3:gpt-4o-mini}",
  inputTokens: \${4:100},
  outputTokens: \${5:50},
  status: "allowed",
});
`,
    pythonSnippet: `tf.log_usage(
    request_id="\${1:request_id}",
    user_id="\${2:user_id}",
    model="\${3:gpt-4o-mini}",
    input_tokens=\${4:100},
    output_tokens=\${5:50},
    status="allowed"
)
`,
  },
  {
    label: "$(graph) Full Flow",
    description: "Complete evaluate and log flow",
    snippet: `import { TokenFence } from "tokenfence";

const tf = new TokenFence({ apiKey: "\${1:your_api_key}" });

const result = await tf.evaluate({
  userId: "\${2:user_id}",
  model: "\${3:gpt-4o-mini}",
  plan: "\${4:free}",
  feature: "\${5:chat}",
});

if (result.allowed) {
  const requestId = crypto.randomUUID();
  
  // Make your AI call here
  \$0
  
  await tf.logUsage({
    requestId,
    userId: "\${2:user_id}",
    model: "\${3:gpt-4o-mini}",
    inputTokens: 100,
    outputTokens: 50,
    status: "allowed",
  });
} else {
  console.log(\`Blocked: \\\${result.message}\`);
}
`,
    pythonSnippet: `from tokenfence import TokenFence
import uuid

tf = TokenFence(api_key="\${1:your_api_key}")

result = tf.evaluate(
    user_id="\${2:user_id}",
    model="\${3:gpt-4o-mini}",
    plan="\${4:free}",
    feature="\${5:chat}"
)

if result.allowed:
    request_id = str(uuid.uuid4())
    
    # Make your AI call here
    \$0
    
    tf.log_usage(
        request_id=request_id,
        user_id="\${2:user_id}",
        model="\${3:gpt-4o-mini}",
        input_tokens=100,
        output_tokens=50,
        status="allowed"
    )
else:
    print(f"Blocked: {result.message}")
`,
  },
  {
    label: "$(shield) Error Handling",
    description: "TokenFence with try/catch",
    snippet: `import { TokenFence, RateLimitError, AuthenticationError, TokenFenceError } from "tokenfence";

const tf = new TokenFence({ apiKey: "\${1:your_api_key}" });

try {
  const result = await tf.evaluate({
    userId: "\${2:user_id}",
    model: "\${3:gpt-4o-mini}",
  });
  \$0
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log(\`Invalid API key: \\\${error.message}\`);
  } else if (error instanceof RateLimitError) {
    console.log(\`Rate limited. Retry after \\\${error.retryAfter} seconds\`);
  } else if (error instanceof TokenFenceError) {
    console.log(\`Error: \\\${error.message}\`);
  }
}
`,
    pythonSnippet: `from tokenfence import TokenFence, RateLimitError, AuthenticationError, TokenFenceError

tf = TokenFence(api_key="\${1:your_api_key}")

try:
    result = tf.evaluate(
        user_id="\${2:user_id}",
        model="\${3:gpt-4o-mini}"
    )
    \$0
except AuthenticationError as e:
    print(f"Invalid API key: {e.message}")
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after} seconds")
except TokenFenceError as e:
    print(f"Error: {e.message}")
`,
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
    title: "TokenFence: Insert Snippet",
  });

  if (!selected) {
    return;
  }

  const languageId = editor.document.languageId;
  const snippet =
    languageId === "python" ? selected.pythonSnippet : selected.snippet;

  await editor.insertSnippet(new vscode.SnippetString(snippet));
}
