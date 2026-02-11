export const MODEL_LIST: Record<string, string[]> = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
  anthropic: [
    "claude-3-5-sonnet",
    "claude-3-5-haiku",
    "claude-3-opus",
    "claude-3-sonnet",
    "claude-3-haiku",
  ],
  google: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"],
  mistral: ["mistral-large", "mistral-medium", "mistral-small"],
  meta: ["llama-3-70b", "llama-3-8b"],
  cohere: ["command-r-plus", "command-r"],
};

export const ALL_MODELS = Object.values(MODEL_LIST).flat();
export const PROVIDERS = Object.keys(MODEL_LIST);
