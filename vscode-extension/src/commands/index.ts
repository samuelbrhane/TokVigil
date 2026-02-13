import * as vscode from "vscode";
import { TokVigilApiClient } from "../api/client";
import { SidebarProvider } from "../panels/SidebarProvider";

import { testEvaluate } from "./evaluate";
import { openDashboard, openDocs, openApiReference } from "./openDashboard";
import { setApiKeyCommand } from "./setApiKey";
import { refreshUsage } from "./refreshUsage";
import { insertSnippet } from "./insertSnippet";

export function registerCommands(
  context: vscode.ExtensionContext,
  apiClient: TokVigilApiClient,
  sidebarProvider: SidebarProvider,
): void {
  // Test Evaluate
  context.subscriptions.push(
    vscode.commands.registerCommand("tokvigil.testEvaluate", () =>
      testEvaluate(apiClient),
    ),
  );

  // Open Dashboard
  context.subscriptions.push(
    vscode.commands.registerCommand("tokvigil.openDashboard", openDashboard),
  );

  // Open Docs
  context.subscriptions.push(
    vscode.commands.registerCommand("tokvigil.openDocs", openDocs),
  );

  // Open API Reference
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "tokvigil.openApiReference",
      openApiReference,
    ),
  );

  // Set API Key
  context.subscriptions.push(
    vscode.commands.registerCommand("tokvigil.setApiKey", () =>
      setApiKeyCommand(apiClient, sidebarProvider),
    ),
  );

  // Refresh Usage
  context.subscriptions.push(
    vscode.commands.registerCommand("tokvigil.refreshUsage", () =>
      refreshUsage(apiClient, sidebarProvider),
    ),
  );

  // Insert Snippet
  context.subscriptions.push(
    vscode.commands.registerCommand("tokvigil.insertSnippet", insertSnippet),
  );
}
