import * as vscode from "vscode";
import { getConfig, isStatusBarEnabled } from "./config/settings";
import { EXTENSION_NAME, SUPPORTED_LANGUAGES } from "./config/constants";

// Providers
import { CompletionProvider } from "./providers/completionProvider";
import { HoverProvider } from "./providers/hoverProvider";
import { DiagnosticProvider } from "./providers/diagnosticProvider";

// Panels
import { SidebarProvider } from "./panels/SidebarProvider";

// Commands
import { registerCommands } from "./commands";

// API
import { TokVigilApiClient } from "./api/client";

let statusBarItem: vscode.StatusBarItem;
let diagnosticCollection: vscode.DiagnosticCollection;
let apiClient: TokVigilApiClient;

export function activate(context: vscode.ExtensionContext) {
  console.log(`${EXTENSION_NAME} is now active!`);

  // Initialize API client
  const config = getConfig();
  apiClient = new TokVigilApiClient(config);

  // Register sidebar
  const sidebarProvider = new SidebarProvider(context.extensionUri, apiClient);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "tokvigil-sidebar",
      sidebarProvider,
    ),
  );

  // Register providers for each supported language
  const languageSelector = SUPPORTED_LANGUAGES.map((lang) => ({
    language: lang,
    scheme: "file",
  }));

  // Completion provider (autocomplete)
  const completionProvider = new CompletionProvider();
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      languageSelector,
      completionProvider,
      ".",
    ),
  );

  // Hover provider
  const hoverProvider = new HoverProvider();
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(languageSelector, hoverProvider),
  );

  // Diagnostic provider (inline validation)
  diagnosticCollection =
    vscode.languages.createDiagnosticCollection("tokvigil");
  context.subscriptions.push(diagnosticCollection);

  const diagnosticProvider = new DiagnosticProvider(diagnosticCollection);
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) =>
      diagnosticProvider.updateDiagnostics(e.document),
    ),
  );
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((doc) =>
      diagnosticProvider.updateDiagnostics(doc),
    ),
  );

  // Register commands
  registerCommands(context, apiClient, sidebarProvider);

  // Status bar
  if (isStatusBarEnabled()) {
    statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100,
    );
    statusBarItem.command = "tokvigil.openDashboard";
    statusBarItem.text = "$(pulse) TokVigil";
    statusBarItem.tooltip = "Click to open TokVigil dashboard";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Update status bar with usage
    updateStatusBar();
  }

  // Listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("tokvigil")) {
        const newConfig = getConfig();
        apiClient.updateConfig(newConfig);
        updateStatusBar();
      }
    }),
  );
}

async function updateStatusBar() {
  if (!statusBarItem) return;

  const config = getConfig();
  if (!config.apiKey) {
    statusBarItem.text = "$(key) TokVigil: Set API Key";
    statusBarItem.tooltip = "Click to set your API key";
    return;
  }

  try {
    const summary = await apiClient.getUsageSummary();
    statusBarItem.text = `$(pulse) ${summary.totalRequests} requests`;
    statusBarItem.tooltip = `TokVigil Usage:\n${summary.totalRequests} requests\n${summary.totalTokens} tokens\n$${summary.totalCostUsd.toFixed(2)} cost`;
  } catch (error) {
    statusBarItem.text = "$(pulse) TokVigil";
    statusBarItem.tooltip = "TokVigil - Click to open dashboard";
  }
}

export function deactivate() {
  console.log(`${EXTENSION_NAME} is now deactivated`);
}
