const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => console.log('Redis connected'));
let lastRedisErrorAt = 0;
redis.on('error', (err) => {
  // Avoid spamming logs during reconnect loops (e.g. when running without Docker).
  const now = Date.now();
  if (now - lastRedisErrorAt > 60_000) {
    console.warn('Redis not available (Docker might be down). Caching disabled, falling back to direct DB queries.');
    lastRedisErrorAt = now;
  }
});

const KEY_PREFIX = 'match:';
const JOB_MATCH_PREFIX = 'matchJobs:';
const TTL_SECONDS = 1800; // 30 minutes

// Helper to build key: match:TRADE:JOBID
const buildCandidateKey = (trade, jobId) => `${KEY_PREFIX}${trade.toLowerCase().trim()}:${jobId}`;

async function getCachedCandidates(jobId, trade) {
  try {
    const key = buildCandidateKey(trade, jobId);
    const data = await redis.get(key);
    if (data) {
      console.log(`[REDIS] Cache HIT for candidates of Job ID: ${jobId} (Trade: ${trade})`);
      return JSON.parse(data);
    }
    console.log(`[REDIS] Cache MISS for candidates of Job ID: ${jobId} (Trade: ${trade})`);
    return null;
  } catch (err) {
    console.error('getCachedCandidates error:', err);
    return null;
  }
}

async function setCachedCandidates(jobId, trade, data) {
  try {
    const key = buildCandidateKey(trade, jobId);
    await redis.set(key, JSON.stringify(data), 'EX', TTL_SECONDS);
  } catch (err) {
    console.error('setCachedCandidates error:', err);
  }
}

async function getCachedJobs(studentId) {
  try {
    const data = await redis.get(JOB_MATCH_PREFIX + studentId);
    if (data) {
      console.log(`[REDIS] Cache HIT for Smart Match of Student ID: ${studentId}`);
      return JSON.parse(data);
    }
    console.log(`[REDIS] Cache MISS for Smart Match of Student ID: ${studentId}`);
    return null;
  } catch (err) {
    console.error('getCachedJobs error:', err);
    return null;
  }
}

async function setCachedJobs(studentId, data) {
  try {
    await redis.set(JOB_MATCH_PREFIX + studentId, JSON.stringify(data), 'EX', TTL_SECONDS);
  } catch (err) {
    console.error('setCachedJobs error:', err);
  }
}

// Uses SCAN (not KEYS) — KEYS blocks Redis on large datasets
async function invalidateByTrade(trade) {
  try {
    const tradeKey = trade.toLowerCase().trim();
    let cursor = '0';
    let invalidatedCount = 0;

    console.log(`[REDIS] Starting selective invalidation for trade: "${tradeKey}"`);

    // First, let's see what keys actually exist to debug the mismatch
    const allKeys = await redis.keys(`${KEY_PREFIX}*`);
    console.log(`[REDIS] Current cache keys in Redis:`, allKeys);

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        'MATCH', `${KEY_PREFIX}${tradeKey}:*`,
        'COUNT', 100
      );
      cursor = nextCursor;

      if (keys.length > 0) {
        console.log(`[REDIS] Found ${keys.length} keys to delete for trade ${tradeKey}:`, keys);
        await redis.del(...keys);
        invalidatedCount += keys.length;
      }
    } while (cursor !== '0');

    console.log(`[REDIS] Successfully invalidated ${invalidatedCount} keys for trade: ${trade}`);
  } catch (err) {
    console.error('invalidateByTrade error:', err);
  }
}

async function invalidateStudentMatches() {
  try {
    let cursor = '0';
    let count = 0;
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', JOB_MATCH_PREFIX + '*', 'COUNT', 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
        count += keys.length;
      }
    } while (cursor !== '0');
    console.log(`Invalidated ${count} student-side match cache keys.`);
  } catch (err) {
    console.error('invalidateStudentMatches error:', err);
  }
}

async function invalidateStudentMatch(studentId) {
  try {
    await redis.del(JOB_MATCH_PREFIX + studentId);
    console.log(`Invalidated student match cache for student: ${studentId}`);
  } catch (err) {
    console.error('invalidateStudentMatch error:', err);
  }
}

module.exports = { getCachedCandidates, setCachedCandidates, invalidateByTrade, getCachedJobs, setCachedJobs, invalidateStudentMatches, invalidateStudentMatch };