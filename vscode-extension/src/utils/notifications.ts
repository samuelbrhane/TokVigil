import * as vscode from "vscode";

export function showInfo(message: string): void {
  vscode.window.showInformationMessage(`TokVigil: ${message}`);
}

export function showWarning(message: string): void {
  vscode.window.showWarningMessage(`TokVigil: ${message}`);
}

export function showError(message: string): void {
  vscode.window.showErrorMessage(`TokVigil: ${message}`);
}

export async function showInfoWithAction(
  message: string,
  ...actions: string[]
): Promise<string | undefined> {
  return await vscode.window.showInformationMessage(
    `TokVigil: ${message}`,
    ...actions,
  );
}

export async function showWarningWithAction(
  message: string,
  ...actions: string[]
): Promise<string | undefined> {
  return await vscode.window.showWarningMessage(
    `TokVigil: ${message}`,
    ...actions,
  );
}

export async function showErrorWithAction(
  message: string,
  ...actions: string[]
): Promise<string | undefined> {
  return await vscode.window.showErrorMessage(
    `TokVigil: ${message}`,
    ...actions,
  );
}

export async function showProgress<T>(
  title: string,
  task: () => Promise<T>,
): Promise<T> {
  return await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `TokVigil: ${title}`,
      cancellable: false,
    },
    task,
  );
}
