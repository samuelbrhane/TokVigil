import * as vscode from "vscode";
import { isDiagnosticsEnabled } from "../config/settings";

export class DiagnosticProvider {
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor(diagnosticCollection: vscode.DiagnosticCollection) {
    this.diagnosticCollection = diagnosticCollection;
  }

  updateDiagnostics(document: vscode.TextDocument): void {
    if (!isDiagnosticsEnabled()) {
      this.diagnosticCollection.delete(document.uri);
      return;
    }

    const languageId = document.languageId;
    if (!["python", "typescript", "javascript"].includes(languageId)) {
      return;
    }

    const text = document.getText();
    const diagnostics: vscode.Diagnostic[] = [];

    // Check for UsageSentinel import/usage
    const hasUsageSentinelImport = this.hasUsageSentinelImport(
      text,
      languageId,
    );
    const hasUsageSentinelUsage = this.hasUsageSentinelUsage(text);

    if (hasUsageSentinelUsage && !hasUsageSentinelImport) {
      const usageMatch = text.match(
        /(UsageSentinel|tf\.evaluate|tf\.logUsage)/,
      );
      if (usageMatch && usageMatch.index !== undefined) {
        const position = document.positionAt(usageMatch.index);
        const range = new vscode.Range(
          position,
          position.translate(0, usageMatch[0].length),
        );

        diagnostics.push(
          new vscode.Diagnostic(
            range,
            "UsageSentinel is used but not imported. Add: from tokenfence import UsageSentinel",
            vscode.DiagnosticSeverity.Warning,
          ),
        );
      }
    }

    // Check for empty API key
    const emptyKeyPatterns = [
      /api_key\s*=\s*["']["']/,
      /apiKey:\s*["']["']/,
      /api_key\s*=\s*["']YOUR_KEY_HERE["']/i,
      /apiKey:\s*["']YOUR_KEY_HERE["']/i,
    ];

    for (const pattern of emptyKeyPatterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined) {
        const position = document.positionAt(match.index);
        const range = new vscode.Range(
          position,
          position.translate(0, match[0].length),
        );

        diagnostics.push(
          new vscode.Diagnostic(
            range,
            "API key is empty or placeholder. Set your actual UsageSentinel API key.",
            vscode.DiagnosticSeverity.Error,
          ),
        );
      }
    }

    // Check for missing required parameters in evaluate()
    const evaluatePatterns = [/\.evaluate\(\s*\)/, /\.evaluate\(\s*{\s*}\s*\)/];

    for (const pattern of evaluatePatterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined) {
        const position = document.positionAt(match.index);
        const range = new vscode.Range(
          position,
          position.translate(0, match[0].length),
        );

        diagnostics.push(
          new vscode.Diagnostic(
            range,
            "evaluate() requires at least userId and model parameters",
            vscode.DiagnosticSeverity.Error,
          ),
        );
      }
    }

    // Check for missing required parameters in logUsage()
    const logUsagePatterns = [/\.logUsage\(\s*\)/, /\.logUsage\(\s*{\s*}\s*\)/];

    for (const pattern of logUsagePatterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined) {
        const position = document.positionAt(match.index);
        const range = new vscode.Range(
          position,
          position.translate(0, match[0].length),
        );

        diagnostics.push(
          new vscode.Diagnostic(
            range,
            "logUsage() requires requestId, userId, model, inputTokens, and outputTokens parameters",
            vscode.DiagnosticSeverity.Error,
          ),
        );
      }
    }

    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  private hasUsageSentinelImport(text: string, languageId: string): boolean {
    if (languageId === "python") {
      return /from\s+tokenfence\s+import|import\s+tokenfence/.test(text);
    } else {
      return /import\s+.*UsageSentinel.*from\s+["']tokenfence["']|require\s*\(\s*["']tokenfence["']\s*\)/.test(
        text,
      );
    }
  }

  private hasUsageSentinelUsage(text: string): boolean {
    return /UsageSentinel|tf\.evaluate|tf\.logUsage|tf\.getUsageSummary/.test(
      text,
    );
  }
}
