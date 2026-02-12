import * as vscode from "vscode";
import { getConfig } from "../config/settings";

export async function openDashboard(): Promise<void> {
  const config = getConfig();

  let dashboardUrl = "https://tokenfence.io/dashboard";

  if (config.baseUrl.includes("localhost")) {
    dashboardUrl = "http://localhost:3000/dashboard";
  }

  await vscode.env.openExternal(vscode.Uri.parse(dashboardUrl));
}

export async function openDocs(): Promise<void> {
  await vscode.env.openExternal(vscode.Uri.parse("https://tokenfence.io/docs"));
}

export async function openApiReference(): Promise<void> {
  const config = getConfig();

  let docsUrl = "https://api.tokenfence.io/docs";

  if (config.baseUrl.includes("localhost")) {
    docsUrl = `${config.baseUrl}/docs`;
  }

  await vscode.env.openExternal(vscode.Uri.parse(docsUrl));
}
