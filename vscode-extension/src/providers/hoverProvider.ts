import * as vscode from "vscode";
import { SDK_METHODS, REASON_CODES } from "../config/constants";
import { isHoverEnabled } from "../config/settings";

export class HoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.Hover | undefined {
    if (!isHoverEnabled()) {
      return undefined;
    }

    const range = document.getWordRangeAtPosition(position);
    if (!range) {
      return undefined;
    }

    const word = document.getText(range);

    // Check if it's a SDK method
    const method = SDK_METHODS.find((m) => m.name === word);
    if (method) {
      return this.buildMethodHover(method);
    }

    // Check if it's a reason code
    const reasonCode = Object.entries(REASON_CODES).find(
      ([code]) => code === word,
    );
    if (reasonCode) {
      return this.buildReasonCodeHover(reasonCode[0], reasonCode[1]);
    }

    // Check for UsageSentinel class
    if (word === "UsageSentinel") {
      return this.buildClassHover();
    }

    return undefined;
  }

  private buildMethodHover(method: (typeof SDK_METHODS)[0]): vscode.Hover {
    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown(`### ${method.name}\n\n`);
    markdown.appendMarkdown(`${method.description}\n\n`);
    markdown.appendCodeblock(method.signature, "typescript");
    markdown.appendMarkdown("\n**Parameters:**\n\n");

    for (const param of method.params) {
      const required = param.required ? "*(required)*" : "*(optional)*";
      markdown.appendMarkdown(
        `- \`${param.name}\` (${param.type}) ${required}: ${param.description}\n`,
      );
    }

    markdown.isTrusted = true;

    return new vscode.Hover(markdown);
  }

  private buildReasonCodeHover(
    code: string,
    description: string,
  ): vscode.Hover {
    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown(`### Reason Code: \`${code}\`\n\n`);
    markdown.appendMarkdown(`${description}\n\n`);

    if (code.includes("LIMIT_EXCEEDED") || code.includes("BUDGET_EXCEEDED")) {
      markdown.appendMarkdown(
        "*The request was blocked because a limit was reached.*\n",
      );
    } else if (code === "MODEL_NOT_ALLOWED") {
      markdown.appendMarkdown(
        "*The requested model is not allowed by the policy.*\n",
      );
    } else if (code === "ALLOWED" || code === "NO_POLICY") {
      markdown.appendMarkdown("*The request was allowed to proceed.*\n");
    }

    return new vscode.Hover(markdown);
  }

  private buildClassHover(): vscode.Hover {
    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown("### UsageSentinel\n\n");
    markdown.appendMarkdown(
      "AI usage control client for managing rate limits, budgets, and policies.\n\n",
    );
    markdown.appendMarkdown("**Quick Start:**\n\n");

    markdown.appendCodeblock(
      `from usagesentinel import UsageSentinel

us = UsageSentinel(api_key="us_live_xxx")

result = us.evaluate(
    user_id="user_123",
    model="gpt-4o-mini"
)

if result.allowed:
    # Make AI call
    pass`,
      "python",
    );

    markdown.isTrusted = true;

    return new vscode.Hover(markdown);
  }
}
