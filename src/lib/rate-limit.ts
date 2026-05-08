import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory fallback for local development if Redis is not configured
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const localCache = new Map<string, RateLimitRecord>();

let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per 60 seconds
    analytics: true,
    prefix: "@upstash/ratelimit",
  });
}

/**
 * Rate limiter that uses Redis (Upstash) if configured, 
 * otherwise falls back to a simple in-memory map for local dev.
 */
export async function rateLimit(identifier: string, limit: number = 5, windowMs: number = 60000) {
  // If Redis is configured, use Upstash
  if (ratelimit) {
    const { success, remaining, reset } = await ratelimit.limit(identifier);
    return { success, remaining, reset };
  }

  // Fallback to in-memory for local dev
  const now = Date.now();
  const record = localCache.get(identifier);

  if (!record || now > record.resetTime) {
    localCache.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, reset: record.resetTime };
  }

  record.count++;
  return { success: true, remaining: limit - record.count, reset: record.resetTime };
}
