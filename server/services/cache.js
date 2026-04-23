const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => console.log('Redis connected'));
let lastRedisErrorAt = 0;
redis.on('error', (err) => {
  // Avoid spamming logs during reconnect loops (e.g. when running without Docker).
  const now = Date.now();
  if (now - lastRedisErrorAt > 10_000) {
    console.error('Redis error:', err);
    lastRedisErrorAt = now;
  }
});

const KEY_PREFIX = 'match:';
const TTL_SECONDS = 1800; // 30 minutes

async function getCachedCandidates(jobId) {
  try {
    const data = await redis.get(KEY_PREFIX + jobId);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('getCachedCandidates error:', err);
    return null; // treat Redis errors as cache misses — never crash the request
  }
}

async function setCachedCandidates(jobId, data) {
  try {
    await redis.set(KEY_PREFIX + jobId, JSON.stringify(data), 'EX', TTL_SECONDS);
  } catch (err) {
    console.error('setCachedCandidates error:', err);
  }
}

// Uses SCAN (not KEYS) — KEYS blocks Redis on large datasets
async function invalidateByTrade(trade) {
  try {
    let cursor = '0';
    let invalidatedCount = 0;

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        'MATCH', KEY_PREFIX + '*',
        'COUNT', 100
      );
      cursor = nextCursor;

      for (const key of keys) {
        try {
          const raw = await redis.get(key);
          if (!raw) continue;
          const candidates = JSON.parse(raw);
          const affected = Array.isArray(candidates) &&
            candidates.some(c => c.trade === trade);
          if (affected) {
            await redis.del(key);
            invalidatedCount++;
          }
        } catch (parseErr) {
          // Corrupted entry — delete to be safe
          await redis.del(key);
          invalidatedCount++;
        }
      }
    } while (cursor !== '0');

    console.log(`Invalidated ${invalidatedCount} cache keys for trade: ${trade}`);
  } catch (err) {
    console.error('invalidateByTrade error:', err);
  }
}

module.exports = { getCachedCandidates, setCachedCandidates, invalidateByTrade };