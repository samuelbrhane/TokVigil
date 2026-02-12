# UsageSentinel VS Code Extension

AI usage control for VS Code — manage rate limits, budgets, and policies for your AI-powered applications.

## Features

### Code Snippets

Quickly insert UsageSentinel code with snippets:

| Prefix        | Description              |
| ------------- | ------------------------ |
| `tfimport`    | Import UsageSentinel SDK |
| `tfinit`      | Initialize client        |
| `tfeval`      | Evaluate request         |
| `tflog`       | Log usage                |
| `tfflow`      | Complete flow            |
| `tfcheck`     | Check and call           |
| `tferror`     | Error handling           |
| `tfsummary`   | Get usage summary        |
| `tfbyuser`    | Get usage by user        |
| `tfbyfeature` | Get usage by feature     |
| `tfblocked`   | Get blocked requests     |
| `tfrecent`    | Get recent usage         |

### Autocomplete

Get intelligent suggestions when typing `us.`:

- `evaluate()` — Check if request is allowed
- `logUsage()` — Log AI usage
- `checkAndCall()` — Evaluate, call, and log in one step
- `getUsageSummary()` — Get usage stats
- And more...

### Hover Documentation

Hover over any UsageSentinel method to see documentation and parameter info.

### Inline Validation

Get real-time warnings for:

- Missing UsageSentinel import
- Empty or placeholder API keys
- Missing required parameters

### Sidebar Panel

View your usage stats directly in VS Code:

- Total requests, tokens, and cost
- Top users and features
- Quick actions

### Commands

Access via Command Palette (`Ctrl+Shift+P`):

| Command                         | Description                          |
| ------------------------------- | ------------------------------------ |
| `UsageSentinel: Set API Key`    | Configure API key                    |
| `UsageSentinel: Test Evaluate`  | Test evaluate with custom parameters |
| `UsageSentinel: Open Dashboard` | Open web dashboard                   |
| `UsageSentinel: Insert Snippet` | Insert code snippet                  |
| `UsageSentinel: Refresh Usage`  | Refresh usage stats                  |

## Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "UsageSentinel"
4. Click Install

## Configuration

Open Settings (`Ctrl+,`) and search for "UsageSentinel":

| Setting                            | Description              | Default                         |
| ---------------------------------- | ------------------------ | ------------------------------- |
| `usagesentinel.apiKey`             | Your API key             | —                               |
| `usagesentinel.baseUrl`            | API base URL             | `https://api.usagesentinel.com` |
| `usagesentinel.environment`        | Current environment      | `development`                   |
| `usagesentinel.showStatusBar`      | Show status bar item     | `true`                          |
| `usagesentinel.enableAutocomplete` | Enable autocomplete      | `true`                          |
| `usagesentinel.enableHover`        | Enable hover docs        | `true`                          |
| `usagesentinel.enableDiagnostics`  | Enable inline validation | `true`                          |

## Getting Started

1. Install the extension
2. Set your API key: `Ctrl+Shift+P` → "UsageSentinel: Set API Key"
3. Start coding with snippets: type `tfinit` and press Tab

## Links

- [Documentation](https://usagesentinel.com/docs)
- [Dashboard](https://usagesentinel.com/dashboard)
