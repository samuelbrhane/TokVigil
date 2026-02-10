import * as vscode from "vscode";
import { TokenFenceConfig } from "../types";
import { DEFAULT_BASE_URL } from "./constants";

export function getConfig(): TokenFenceConfig {
  const config = vscode.workspace.getConfiguration("tokenfence");

  return {
    apiKey: config.get<string>("apiKey") || "",
    baseUrl: config.get<string>("baseUrl") || DEFAULT_BASE_URL,
  };
}

export async function setApiKey(apiKey: string): Promise<void> {
  const config = vscode.workspace.getConfiguration("tokenfence");
  await config.update("apiKey", apiKey, vscode.ConfigurationTarget.Global);
}

export async function setBaseUrl(baseUrl: string): Promise<void> {
  const config = vscode.workspace.getConfiguration("tokenfence");
  await config.update("baseUrl", baseUrl, vscode.ConfigurationTarget.Global);
}

export function isAutocompleteEnabled(): boolean {
  const config = vscode.workspace.getConfiguration("tokenfence");
  return config.get<boolean>("enableAutocomplete") ?? true;
}

export function isHoverEnabled(): boolean {
  const config = vscode.workspace.getConfiguration("tokenfence");
  return config.get<boolean>("enableHover") ?? true;
}

export function isDiagnosticsEnabled(): boolean {
  const config = vscode.workspace.getConfiguration("tokenfence");
  return config.get<boolean>("enableDiagnostics") ?? true;
}

export function isStatusBarEnabled(): boolean {
  const config = vscode.workspace.getConfiguration("tokenfence");
  return config.get<boolean>("showStatusBar") ?? true;
}
