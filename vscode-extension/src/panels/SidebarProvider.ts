import * as vscode from "vscode";
import { TokenFenceApiClient } from "../api/client";
import { getConfig } from "../config/settings";
import { UsageSummary, UsageByGroup } from "../types";

export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "tokenfence-sidebar";

  private _view?: vscode.WebviewView;
  private _extensionUri: vscode.Uri;
  private _apiClient: TokenFenceApiClient;

  constructor(extensionUri: vscode.Uri, apiClient: TokenFenceApiClient) {
    this._extensionUri = extensionUri;
    this._apiClient = apiClient;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlContent(webviewView.webview);

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case "refresh":
          await this.refresh();
          break;
        case "openDashboard":
          vscode.commands.executeCommand("tokenfence.openDashboard");
          break;
        case "openDocs":
          vscode.commands.executeCommand("tokenfence.openDocs");
          break;
        case "setApiKey":
          vscode.commands.executeCommand("tokenfence.setApiKey");
          break;
        case "switchEnvironment":
          vscode.commands.executeCommand("tokenfence.switchEnvironment");
          break;
        case "testEvaluate":
          vscode.commands.executeCommand("tokenfence.testEvaluate");
          break;
        case "insertSnippet":
          vscode.commands.executeCommand("tokenfence.insertSnippet");
          break;
      }
    });

    // Initial load
    this.refresh();
  }

  public async refresh(): Promise<void> {
    if (!this._view) {
      return;
    }

    const config = getConfig();

    if (!config.apiKey) {
      this._view.webview.postMessage({
        command: "updateData",
        data: {
          hasApiKey: false,
          environment: config.environment,
        },
      });
      return;
    }

    try {
      const [summary, byUser, byFeature] = await Promise.all([
        this._apiClient.getUsageSummary(),
        this._apiClient.getUsageByUser(1, 5),
        this._apiClient.getUsageByFeature(1, 5),
      ]);

      this._view.webview.postMessage({
        command: "updateData",
        data: {
          hasApiKey: true,
          environment: config.environment,
          summary,
          byUser: byUser.items,
          byFeature: byFeature.items,
        },
      });
    } catch (error) {
      this._view.webview.postMessage({
        command: "updateData",
        data: {
          hasApiKey: true,
          environment: config.environment,
          error: error instanceof Error ? error.message : "Failed to load data",
        },
      });
    }
  }

  private _getHtmlContent(webview: vscode.Webview): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TokenFence</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-sideBar-background);
            padding: 12px;
          }

          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--vscode-panel-border);
          }

          .header h1 {
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .header-actions {
            display: flex;
            gap: 4px;
          }

          .icon-btn {
            background: none;
            border: none;
            color: var(--vscode-foreground);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .icon-btn:hover {
            background: var(--vscode-toolbar-hoverBackground);
          }

          .environment-badge {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            text-transform: uppercase;
          }

          .environment-badge.development {
            background: #4caf50;
          }

          .environment-badge.staging {
            background: #ff9800;
          }

          .environment-badge.production {
            background: #f44336;
          }

          .section {
            margin-bottom: 16px;
          }

          .section-title {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
          }

          .card {
            background: var(--vscode-editor-background);
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 8px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .stat {
            text-align: center;
            padding: 8px;
            background: var(--vscode-sideBar-background);
            border-radius: 4px;
          }

          .stat-value {
            font-size: 18px;
            font-weight: 600;
            color: var(--vscode-foreground);
          }

          .stat-label {
            font-size: 10px;
            color: var(--vscode-descriptionForeground);
            margin-top: 2px;
          }

          .stat.full-width {
            grid-column: span 2;
          }

          .list {
            list-style: none;
          }

          .list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid var(--vscode-panel-border);
          }

          .list-item:last-child {
            border-bottom: none;
          }

          .list-item-name {
            font-size: 12px;
            color: var(--vscode-foreground);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 120px;
          }

          .list-item-value {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
          }

          .btn {
            width: 100%;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-bottom: 6px;
          }

          .btn-primary {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
          }

          .btn-primary:hover {
            background: var(--vscode-button-hoverBackground);
          }

          .btn-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
          }

          .btn-secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
          }

          .no-api-key {
            text-align: center;
            padding: 20px;
          }

          .no-api-key p {
            margin-bottom: 12px;
            color: var(--vscode-descriptionForeground);
          }

          .error {
            color: var(--vscode-errorForeground);
            font-size: 12px;
            padding: 8px;
            background: var(--vscode-inputValidation-errorBackground);
            border-radius: 4px;
            margin-bottom: 12px;
          }

          .loading {
            text-align: center;
            padding: 20px;
            color: var(--vscode-descriptionForeground);
          }

          .quick-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
          }

          .quick-actions .btn {
            margin-bottom: 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>
            <span>⚡</span> TokenFence
          </h1>
          <div class="header-actions">
            <button class="icon-btn" onclick="refresh()" title="Refresh">
              🔄
            </button>
            <button class="icon-btn" onclick="openDashboard()" title="Open Dashboard">
              🌐
            </button>
          </div>
        </div>

        <div id="content">
          <div class="loading">Loading...</div>
        </div>

        <script>
          const vscode = acquireVsCodeApi();

          let currentData = null;

          function refresh() {
            vscode.postMessage({ command: 'refresh' });
          }

          function openDashboard() {
            vscode.postMessage({ command: 'openDashboard' });
          }

          function openDocs() {
            vscode.postMessage({ command: 'openDocs' });
          }

          function setApiKey() {
            vscode.postMessage({ command: 'setApiKey' });
          }

          function switchEnvironment() {
            vscode.postMessage({ command: 'switchEnvironment' });
          }

          function testEvaluate() {
            vscode.postMessage({ command: 'testEvaluate' });
          }

          function insertSnippet() {
            vscode.postMessage({ command: 'insertSnippet' });
          }

          function formatNumber(num) {
            if (num >= 1000000) {
              return (num / 1000000).toFixed(1) + 'M';
            }
            if (num >= 1000) {
              return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
          }

          function renderContent(data) {
            const content = document.getElementById('content');

            if (!data.hasApiKey) {
              content.innerHTML = \`
                <div class="no-api-key">
                  <p>🔑 API key not configured</p>
                  <button class="btn btn-primary" onclick="setApiKey()">
                    Set API Key
                  </button>
                  <button class="btn btn-secondary" onclick="openDocs()">
                    View Documentation
                  </button>
                </div>
              \`;
              return;
            }

            if (data.error) {
              content.innerHTML = \`
                <div class="error">\${data.error}</div>
                <button class="btn btn-secondary" onclick="refresh()">
                  Try Again
                </button>
              \`;
              return;
            }

            const summary = data.summary || {};
            const byUser = data.byUser || [];
            const byFeature = data.byFeature || [];

            content.innerHTML = \`
              <div class="section">
                <div class="section-title">
                  Environment
                  <span class="environment-badge \${data.environment}">\${data.environment}</span>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Usage Summary</div>
                <div class="card">
                  <div class="stats-grid">
                    <div class="stat">
                      <div class="stat-value">\${formatNumber(summary.totalRequests || 0)}</div>
                      <div class="stat-label">Requests</div>
                    </div>
                    <div class="stat">
                      <div class="stat-value">\${formatNumber(summary.totalTokens || 0)}</div>
                      <div class="stat-label">Tokens</div>
                    </div>
                    <div class="stat">
                      <div class="stat-value">$\${(summary.totalCostUsd || 0).toFixed(2)}</div>
                      <div class="stat-label">Cost</div>
                    </div>
                    <div class="stat">
                      <div class="stat-value">\${summary.blockedCount || 0}</div>
                      <div class="stat-label">Blocked</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Top Users</div>
                <div class="card">
                  \${byUser.length > 0 ? \`
                    <ul class="list">
                      \${byUser.map(user => \`
                        <li class="list-item">
                          <span class="list-item-name">\${user.group}</span>
                          <span class="list-item-value">\${formatNumber(user.requests)} req</span>
                        </li>
                      \`).join('')}
                    </ul>
                  \` : '<p style="font-size: 12px; color: var(--vscode-descriptionForeground);">No data yet</p>'}
                </div>
              </div>

              <div class="section">
                <div class="section-title">Top Features</div>
                <div class="card">
                  \${byFeature.length > 0 ? \`
                    <ul class="list">
                      \${byFeature.map(feature => \`
                        <li class="list-item">
                          <span class="list-item-name">\${feature.group}</span>
                          <span class="list-item-value">\${formatNumber(feature.requests)} req</span>
                        </li>
                      \`).join('')}
                    </ul>
                  \` : '<p style="font-size: 12px; color: var(--vscode-descriptionForeground);">No data yet</p>'}
                </div>
              </div>

              <div class="section">
                <div class="section-title">Quick Actions</div>
                <div class="quick-actions">
                  <button class="btn btn-secondary" onclick="testEvaluate()">
                    ▶️ Test
                  </button>
                  <button class="btn btn-secondary" onclick="insertSnippet()">
                    📝 Snippet
                  </button>
                  <button class="btn btn-secondary" onclick="switchEnvironment()">
                    🔀 Env
                  </button>
                  <button class="btn btn-secondary" onclick="openDashboard()">
                    📊 Dashboard
                  </button>
                </div>
              </div>
            \`;
          }

          window.addEventListener('message', event => {
            const message = event.data;
            
            if (message.command === 'updateData') {
              currentData = message.data;
              renderContent(currentData);
            }
          });
        </script>
      </body>
      </html>
    `;
  }
}
