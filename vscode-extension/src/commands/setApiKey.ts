import * as vscode from "vscode";
import { setApiKey, getConfig } from "../config/settings";
import { TokenFenceApiClient } from "../api/client";

export async function setApiKeyCommand(
  apiClient: TokenFenceApiClient,
): Promise<void> {
  const config = getConfig();

  const apiKey = await vscode.window.showInputBox({
    prompt: "Enter your TokenFence API key",
    placeHolder: "tf_live_xxxxxxxxxxxxxxxx",
    value: config.apiKey,
    password: false,
    validateInput: (value) => {
      if (!value) {
        return "API key is required";
      }
      if (!value.startsWith("tf_live_") && !value.startsWith("tf_test_")) {
        return "Invalid API key format. Should start with tf_live_ or tf_test_";
      }
      return null;
    },
  });

  if (!apiKey) {
    return;
  }

  await setApiKey(apiKey);

  // Update API client
  const newConfig = getConfig();
  apiClient.updateConfig(newConfig);

  // Test connection
  const testResult = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "TokenFence: Testing connection...",
      cancellable: false,
    },
    async () => {
      return apiClient.testConnection();
    },
  );

  if (testResult.success) {
    vscode.window.showInformationMessage(`TokenFence: ${testResult.message}`);
  } else {
    vscode.window.showWarningMessage(
      `TokenFence: API key saved but connection test failed: ${testResult.message}`,
    );
  }
}
