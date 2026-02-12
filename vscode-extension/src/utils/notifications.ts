import * as vscode from "vscode";

export function showInfo(message: string): void {
  vscode.window.showInformationMessage(`UsageSentinel: ${message}`);
}

export function showWarning(message: string): void {
  vscode.window.showWarningMessage(`UsageSentinel: ${message}`);
}

export function showError(message: string): void {
  vscode.window.showErrorMessage(`UsageSentinel: ${message}`);
}

export async function showInfoWithAction(
  message: string,
  ...actions: string[]
): Promise<string | undefined> {
  return await vscode.window.showInformationMessage(
    `UsageSentinel: ${message}`,
    ...actions,
  );
}

export async function showWarningWithAction(
  message: string,
  ...actions: string[]
): Promise<string | undefined> {
  return await vscode.window.showWarningMessage(
    `UsageSentinel: ${message}`,
    ...actions,
  );
}

export async function showErrorWithAction(
  message: string,
  ...actions: string[]
): Promise<string | undefined> {
  return await vscode.window.showErrorMessage(
    `UsageSentinel: ${message}`,
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
      title: `UsageSentinel: ${title}`,
      cancellable: false,
    },
    task,
  );
}
