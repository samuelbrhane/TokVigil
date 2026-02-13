import * as vscode from "vscode";
import { SDK_METHODS } from "../config/constants";
import { isAutocompleteEnabled } from "../config/settings";

export class CompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext,
  ): vscode.CompletionItem[] | undefined {
    if (!isAutocompleteEnabled()) {
      return undefined;
    }

    const lineText = document.lineAt(position).text;
    const linePrefix = lineText.substring(0, position.character);

    // Check if user is typing after "tv." or "tokvigil."
    const tfMatch = linePrefix.match(/(tf|tokvigil|client)\.\s*$/i);
    if (!tfMatch) {
      return undefined;
    }

    const completionItems: vscode.CompletionItem[] = [];

    for (const method of SDK_METHODS) {
      const item = new vscode.CompletionItem(
        method.name,
        vscode.CompletionItemKind.Method,
      );

      item.detail = method.signature;
      item.documentation = new vscode.MarkdownString(
        this.buildDocumentation(method),
      );

      // Build snippet
      const snippet = this.buildSnippet(method, document.languageId);
      item.insertText = new vscode.SnippetString(snippet);

      item.sortText = `0${method.name}`; // Prioritize in list

      completionItems.push(item);
    }

    return completionItems;
  }

  private buildDocumentation(method: (typeof SDK_METHODS)[0]): string {
    let doc = `**${method.name}**\n\n${method.description}\n\n`;

    doc += "**Parameters:**\n\n";
    for (const param of method.params) {
      const required = param.required ? "(required)" : "(optional)";
      doc += `- \`${param.name}\`: \`${param.type}\` ${required} - ${param.description}\n`;
    }

    return doc;
  }

  private buildSnippet(
    method: (typeof SDK_METHODS)[0],
    languageId: string,
  ): string {
    const requiredParams = method.params.filter((p) => p.required);

    if (languageId === "python") {
      return this.buildPythonSnippet(method.name, requiredParams);
    } else {
      return this.buildTypeScriptSnippet(method.name, requiredParams);
    }
  }

  private buildPythonSnippet(
    methodName: string,
    params: { name: string }[],
  ): string {
    if (params.length === 0) {
      return `${methodName}()`;
    }

    const paramSnippets = params.map((p, i) => {
      const snakeName = p.name.replace(/([A-Z])/g, "_$1").toLowerCase();
      return `${snakeName}="\${${i + 1}:${p.name}}"`;
    });

    return `${methodName}(\n    ${paramSnippets.join(",\n    ")}\n)`;
  }

  private buildTypeScriptSnippet(
    methodName: string,
    params: { name: string }[],
  ): string {
    if (params.length === 0) {
      return `${methodName}()`;
    }

    const paramSnippets = params.map(
      (p, i) => `${p.name}: "\${${i + 1}:${p.name}}"`,
    );

    return `${methodName}({\n    ${paramSnippets.join(",\n    ")}\n})`;
  }
}
