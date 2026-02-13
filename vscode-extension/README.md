# TokVigil VS Code Extension

AI usage control for VS Code — manage rate limits, budgets, and policies for your AI-powered applications.

## Features

### Code Snippets

Quickly insert TokVigil code with snippets:

| Prefix        | Description          |
| ------------- | -------------------- |
| `tvimport`    | Import TokVigil SDK  |
| `tvinit`      | Initialize client    |
| `tveval`      | Evaluate request     |
| `tvlog`       | Log usage            |
| `tvflow`      | Complete flow        |
| `tvcheck`     | Check and call       |
| `tverror`     | Error handling       |
| `tvsummary`   | Get usage summary    |
| `tvbyuser`    | Get usage by user    |
| `tvbyfeature` | Get usage by feature |
| `tvblocked`   | Get blocked requests |
| `tvrecent`    | Get recent usage     |

### Autocomplete

Get intelligent suggestions when typing `tv.`:

- `evaluate()` — Check if request is allowed
- `logUsage()` — Log AI usage
- `checkAndCall()` — Evaluate, call, and log in one step
- `getUsageSummary()` — Get usage stats
- And more...

### Hover Documentation

Hover over any TokVigil method to see documentation and parameter info.

### Inline Validation

Get real-time warnings for:

- Missing TokVigil import
- Empty or placeholder API keys
- Missing required parameters

### Sidebar Panel

View your usage stats directly in VS Code:

- Total requests, tokens, and cost
- Top users and features
- Quick actions

### Commands

Access via Command Palette (`Ctrl+Shift+P`):

| Command                    | Description                          |
| -------------------------- | ------------------------------------ |
| `TokVigil: Set API Key`    | Configure API key                    |
| `TokVigil: Test Evaluate`  | Test evaluate with custom parameters |
| `TokVigil: Open Dashboard` | Open web dashboard                   |
| `TokVigil: Insert Snippet` | Insert code snippet                  |
| `TokVigil: Refresh Usage`  | Refresh usage stats                  |

## Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "TokVigil"
4. Click Install

## Configuration

Open Settings (`Ctrl+,`) and search for "TokVigil":

| Setting                       | Description              | Default                    |
| ----------------------------- | ------------------------ | -------------------------- |
| `tokvigil.apiKey`             | Your API key             | —                          |
| `tokvigil.baseUrl`            | API base URL             | `https://api.tokvigil.com` |
| `tokvigil.environment`        | Current environment      | `development`              |
| `tokvigil.showStatusBar`      | Show status bar item     | `true`                     |
| `tokvigil.enableAutocomplete` | Enable autocomplete      | `true`                     |
| `tokvigil.enableHover`        | Enable hover docs        | `true`                     |
| `tokvigil.enableDiagnostics`  | Enable inline validation | `true`                     |

## Getting Started

1. Install the extension
2. Set your API key: `Ctrl+Shift+P` → "TokVigil: Set API Key"
3. Start coding with snippets: type `tfinit` and press Tab

## Links

- [Documentation](https://tokvigil.com/docs)
- [Dashboard](https://tokvigil.com/dashboard)
