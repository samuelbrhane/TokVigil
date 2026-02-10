import * as vscode from "vscode";
import { getConfig, setEnvironment } from "../config/settings";

export async function switchEnvironment(): Promise<void> {
  const config = getConfig();

  const environments = [
    {
      label: "$(server) Development",
      description: config.environment === "development" ? "(current)" : "",
      value: "development" as const,
    },
    {
      label: "$(server-environment) Staging",
      description: config.environment === "staging" ? "(current)" : "",
      value: "staging" as const,
    },
    {
      label: "$(cloud) Production",
      description: config.environment === "production" ? "(current)" : "",
      value: "production" as const,
    },
  ];

  const selected = await vscode.window.showQuickPick(environments, {
    placeHolder: "Select environment",
    title: "TokenFence: Switch Environment",
  });

  if (selected) {
    await setEnvironment(selected.value);
    vscode.window.showInformationMessage(
      `TokenFence: Switched to ${selected.value} environment`,
    );
  }
}
