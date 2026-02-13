import * as vscode from "vscode";
import { setApiKey, getConfig } from "../config/settings";
import { TokVigilApiClient } from "../api/client";
import { SidebarProvider } from "../panels/SidebarProvider";

export async function setApiKeyCommand(
  apiClient: TokVigilApiClient,
  sidebarProvider: SidebarProvider,
): Promise<void> {
  const config = getConfig();

  const apiKey = await vscode.window.showInputBox({
    prompt: "Enter your TokVigil API key",
    placeHolder: "tv_live_xxxxxxxxxxxxxxxx",
    value: config.apiKey,
    password: false,
    validateInput: (value) => {
      if (!value) {
        return "API key is required";
      }
      if (!value.startsWith("tv_live_") && !value.startsWith("tv_test_")) {
        return "Invalid API key format. Should start with tv_live_ or tv_test_";
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
      title: "TokVigil: Testing connection...",
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
    vscode.window.showInformationMessage(`TokVigil: ${testResult.message}`);
  } else {
    vscode.window.showWarningMessage(
      `TokVigil: API key saved but connection test failed: ${testResult.message}`,
    );
  }
}
