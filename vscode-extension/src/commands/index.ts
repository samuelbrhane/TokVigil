import * as vscode from "vscode";
import { UsageSentinelApiClient } from "../api/client";
import { SidebarProvider } from "../panels/SidebarProvider";

import { testEvaluate } from "./evaluate";
import { openDashboard, openDocs, openApiReference } from "./openDashboard";
import { setApiKeyCommand } from "./setApiKey";
import { refreshUsage } from "./refreshUsage";
import { insertSnippet } from "./insertSnippet";

export function registerCommands(
  context: vscode.ExtensionContext,
  apiClient: UsageSentinelApiClient,
  sidebarProvider: SidebarProvider,
): void {
  // Test Evaluate
  context.subscriptions.push(
    vscode.commands.registerCommand("tokenfence.testEvaluate", () =>
      testEvaluate(apiClient),
    ),
  );

  // Open Dashboard
  context.subscriptions.push(
    vscode.commands.registerCommand("tokenfence.openDashboard", openDashboard),
  );

  // Open Docs
  context.subscriptions.push(
    vscode.commands.registerCommand("tokenfence.openDocs", openDocs),
  );

  // Open API Reference
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "tokenfence.openApiReference",
      openApiReference,
    ),
  );

  // Set API Key
  context.subscriptions.push(
    vscode.commands.registerCommand("tokenfence.setApiKey", () =>
      setApiKeyCommand(apiClient, sidebarProvider),
    ),
  );

  // Refresh Usage
  context.subscriptions.push(
    vscode.commands.registerCommand("tokenfence.refreshUsage", () =>
      refreshUsage(apiClient, sidebarProvider),
    ),
  );

  // Insert Snippet
  context.subscriptions.push(
    vscode.commands.registerCommand("tokenfence.insertSnippet", insertSnippet),
  );
}
