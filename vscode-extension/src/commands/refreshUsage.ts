import * as vscode from "vscode";
import { TokVigilApiClient } from "../api/client";
import { SidebarProvider } from "../panels/SidebarProvider";
import { getConfig } from "../config/settings";

export async function refreshUsage(
  apiClient: TokVigilApiClient,
  sidebarProvider: SidebarProvider,
): Promise<void> {
  const config = getConfig();

  if (!config.apiKey) {
    vscode.window.showWarningMessage("TokVigil: API key not configured");
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "TokVigil: Refreshing usage...",
      cancellable: false,
    },
    async () => {
      try {
        await sidebarProvider.refresh();
        vscode.window.showInformationMessage("TokVigil: Usage refreshed");
      } catch (error) {
        vscode.window.showErrorMessage(
          `TokVigil: Failed to refresh usage: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
  );
}
