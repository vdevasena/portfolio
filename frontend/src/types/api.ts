export type ChatMessage = { user: string; bot: string };
export type ChatRequest = { message: string; history: [string, string][] };
export type ChatResponse = { response: string; sources?: string[] };