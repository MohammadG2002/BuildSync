import dotenv from "dotenv";
import OpenAI from "openai";

// Load env (safe to call; dotenv is already used in server boot)
dotenv.config();

// Initialize OpenAI client only if API key is provided
const client = process.env.AI_API_KEY
  ? new OpenAI({ apiKey: process.env.AI_API_KEY })
  : null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Send a chat-style messages array to the AI provider and return assistant text.
 * messages: [{ role: 'system'|'user'|'assistant', content: string }, ...]
 */
export async function chatReply(messages, options = {}) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("messages must be a non-empty array");
  }

  // If no API key configured, return a friendly message
  if (!client) {
    return "AI chat is currently unavailable. Please configure OPENAI_API_KEY environment variable.";
  }

  // Developer mock mode: return a canned response without calling the provider.
  // Enable by setting AI_MOCK=true in backend/.env. Useful when quota is exhausted
  // or you want to iterate the frontend without making API calls.
  if (process.env.AI_MOCK === "true") {
    const lastUser = messages
      .slice()
      .reverse()
      .find((m) => m.role === "user");
    const userText = lastUser ? lastUser.content : "";
    return `MOCK_REPLY: Received your message (${userText.slice(0, 80)}${
      userText.length > 80 ? "..." : ""
    }).`;
  }

  const primaryModel = process.env.AI_MODEL || "gpt-3.5-turbo";
  const fallbackModel = process.env.AI_FALLBACK_MODEL || "gpt-3.5-turbo";
  const max_tokens = options.max_tokens ?? 600;
  const temperature = options.temperature ?? 0.2;

  const maxRetries = Number(process.env.AI_RETRY_MAX) || 2;
  const baseBackoff = Number(process.env.AI_RETRY_BASE_MS) || 500;

  // Helper to call provider for a given model
  async function callModel(model) {
    return client.chat.completions.create({
      model,
      messages,
      max_tokens,
      temperature,
    });
  }

  // Try primary, then fall back if errors indicate quota/model issues.
  let lastErr = null;
  for (const model of [primaryModel, fallbackModel]) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const resp = await callModel(model);
        const text = resp?.choices?.[0]?.message?.content ?? "";
        const usage = resp?.usage || null;
        return { text, usage };
      } catch (err) {
        lastErr = err;
        // If the error contains a status, and it's not 429/503, break early for this model
        const status = err?.status || err?.statusCode || err?.response?.status;
        const code = err?.code || err?.error?.type || null;
        // If rate limit / quota error, we should retry with backoff and then consider fallback
        const retryable =
          !status ||
          status === 429 ||
          status === 503 ||
          code === "insufficient_quota";
        if (!retryable) {
          break;
        }

        // Respect Retry-After header if available
        const retryAfter =
          Number(
            err?.response?.headers?.["retry-after"] ||
              err?.response?.headers?.["Retry-After"]
          ) || null;
        const wait = retryAfter
          ? retryAfter * 1000
          : baseBackoff * Math.pow(2, attempt) +
            Math.floor(Math.random() * 100);
        await sleep(wait);
        // continue to next attempt
      }
    }
    // after attempts for this model, move to next (fallback)
  }

  // If we reach here, all attempts failed
  console.error("AI provider error - all retries/fallbacks failed", lastErr);
  // Surface a helpful error for callers; they can handle dev-mode display if desired
  const message = lastErr?.message || "AI provider error";
  const err = new Error(message);
  err.cause = lastErr;
  throw err;
}

// Run moderation on a text snippet. Returns the moderation result object.
export async function moderateText(text) {
  if (!text || typeof text !== "string") return null;
  // If mock mode, skip moderation and return safe result
  if (process.env.AI_MOCK === "true") return { flagged: false };

  try {
    const result = await client.moderations.create({
      model: process.env.AI_MODERATION_MODEL || "omni-moderation-latest",
      input: text,
    });
    // OpenAI returns results in result?.results
    return result?.results?.[0] ?? result;
  } catch (err) {
    // On moderation error, return null (caller should decide)
    console.error("Moderation error", err?.message || err);
    return null;
  }
}
