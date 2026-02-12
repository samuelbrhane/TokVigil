import * as vscode from "vscode";
import { setApiKey, getConfig } from "../config/settings";
import { UsageSentinelApiClient } from "../api/client";
import { SidebarProvider } from "../panels/SidebarProvider";

export async function setApiKeyCommand(
  apiClient: UsageSentinelApiClient,
  sidebarProvider: SidebarProvider,
): Promise<void> {
  const config = getConfig();

  const apiKey = await vscode.window.showInputBox({
    prompt: "Enter your UsageSentinel API key",
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

  // Test connection and refresh sidebar
  const testResult = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "UsageSentinel: Testing connection...",
      cancellable: false,
    },
    async () => {
      const result = await apiClient.testConnection();

      // Auto-refresh sidebar after setting API key
      await sidebarProvider.refresh();

      return result;
    },
  );

  if (testResult.success) {
    vscode.window.showInformationMessage(
      `UsageSentinel: ${testResult.message}`,
    );
  } else {
    vscode.window.showWarningMessage(
      `UsageSentinel: API key saved but connection test failed: ${testResult.message}`,
    );
  }
}
