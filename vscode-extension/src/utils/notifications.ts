import * as vscode from "vscode";

export function showInfo(message: string): void {
  vscode.window.showInformationMessage(`TokenFence: ${message}`);
}

export function showWarning(message: string): void {
  vscode.window.showWarningMessage(`TokenFence: ${message}`);
}

export function showError(message: string): void {
  vscode.window.showErrorMessage(`TokenFence: ${message}`);
}

export async function showInfoWithAction(
  message: string,
  ...actions: string[]
): Promise<string | undefined> {
  return await vscode.window.showInformationMessage(
    `TokenFence: ${message}`,
    ...actions,
  );
}

export async function showWarningWithAction(
  message: string,
  ...actions: string[]
): Promise<string | undefined> {
  return await vscode.window.showWarningMessage(
    `TokenFence: ${message}`,
    ...actions,
  );
}

export async function showErrorWithAction(
  message: string,
  ...actions: string[]
): Promise<string | undefined> {
  return await vscode.window.showErrorMessage(
    `TokenFence: ${message}`,
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
      title: `TokenFence: ${title}`,
      cancellable: false,
    },
    task,
  );
}
