import * as vscode from "vscode";

const SECRET_KEY = "usagesentinel.apiKey";

export class keyStorage {
  private secretStorage: vscode.SecretStorage;

  constructor(context: vscode.ExtensionContext) {
    this.secretStorage = context.secrets;
  }

  async getApiKey(): Promise<string | undefined> {
    return await this.secretStorage.get(SECRET_KEY);
  }

  async setApiKey(apiKey: string): Promise<void> {
    await this.secretStorage.store(SECRET_KEY, apiKey);
  }

  async deleteApiKey(): Promise<void> {
    await this.secretStorage.delete(SECRET_KEY);
  }
}
