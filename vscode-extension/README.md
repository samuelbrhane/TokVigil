# TokenFence VS Code Extension

AI usage control for VS Code - manage rate limits, budgets, and policies for your AI-powered applications.

## Features

### 🚀 Code Snippets

Quickly insert TokenFence code with snippets:

| Prefix      | Description           |
| ----------- | --------------------- |
| `tfimport`  | Import TokenFence SDK |
| `tfinit`    | Initialize client     |
| `tfeval`    | Evaluate request      |
| `tflog`     | Log usage             |
| `tfflow`    | Complete flow         |
| `tferror`   | Error handling        |
| `tfsummary` | Get usage summary     |

### 📝 Autocomplete

Get intelligent suggestions when typing `tf.`:

- `evaluate()` - Check if request is allowed
- `logUsage()` - Log AI usage
- `getUsageSummary()` - Get usage stats
- And more...

### 📚 Hover Documentation

Hover over any TokenFence method to see documentation and parameter info.

### ⚠️ Inline Validation

Get real-time warnings for:

- Missing TokenFence import
- Empty or placeholder API keys
- Missing required parameters

### 📊 Sidebar Panel

View your usage stats directly in VS Code:

- Total requests, tokens, and cost
- Top users and features
- Quick actions

### 🎮 Commands

Access via Command Palette (`Ctrl+Shift+P`):

| Command                           | Description                          |
| --------------------------------- | ------------------------------------ |
| `TokenFence: Test Evaluate`       | Test evaluate with custom parameters |
| `TokenFence: Open Dashboard`      | Open web dashboard                   |
| `TokenFence: Set API Key`         | Configure API key                    |
| `TokenFence: Switch Environment`  | Switch dev/staging/prod              |
| `TokenFence: Insert Code Snippet` | Insert code snippet                  |
| `TokenFence: Refresh Usage`       | Refresh usage stats                  |

## Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "TokenFence"
4. Click Install

## Configuration

Open Settings (`Ctrl+,`) and search for "TokenFence":

| Setting                         | Description              | Default                     |
| ------------------------------- | ------------------------ | --------------------------- |
| `tokenfence.apiKey`             | Your API key             | -                           |
| `tokenfence.baseUrl`            | API base URL             | `https://api.tokenfence.io` |
| `tokenfence.environment`        | Current environment      | `development`               |
| `tokenfence.showStatusBar`      | Show status bar item     | `true`                      |
| `tokenfence.enableAutocomplete` | Enable autocomplete      | `true`                      |
| `tokenfence.enableHover`        | Enable hover docs        | `true`                      |
| `tokenfence.enableDiagnostics`  | Enable inline validation | `true`                      |

## Getting Started

1. Install the extension
2. Set your API key: `Ctrl+Shift+P` → "TokenFence: Set API Key"
3. Start coding with snippets: Type `tfinit` and press Tab

## Links

- [Documentation](https://docs.tokenfence.io)
- [Dashboard](https://app.tokenfence.io)
- [GitHub](https://github.com/samuelbrhane/tokenfence)

## License

MIT
