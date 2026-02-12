import * as vscode from "vscode";

export class CodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken,
  ): vscode.CodeAction[] | undefined {
    const actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      if (diagnostic.message.includes("not imported")) {
        const action = this.createImportFix(document, diagnostic);
        if (action) {
          actions.push(action);
        }
      }

      if (diagnostic.message.includes("API key is empty")) {
        const action = this.createSetApiKeyAction();
        if (action) {
          actions.push(action);
        }
      }
    }

    return actions;
  }

  private createImportFix(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic,
  ): vscode.CodeAction | undefined {
    const languageId = document.languageId;
    let importStatement: string;

    if (languageId === "python") {
      importStatement = "from usagesentinel import UsageSentinel\n";
    } else {
      importStatement = 'import { UsageSentinel } from "usagesentinel";\n';
    }

    const action = new vscode.CodeAction(
      "Add UsageSentinel import",
      vscode.CodeActionKind.QuickFix,
    );

    action.edit = new vscode.WorkspaceEdit();
    action.edit.insert(
      document.uri,
      new vscode.Position(0, 0),
      importStatement,
    );

    action.diagnostics = [diagnostic];
    action.isPreferred = true;

    return action;
  }

  private createSetApiKeyAction(): vscode.CodeAction {
    const action = new vscode.CodeAction(
      "Set UsageSentinel API Key",
      vscode.CodeActionKind.QuickFix,
    );

    action.command = {
      command: "usagesentinel.setApiKey",
      title: "Set API Key",
    };

    return action;
  }
}
