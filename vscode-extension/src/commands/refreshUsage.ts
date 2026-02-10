import * as vscode from "vscode";
import { TokenFenceApiClient } from "../api/client";
import { SidebarProvider } from "../panels/SidebarProvider";
import { getConfig } from "../config/settings";

export async function refreshUsage(
  apiClient: TokenFenceApiClient,
  sidebarProvider: SidebarProvider,
): Promise<void> {
  const config = getConfig();

  if (!config.apiKey) {
    vscode.window.showWarningMessage("TokenFence: API key not configured");
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "TokenFence: Refreshing usage...",
      cancellable: false,
    },
    async () => {
      try {
        await sidebarProvider.refresh();
        vscode.window.showInformationMessage("TokenFence: Usage refreshed");
      } catch (error) {
        vscode.window.showErrorMessage(
          `TokenFence: Failed to refresh usage: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
  );
}
