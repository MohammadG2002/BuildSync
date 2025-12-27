/**
 * General Rate Limiter
 * Limits requests per IP address for all endpoints
 */

import rateLimit from "express-rate-limit";

// Helper to parse integer env vars safely
const parseIntEnv = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
};

// Determine window (ms): prefer explicit RATE_LIMIT_WINDOW_MS, otherwise accept RATE_LIMIT_WINDOW (minutes)
const windowMs =
  parseIntEnv(process.env.RATE_LIMIT_WINDOW_MS, null) ||
  parseIntEnv(process.env.RATE_LIMIT_WINDOW, 15) * 60 * 1000;

// Determine max requests per window. Increased default to 1000 to reduce false blocks.
const maxRequests = parseIntEnv(process.env.RATE_LIMIT_MAX_REQUESTS, 1000);

export const rateLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health check and local development
    if (process.env.NODE_ENV === "development") return true;
    return req.path === "/health";
  },
});
