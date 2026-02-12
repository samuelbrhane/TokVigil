import * as vscode from "vscode";
import { UsageSentinelApiClient } from "../api/client";
import { SidebarProvider } from "../panels/SidebarProvider";
import { getConfig } from "../config/settings";

export async function refreshUsage(
  apiClient: UsageSentinelApiClient,
  sidebarProvider: SidebarProvider,
): Promise<void> {
  const config = getConfig();

  if (!config.apiKey) {
    vscode.window.showWarningMessage("UsageSentinel: API key not configured");
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "UsageSentinel: Refreshing usage...",
      cancellable: false,
    },
    async () => {
      try {
        await sidebarProvider.refresh();
        vscode.window.showInformationMessage("UsageSentinel: Usage refreshed");
      } catch (error) {
        vscode.window.showErrorMessage(
          `UsageSentinel: Failed to refresh usage: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
  );
}
