import * as vscode from "vscode";
import { UsageSentinelApiClient } from "../api/client";
import { getConfig } from "../config/settings";
import { AI_MODELS } from "../config/constants";

export async function testEvaluate(
  apiClient: UsageSentinelApiClient,
): Promise<void> {
  const config = getConfig();

  if (!config.apiKey) {
    const setKey = await vscode.window.showErrorMessage(
      "UsageSentinel API key not configured",
      "Set API Key",
    );
    if (setKey === "Set API Key") {
      vscode.commands.executeCommand("tokenfence.setApiKey");
    }
    return;
  }

  // Get user input
  const userId = await vscode.window.showInputBox({
    prompt: "Enter user ID",
    placeHolder: "user_123",
    value: "test_user",
  });

  if (!userId) {
    return;
  }

  const modelItems = Object.entries(AI_MODELS).map(([model, data]) => ({
    label: data.label,
    description: data.provider,
    value: model,
  }));

  const selectedModel = await vscode.window.showQuickPick(modelItems, {
    placeHolder: "Select AI model",
  });

  if (!selectedModel) {
    return;
  }

  const model = selectedModel.value;

  if (!model) {
    return;
  }

  const plan = await vscode.window.showInputBox({
    prompt: "Enter plan (optional)",
    placeHolder: "free",
    value: "free",
  });

  const feature = await vscode.window.showInputBox({
    prompt: "Enter feature (optional)",
    placeHolder: "chat",
    value: "chat",
  });

  // Show progress
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "UsageSentinel: Testing evaluate...",
      cancellable: false,
    },
    async () => {
      const response = await apiClient.evaluate({
        userId,
        model,
        plan: plan || undefined,
        feature: feature || undefined,
      });

      if (response.error) {
        vscode.window.showErrorMessage(
          `UsageSentinel Error: ${response.error}`,
        );
        return;
      }

      const result = response.data!;

      // Log the test request so it shows in usage summary
      try {
        await apiClient.logUsage({
          requestId: crypto.randomUUID(),
          userId,
          model,
          inputTokens: 100,
          outputTokens: 50,
          status: result.allowed ? "allowed" : "blocked",
          plan: plan || "free",
          feature: feature || "test",
          reasonCode: result.reasonCode,
        });
      } catch (logError) {
        // Silently ignore log errors
        console.error("Failed to log test request:", logError);
      }

      // Build result message
      const statusIcon = result.allowed ? "✅" : "❌";
      const message = `${statusIcon} ${result.allowed ? "Allowed" : "Blocked"}: ${result.message}`;

      // Show result with details
      const detail = await vscode.window.showInformationMessage(
        message,
        { modal: false },
        "View Details",
        "Insert Code",
      );

      if (detail === "View Details") {
        showResultDetails(result);
      } else if (detail === "Insert Code") {
        insertEvaluateCode(userId, model, plan, feature);
      }
    },
  );
}

function showResultDetails(result: any): void {
  const panel = vscode.window.createWebviewPanel(
    "tokenfenceResult",
    "UsageSentinel Evaluate Result",
    vscode.ViewColumn.Beside,
    {},
  );

  const limitState = result.limitState || {};

  panel.webview.html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: var(--vscode-font-family); padding: 20px; }
        h1 { color: var(--vscode-foreground); }
        .status { font-size: 24px; margin: 20px 0; }
        .allowed { color: #4caf50; }
        .blocked { color: #f44336; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid var(--vscode-panel-border); }
        th { color: var(--vscode-descriptionForeground); }
        .code { background: var(--vscode-textCodeBlock-background); padding: 2px 6px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <h1>Evaluate Result</h1>
      
      <div class="status ${result.allowed ? "allowed" : "blocked"}">
        ${result.allowed ? "✅ Allowed" : "❌ Blocked"}
      </div>
      
      <table>
        <tr>
          <th>Reason Code</th>
          <td><span class="code">${result.reasonCode}</span></td>
        </tr>
        <tr>
          <th>Message</th>
          <td>${result.message}</td>
        </tr>
        <tr>
          <th>Policy ID</th>
          <td>${result.policyId || "N/A"}</td>
        </tr>
        <tr>
          <th>Estimated Cost</th>
          <td>$${result.estimatedCostUsd?.toFixed(4) || "N/A"}</td>
        </tr>
      </table>
      
      <h2>Limit State</h2>
      <table>
        <tr>
          <th>Requests Today</th>
          <td>${limitState.requestsToday ?? "N/A"} / ${limitState.requestsLimitDaily ?? "∞"}</td>
        </tr>
        <tr>
          <th>Requests This Month</th>
          <td>${limitState.requestsThisMonth ?? "N/A"} / ${limitState.requestsLimitMonthly ?? "∞"}</td>
        </tr>
        <tr>
          <th>Tokens Today</th>
          <td>${limitState.tokensToday ?? "N/A"} / ${limitState.tokensLimitDaily ?? "∞"}</td>
        </tr>
        <tr>
          <th>Cost Today</th>
          <td>$${limitState.costTodayUsd?.toFixed(2) ?? "N/A"} / $${limitState.costLimitDailyUsd ?? "∞"}</td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

async function insertEvaluateCode(
  userId: string,
  model: string,
  plan?: string,
  feature?: string,
): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }

  const languageId = editor.document.languageId;
  let code: string;

  if (languageId === "python") {
    code = `result = us.evaluate(
    user_id="${userId}",
    model="${model}",
    plan="${plan || "free"}",
    feature="${feature || "chat"}"
)

if result.allowed:
    # Make your AI call here
    pass
else:
    print(f"Blocked: {result.message}")
`;
  } else {
    code = `const result = await us.evaluate({
  userId: "${userId}",
  model: "${model}",
  plan: "${plan || "free"}",
  feature: "${feature || "chat"}",
});

if (result.allowed) {
  // Make your AI call here
} else {
  console.log(\`Blocked: \${result.message}\`);
}
`;
  }

  await editor.insertSnippet(new vscode.SnippetString(code));
}
